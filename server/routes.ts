import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import path from "path";
import fs from "fs";
import multer from "multer";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { sendNewAccessRequestEmail, sendDenialEmail, sendTestEmail, sendWelcomeEmail, sendDocumentUploadEmail } from "./email";

const UPLOAD_DIR = path.join(process.cwd(), "private_uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"));
    }
  },
});

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

      if (user.accountStatus === "banned") {
        return res.status(403).json({ error: "Your account has been deactivated. Please contact the administrator." });
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

      // Send welcome email (fail-open: don't block approval if email fails)
      sendWelcomeEmail({
        firstName: user.firstName,
        email: user.email,
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to approve user" });
    }
  });

  // Admin: Test email
  app.post("/api/admin/test-email", requireAdmin, async (req: AuthRequest, res: Response) => {
    const result = await sendTestEmail();
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
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

  // Document Upload (authenticated users only)
  app.post("/api/documents/upload", requireAuth, upload.single("file"), async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const documentUpload = await storage.createDocumentUpload({
        userId: req.user!.id,
        fileName: req.file.originalname,
        storedPath: req.file.filename,
      });

      // Send notification email to admin
      sendDocumentUploadEmail(
        { firstName: user.firstName, lastName: user.lastName },
        req.file.originalname
      );

      res.json({ 
        message: "Document uploaded successfully",
        document: {
          id: documentUpload.id,
          fileName: documentUpload.fileName,
          uploadDate: documentUpload.uploadDate,
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to upload document" });
    }
  });

  // Get user's own uploads
  app.get("/api/documents/my-uploads", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const allUploads = await storage.getAllDocumentUploads();
      const userUploads = allUploads
        .filter(upload => upload.userId === req.user!.id)
        .map(upload => ({
          id: upload.id,
          fileName: upload.fileName,
          uploadDate: upload.uploadDate,
        }));
      res.json({ uploads: userUploads });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch uploads" });
    }
  });

  // Admin: Get all document uploads
  app.get("/api/admin/documents", requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const uploads = await storage.getAllDocumentUploads();
      const uploadsWithUserInfo = uploads.map(upload => ({
        id: upload.id,
        fileName: upload.fileName,
        uploadDate: upload.uploadDate,
        investorName: [upload.user.firstName, upload.user.lastName].filter(Boolean).join(" ") || upload.user.email,
        investorEmail: upload.user.email,
      }));
      res.json({ uploads: uploadsWithUserInfo });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch documents" });
    }
  });

  // Admin: Download document
  app.get("/api/admin/documents/:id/download", requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const documentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const document = await storage.getDocumentUpload(documentId);
      
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      const filePath = path.join(UPLOAD_DIR, document.storedPath);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found on server" });
      }

      res.download(filePath, document.fileName);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to download document" });
    }
  });

  // Admin: Get approved users
  app.get("/api/admin/approved-users", requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const approvedUsers = await storage.getApprovedUsers();
      const usersWithoutPassword = approvedUsers.map(user => {
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json({ users: usersWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch approved users" });
    }
  });

  // Admin: Ban user
  app.post("/api/admin/ban-user/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { reason } = req.body;

      if (!reason || reason.trim() === "") {
        return res.status(400).json({ error: "Ban reason is required" });
      }

      // Prevent admin from banning themselves
      if (userId === req.user!.id) {
        return res.status(400).json({ error: "You cannot ban yourself" });
      }

      const user = await storage.banUser(userId, reason.trim());
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to ban user" });
    }
  });

  // Admin: Reactivate user
  app.post("/api/admin/reactivate-user/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      const user = await storage.reactivateUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to reactivate user" });
    }
  });

  // Admin: Update user details
  const updateUserSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    role: z.enum(["user", "admin"]).optional(),
  });

  app.patch("/api/admin/users/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      
      const parseResult = updateUserSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body" });
      }
      
      const { firstName, lastName, role } = parseResult.data;

      const user = await storage.updateUser(userId, { firstName, lastName, role });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update user" });
    }
  });

  // Published Documents Directory
  const PUBLISHED_DIR = path.join(process.cwd(), "published_documents");
  if (!fs.existsSync(PUBLISHED_DIR)) {
    fs.mkdirSync(PUBLISHED_DIR, { recursive: true });
  }

  const publishedStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, PUBLISHED_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, `${uniqueSuffix}${ext}`);
    },
  });

  const publishedUpload = multer({
    storage: publishedStorage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only PDF files are allowed"));
      }
    },
  });

  const publishDocumentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    category: z.enum(["letter", "legal"]),
    publishDate: z.string().optional(),
  });

  // Admin: Publish a new document (letter or fund document)
  app.post("/api/admin/publish-document", requireAdmin, publishedUpload.single("file"), async (req: AuthRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const parseResult = publishDocumentSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: parseResult.error.errors[0]?.message || "Invalid request" });
      }

      const { title, category, publishDate } = parseResult.data;

      const doc = await storage.createPublishedDocument({
        title,
        fileName: req.file.originalname,
        storedPath: req.file.filename,
        category,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
      });

      res.json({ document: doc });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to publish document" });
    }
  });

  // Get published documents by category (authenticated users)
  app.get("/api/documents/:category", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const category = req.params.category;
      if (category !== "letter" && category !== "legal") {
        return res.status(400).json({ error: "Invalid category" });
      }
      
      const documents = await storage.getPublishedDocumentsByCategory(category);
      res.json({ documents });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch documents" });
    }
  });

  // Get recent investor letters (authenticated users)
  app.get("/api/documents/letters/recent", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 4;
      const documents = await storage.getRecentLetters(limit);
      res.json({ documents });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch recent letters" });
    }
  });

  // Download published document (authenticated users)
  app.get("/api/documents/download/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const docId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const document = await storage.getPublishedDocument(docId);
      
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      const filePath = path.join(PUBLISHED_DIR, document.storedPath);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found on server" });
      }

      res.download(filePath, document.fileName);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to download document" });
    }
  });

  // Admin: Delete a published document (fund documents only)
  app.delete("/api/admin/documents/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const docId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const document = await storage.getPublishedDocument(docId);
      
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      // Delete the file from disk
      const filePath = path.join(PUBLISHED_DIR, document.storedPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from database
      await storage.deletePublishedDocument(docId);

      res.json({ message: "Document deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete document" });
    }
  });

  // Admin: Get all published documents (for admin management)
  app.get("/api/admin/published-documents", requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const letters = await storage.getPublishedDocumentsByCategory("letter");
      const fundDocs = await storage.getPublishedDocumentsByCategory("legal");
      res.json({ letters, fundDocs });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch published documents" });
    }
  });

  return httpServer;
}
