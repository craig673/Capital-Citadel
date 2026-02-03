import { type User, type InsertUser, users, type DocumentUpload, type InsertDocumentUpload, documentUploads } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq, desc } from "drizzle-orm";
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
  createDocumentUpload(upload: InsertDocumentUpload): Promise<DocumentUpload>;
  getAllDocumentUploads(): Promise<(DocumentUpload & { user: User })[]>;
  getDocumentUpload(id: string): Promise<DocumentUpload | undefined>;
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

  async createDocumentUpload(upload: InsertDocumentUpload): Promise<DocumentUpload> {
    const result = await db.insert(documentUploads).values(upload).returning();
    return result[0];
  }

  async getAllDocumentUploads(): Promise<(DocumentUpload & { user: User })[]> {
    const uploads = await db
      .select()
      .from(documentUploads)
      .innerJoin(users, eq(documentUploads.userId, users.id))
      .orderBy(desc(documentUploads.uploadDate));
    
    return uploads.map(row => ({
      ...row.document_uploads,
      user: row.users,
    }));
  }

  async getDocumentUpload(id: string): Promise<DocumentUpload | undefined> {
    const result = await db.select().from(documentUploads).where(eq(documentUploads.id, id));
    return result[0];
  }
}

export const storage = new DrizzleStorage();
