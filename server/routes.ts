import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { sendNewAccessRequestEmail, sendDenialEmail, sendTestEmail, sendWelcomeEmail, sendDocumentUploadEmail, sendApplicationEmail, sendApplicationConfirmationEmail, sendRejectionEmail } from "./email";
import { objectStorageClient } from "./replit_integrations/object_storage";

function getPrivateObjectDir(): string {
  const dir = process.env.PRIVATE_OBJECT_DIR || "";
  if (!dir) {
    throw new Error("PRIVATE_OBJECT_DIR not set");
  }
  return dir;
}

function parseObjectPath(objPath: string): { bucketName: string; objectName: string } {
  if (!objPath.startsWith("/")) {
    objPath = `/${objPath}`;
  }
  const parts = objPath.split("/");
  if (parts.length < 3) {
    throw new Error("Invalid path: must contain at least a bucket name");
  }
  return { bucketName: parts[1], objectName: parts.slice(2).join("/") };
}

async function uploadToObjectStorage(buffer: Buffer, folder: string, originalName: string, contentType: string): Promise<string> {
  const ext = path.extname(originalName);
  const uniqueName = `${randomUUID()}${ext}`;
  const privateDir = getPrivateObjectDir();
  const objectPath = `${privateDir}/${folder}/${uniqueName}`;
  const { bucketName, objectName } = parseObjectPath(objectPath);
  const bucket = objectStorageClient.bucket(bucketName);
  const file = bucket.file(objectName);
  await file.save(buffer, { contentType });
  return objectPath;
}

async function downloadFromObjectStorage(objectPath: string, res: Response, downloadName: string) {
  if (!objectPath.includes("/")) {
    return res.status(404).json({ error: "File not found — it was uploaded before cloud storage migration and needs to be re-uploaded" });
  }
  const { bucketName, objectName } = parseObjectPath(objectPath);
  const bucket = objectStorageClient.bucket(bucketName);
  const file = bucket.file(objectName);
  const [exists] = await file.exists();
  if (!exists) {
    return res.status(404).json({ error: "File not found on server" });
  }
  const [metadata] = await file.getMetadata();
  res.set({
    "Content-Type": metadata.contentType || "application/octet-stream",
    "Content-Disposition": `attachment; filename="${encodeURIComponent(downloadName)}"`,
  });
  if (metadata.size) {
    res.set("Content-Length", String(metadata.size));
  }
  const stream = file.createReadStream();
  stream.on("error", (err) => {
    console.error("Stream error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Error streaming file" });
    }
  });
  stream.pipe(res);
}

