import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const resumeData = pgTable("resume_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  personalInfo: jsonb("personal_info").notNull(),
  summary: jsonb("summary").notNull(),
  experience: jsonb("experience").notNull(),
  projects: jsonb("projects").notNull(),
  skills: jsonb("skills").notNull(),
  education: jsonb("education").notNull(),
  contact: jsonb("contact").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertResumeDataSchema = createInsertSchema(resumeData).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ResumeData = typeof resumeData.$inferSelect;
export type InsertResumeData = z.infer<typeof insertResumeDataSchema>;
