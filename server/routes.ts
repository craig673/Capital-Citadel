import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import { insertUserSchema } from "@shared/schema";
import { sendNewAccessRequestEmail, sendDenialEmail } from "./email";

const { Pool } = pg;
const PgSession = connectPgSimple(session);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    isApproved: boolean;
  };
}

const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = await storage.getUser(req.session.userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  req.user = user;
  next();
};

const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  await requireAuth(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    next();
  });
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      store: new PgSession({
        pool,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  // Register (Request Access)
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        // Check if user has been denied twice in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        if (
          existingUser.denialCount >= 2 &&
          existingUser.lastDenialDate &&
          existingUser.lastDenialDate > sevenDaysAgo
        ) {
          return res.status(429).json({ 
            error: "Access request limit reached. Please try again in 7 days." 
          });
        }

        // If already approved, don't allow re-registration
        if (existingUser.isApproved) {
          return res.status(400).json({ error: "This email already has an approved account." });
        }

        // If pending, don't allow duplicate
        return res.status(400).json({ error: "A request with this email is already pending." });
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
        isApproved: false,
        role: "user",
      });

      // Send email notification to admin
      sendNewAccessRequestEmail({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });

      res.json({ 
        message: "Your request has been submitted. You will be notified once an administrator approves your access.",
        email: user.email 
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Registration failed" });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      if (!user.isApproved) {
        return res.status(403).json({ error: "Your account is still pending approval." });
      }

      req.session.userId = user.id;
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Login failed" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req: AuthRequest, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  // Admin: Get pending users
  app.get("/api/admin/pending-users", requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const pendingUsers = await storage.getPendingUsers();
      const usersWithoutPasswords = pendingUsers.map(({ password, ...user }) => user);
      res.json({ users: usersWithoutPasswords });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch pending users" });
    }
  });

  // Admin: Approve user
  app.post("/api/admin/approve-user/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { role } = req.body;
      
      // Validate role if provided
      const validRoles = ["user", "admin"];
      const assignRole = validRoles.includes(role) ? role : "user";
      
      const user = await storage.approveUser(userId, assignRole);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to approve user" });
    }
  });

  // Admin: Deny user
  app.post("/api/admin/deny-user/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      
      // Get user before updating for email
      const userBefore = await storage.getUser(userId);
      if (!userBefore) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update denial count and date
      const user = await storage.denyUser(userId);
      if (!user) {
        return res.status(404).json({ error: "Failed to deny user" });
      }

      // Send denial email
      sendDenialEmail({
        firstName: userBefore.firstName,
        email: userBefore.email,
      });

      // Delete the user from pending list (they can re-apply later if under limit)
      await storage.deleteUser(userId);

      res.json({ message: "User denied and removed from pending list" });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to deny user" });
    }
  });

  return httpServer;
}
