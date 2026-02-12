import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, timestamp, json } from "drizzle-orm/pg-core";
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

export const publishedDocuments = pgTable("published_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  fileName: text("file_name").notNull(),
  storedPath: text("stored_path").notNull(),
  category: text("category").notNull(),
  publishDate: timestamp("publish_date").notNull().default(sql`now()`),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertPublishedDocumentSchema = createInsertSchema(publishedDocuments).omit({
  id: true,
  createdAt: true,
});

export type InsertPublishedDocument = z.infer<typeof insertPublishedDocumentSchema>;
export type PublishedDocument = typeof publishedDocuments.$inferSelect;

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  location: text("location").notNull().default("Remote"),
  employmentType: text("employment_type").notNull().default("Full Time"),
  internshipStartDate: text("internship_start_date"),
  internshipEndDate: text("internship_end_date"),
  roleDescription: text("role_description").notNull().default(""),
  responsibilities: json("responsibilities").$type<string[]>().notNull().default([]),
  requirements: json("requirements").$type<string[]>().notNull().default([]),
  whatWeOffer: json("what_we_offer").$type<string[]>().notNull().default([]),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  jobId: varchar("job_id").references(() => jobs.id),
  resumePaths: text("resume_paths"),
  reviewStatus: text("review_status").notNull().default("new"),
  submittedAt: timestamp("submitted_at").notNull().default(sql`now()`),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  submittedAt: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