async function deleteFromObjectStorage(objectPath: string) {
  if (!objectPath.includes("/")) {
    return;
  }
  const { bucketName, objectName } = parseObjectPath(objectPath);
  const bucket = objectStorageClient.bucket(bucketName);
  const file = bucket.file(objectName);
  const [exists] = await file.exists();
  if (exists) {
    await file.delete();
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
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
  // Trust proxy for secure cookies behind Replit's reverse proxy
  app.set("trust proxy", 1);

  app.use(
    session({
      store: new PgSession({
        pool,
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      proxy: true,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: true,
        sameSite: "lax",
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

      const objectPath = await uploadToObjectStorage(
        req.file.buffer,
        "user-uploads",
        req.file.originalname,
        req.file.mimetype
      );

      const documentUpload = await storage.createDocumentUpload({
        userId: req.user!.id,
        fileName: req.file.originalname,
        storedPath: objectPath,
      });

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

      await downloadFromObjectStorage(document.storedPath, res, document.fileName);
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

  const publishedUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
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

      const objectPath = await uploadToObjectStorage(
        req.file.buffer,
        "published-documents",
        req.file.originalname,
        req.file.mimetype
      );

      const doc = await storage.createPublishedDocument({
        title,
        fileName: req.file.originalname,
        storedPath: objectPath,
        category,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
      });

      res.json({ document: doc });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to publish document" });
    }
  });

  // Get recent investor letters (authenticated users) - MUST be before :category route
  app.get("/api/documents/letters/recent", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 4;
      const documents = await storage.getRecentLetters(limit);
      res.json({ documents });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch recent letters" });
    }
  });

  // Download published document (authenticated users) - MUST be before :category route
  app.get("/api/documents/download/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const docId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const document = await storage.getPublishedDocument(docId);
      
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      await downloadFromObjectStorage(document.storedPath, res, document.fileName);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to download document" });
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

  // Admin: Delete a published document (fund documents only)
  app.delete("/api/admin/documents/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const docId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const document = await storage.getPublishedDocument(docId);
      
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      await deleteFromObjectStorage(document.storedPath);
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

  // Admin: Create a new job posting
  app.post("/api/admin/jobs", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { title, location, employmentType, internshipStartDate, internshipEndDate, roleDescription, responsibilities, requirements, whatWeOffer } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }
      const job = await storage.createJob({
        title,
        location: location || "Remote",
        employmentType: employmentType || "Full Time",
        internshipStartDate: internshipStartDate || null,
        internshipEndDate: internshipEndDate || null,
        roleDescription: roleDescription || "",
        responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
        requirements: Array.isArray(requirements) ? requirements : [],
        whatWeOffer: Array.isArray(whatWeOffer) ? whatWeOffer : [],
        status: "open",
      });
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create job" });
    }
  });

  // Admin: Get all jobs
  app.get("/api/admin/jobs", requireAdmin, async (req: Request, res: Response) => {
    try {
      const allJobs = await storage.getAllJobs();
      res.json(allJobs);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch jobs" });
    }
  });

  // Admin: Update an existing job posting
  app.put("/api/admin/jobs/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const jobId = req.params.id as string;
      const existing = await storage.getJob(jobId);
      if (!existing) return res.status(404).json({ error: "Job not found" });

      const { title, location, employmentType, internshipStartDate, internshipEndDate, roleDescription, responsibilities, requirements, whatWeOffer } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }
      const job = await storage.updateJob(jobId, {
        title,
        location: location || "Remote",
        employmentType: employmentType || "Full Time",
        internshipStartDate: internshipStartDate || null,
        internshipEndDate: internshipEndDate || null,
        roleDescription: roleDescription || "",
        responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
        requirements: Array.isArray(requirements) ? requirements : [],
        whatWeOffer: Array.isArray(whatWeOffer) ? whatWeOffer : [],
      });
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update job" });
    }
  });

  // Admin: Toggle job status
  app.patch("/api/admin/jobs/:id/status", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      if (!["open", "closed"].includes(status)) {
        return res.status(400).json({ error: "Status must be 'open' or 'closed'" });
      }
      const job = await storage.updateJobStatus(req.params.id as string, status);
      if (!job) return res.status(404).json({ error: "Job not found" });
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update job status" });
    }
  });

  // Admin: Delete a job and its linked applications
  app.delete("/api/admin/jobs/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const job = await storage.getJob(req.params.id as string);
      if (!job) return res.status(404).json({ error: "Job not found" });
      await storage.deleteJob(req.params.id as string);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to delete job" });
    }
  });

  // Admin: Get applicants for a specific job
  app.get("/api/admin/jobs/:id/applicants", requireAdmin, async (req: Request, res: Response) => {
    try {
      const applicants = await storage.getApplicationsByJobId(req.params.id as string);
      res.json(applicants);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch applicants" });
    }
  });

  // Admin: Get all applications (general / no specific job)
  app.get("/api/admin/applications", requireAdmin, async (req: Request, res: Response) => {
    try {
      storage.archiveOldRejected().catch((err) =>
        console.error("[applications] Auto-archive failed (non-blocking):", err)
      );
      const allApps = await storage.getAllApplications();
      res.json(allApps);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch applications" });
    }
  });

  app.patch("/api/admin/applications/:id/archive", requireAdmin, async (req: Request, res: Response) => {
    try {
      const updated = await storage.archiveApplication(req.params.id as string);
      if (!updated) return res.status(404).json({ error: "Application not found" });
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to archive application" });
    }
  });

  // Admin: Update application review status
  app.patch("/api/admin/applications/:id/status", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { reviewStatus } = req.body;
      if (!["new", "reviewed", "shortlisted", "rejected"].includes(reviewStatus)) {
        return res.status(400).json({ error: "Invalid review status" });
      }
      const updated = await storage.updateApplicationStatus(req.params.id as string, reviewStatus);
      if (!updated) return res.status(404).json({ error: "Application not found" });

      if (reviewStatus === "rejected" && updated.name && updated.email) {
        sendRejectionEmail({ name: updated.name, email: updated.email }).catch((err) =>
          console.error("[applications] Rejection email failed (non-blocking):", err)
        );
      }

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update application status" });
    }
  });

  // Admin: Download applicant resume
  app.get("/api/admin/applications/:id/resume/:index", requireAdmin, async (req: Request, res: Response) => {
    try {
      const apps = await storage.getAllApplications();
      const app_record = apps.find(a => a.id === (req.params.id as string));
      if (!app_record || !app_record.resumePaths) {
        return res.status(404).json({ error: "Resume not found" });
      }
      const paths = JSON.parse(app_record.resumePaths) as { path: string; name: string }[];
      const idx = parseInt(req.params.index as string);
      if (isNaN(idx) || idx < 0 || idx >= paths.length) {
        return res.status(404).json({ error: "Resume not found" });
      }
      await downloadFromObjectStorage(paths[idx].path, res, paths[idx].name);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to download resume" });
    }
  });

  // Public: Get open jobs
  app.get("/api/jobs/open", async (req: Request, res: Response) => {
    try {
      const openJobs = await storage.getOpenJobs();
      res.json(openJobs);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to fetch jobs" });
    }
  });

  const applicationUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only PDF and Word documents are allowed"));
      }
    },
  });

  app.post("/api/applications", applicationUpload.array("files", 5), async (req: Request, res: Response) => {
    try {
      const { name, email, jobId } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
      }

      const adminUser = await storage.getUserByEmail(email.trim().toLowerCase());
      const isAdmin = adminUser?.role === "admin";
      if (!isAdmin) {
        const recentApp = await storage.getRecentApplicationByEmail(email.trim().toLowerCase(), 30);
        if (recentApp) {
          return res.status(429).json({ error: "You've already submitted documentation. We will be in contact soon." });
        }
      }

      const files = (req.files as Express.Multer.File[]) || [];
      const attachments = files.map((f) => ({
        filename: f.originalname,
        content: f.buffer,
      }));

      // Store files in object storage for admin download
      const storedFiles: { path: string; name: string }[] = [];
      for (const f of files) {
        try {
          const storedPath = await uploadToObjectStorage(f.buffer, "applications", f.originalname, f.mimetype);
          storedFiles.push({ path: storedPath, name: f.originalname });
        } catch (uploadErr) {
          console.error("[applications] File upload error:", uploadErr);
        }
      }

      await sendApplicationEmail({ name, email }, attachments);
      sendApplicationConfirmationEmail({ name, email }).catch((err) =>
        console.error("[applications] Confirmation email failed (non-blocking):", err)
      );
      await storage.createApplication({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        jobId: jobId || null,
        resumePaths: storedFiles.length > 0 ? JSON.stringify(storedFiles) : null,
      });
      res.json({ success: true, message: "Application submitted successfully" });
    } catch (error: any) {
      console.error("[applications] Failed to process application:", error);
      res.status(500).json({ error: "Failed to submit application. Please try again." });
    }
  });

  return httpServer;
}
