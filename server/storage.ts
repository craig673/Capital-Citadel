import { type User, type InsertUser, users, type DocumentUpload, type InsertDocumentUpload, documentUploads, type PublishedDocument, type InsertPublishedDocument, publishedDocuments, type Application, type InsertApplication, applications, type Job, type InsertJob, jobs } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, desc, and, gte } from "drizzle-orm";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getPendingUsers(): Promise<User[]>;
  approveUser(id: string, role?: string): Promise<User | undefined>;
  denyUser(id: string): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;
  getAllUsers(): Promise<User[]>;
  getApprovedUsers(): Promise<User[]>;
  banUser(id: string, reason: string): Promise<User | undefined>;
  reactivateUser(id: string): Promise<User | undefined>;
  updateUser(id: string, data: { firstName?: string; lastName?: string; role?: string }): Promise<User | undefined>;
  createDocumentUpload(upload: InsertDocumentUpload): Promise<DocumentUpload>;
  getAllDocumentUploads(): Promise<(DocumentUpload & { user: User })[]>;
  getDocumentUpload(id: string): Promise<DocumentUpload | undefined>;
  createPublishedDocument(doc: InsertPublishedDocument): Promise<PublishedDocument>;
  getPublishedDocumentsByCategory(category: string): Promise<PublishedDocument[]>;
  getRecentLetters(limit: number): Promise<PublishedDocument[]>;
  deletePublishedDocument(id: string): Promise<void>;
  getPublishedDocument(id: string): Promise<PublishedDocument | undefined>;
  getRecentApplicationByEmail(email: string, withinDays: number): Promise<Application | undefined>;
  createApplication(app: InsertApplication): Promise<Application>;
  createJob(job: InsertJob): Promise<Job>;
  getAllJobs(): Promise<Job[]>;
  getOpenJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  updateJobStatus(id: string, status: string): Promise<Job | undefined>;
  getApplicationsByJobId(jobId: string): Promise<Application[]>;
  getAllApplications(): Promise<Application[]>;
}

export class DrizzleStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getPendingUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isApproved, false));
  }

  async approveUser(id: string, role: string = "user"): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ isApproved: true, role })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async denyUser(id: string): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ 
        denialCount: users.denialCount, 
        lastDenialDate: new Date() 
      })
      .where(eq(users.id, id))
      .returning();
    
    if (result[0]) {
      // Increment denial count manually since we can't do arithmetic in set
      const updated = await db
        .update(users)
        .set({ denialCount: (result[0].denialCount || 0) + 1 })
        .where(eq(users.id, id))
        .returning();
      return updated[0];
    }
    return result[0];
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getApprovedUsers(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.isApproved, true));
  }

  async banUser(id: string, reason: string): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ accountStatus: "banned", banReason: reason })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async reactivateUser(id: string): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ accountStatus: "active", banReason: null })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async updateUser(id: string, data: { firstName?: string; lastName?: string; role?: string }): Promise<User | undefined> {
    const updateData: Partial<{ firstName: string; lastName: string; role: string }> = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.role !== undefined) updateData.role = data.role;
    
    if (Object.keys(updateData).length === 0) {
      return await this.getUser(id);
    }
    
    const result = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async createDocumentUpload(upload: InsertDocumentUpload): Promise<DocumentUpload> {
    const result = await db.insert(documentUploads).values(upload).returning();
    return result[0];
  }

  async getAllDocumentUploads(): Promise<(DocumentUpload & { user: User })[]> {
    const uploads = await db
      .select({
        id: documentUploads.id,
        userId: documentUploads.userId,
        fileName: documentUploads.fileName,
        storedPath: documentUploads.storedPath,
        uploadDate: documentUploads.uploadDate,
        user: users,
      })
      .from(documentUploads)
      .innerJoin(users, eq(documentUploads.userId, users.id))
      .orderBy(desc(documentUploads.uploadDate));
    
    return uploads.map(row => ({
      id: row.id,
      userId: row.userId,
      fileName: row.fileName,
      storedPath: row.storedPath,
      uploadDate: row.uploadDate,
      user: row.user,
    }));
  }

  async getDocumentUpload(id: string): Promise<DocumentUpload | undefined> {
    const result = await db.select().from(documentUploads).where(eq(documentUploads.id, id));
    return result[0];
  }

  async createPublishedDocument(doc: InsertPublishedDocument): Promise<PublishedDocument> {
    const result = await db.insert(publishedDocuments).values(doc).returning();
    return result[0];
  }

  async getPublishedDocumentsByCategory(category: string): Promise<PublishedDocument[]> {
    return await db
      .select()
      .from(publishedDocuments)
      .where(eq(publishedDocuments.category, category))
      .orderBy(desc(publishedDocuments.publishDate));
  }

  async getRecentLetters(limit: number): Promise<PublishedDocument[]> {
    return await db
      .select()
      .from(publishedDocuments)
      .where(eq(publishedDocuments.category, "letter"))
      .orderBy(desc(publishedDocuments.publishDate))
      .limit(limit);
  }

  async deletePublishedDocument(id: string): Promise<void> {
    await db.delete(publishedDocuments).where(eq(publishedDocuments.id, id));
  }

  async getPublishedDocument(id: string): Promise<PublishedDocument | undefined> {
    const result = await db.select().from(publishedDocuments).where(eq(publishedDocuments.id, id));
    return result[0];
  }
  async getRecentApplicationByEmail(email: string, withinDays: number): Promise<Application | undefined> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - withinDays);
    const result = await db
      .select()
      .from(applications)
      .where(and(eq(applications.email, email), gte(applications.submittedAt, cutoff)))
      .orderBy(desc(applications.submittedAt))
      .limit(1);
    return result[0];
  }

  async createApplication(app: InsertApplication): Promise<Application> {
    const result = await db.insert(applications).values(app).returning();
    return result[0];
  }

  async createJob(job: InsertJob): Promise<Job> {
    const result = await db.insert(jobs).values(job).returning();
    return result[0];
  }

  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }

  async getOpenJobs(): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.status, "open")).orderBy(desc(jobs.createdAt));
  }

  async getJob(id: string): Promise<Job | undefined> {
    const result = await db.select().from(jobs).where(eq(jobs.id, id));
    return result[0];
  }

  async updateJobStatus(id: string, status: string): Promise<Job | undefined> {
    const result = await db.update(jobs).set({ status }).where(eq(jobs.id, id)).returning();
    return result[0];
  }

  async getApplicationsByJobId(jobId: string): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.jobId, jobId)).orderBy(desc(applications.submittedAt));
  }

  async getAllApplications(): Promise<Application[]> {
    return await db.select().from(applications).orderBy(desc(applications.submittedAt));
  }
}

export const storage = new DrizzleStorage();
