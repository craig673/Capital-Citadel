import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isApproved: boolean("is_approved").notNull().default(false),
  role: text("role").notNull().default("user"),
  denialCount: integer("denial_count").notNull().default(0),
  lastDenialDate: timestamp("last_denial_date"),
  accountStatus: text("account_status").notNull().default("active"),
  banReason: text("ban_reason"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  denialCount: true,
  lastDenialDate: true,
  accountStatus: true,
  banReason: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const documentUploads = pgTable("document_uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fileName: text("file_name").notNull(),
  storedPath: text("stored_path").notNull(),
  uploadDate: timestamp("upload_date").notNull().default(sql`now()`),
});

export const insertDocumentUploadSchema = createInsertSchema(documentUploads).omit({
  id: true,
  uploadDate: true,
});

export type InsertDocumentUpload = z.infer<typeof insertDocumentUploadSchema>;
export type DocumentUpload = typeof documentUploads.$inferSelect;
