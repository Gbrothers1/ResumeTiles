import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for express-session
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  gpgPublicKey: text("gpg_public_key"),
  gpgEnabled: boolean("gpg_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// API keys table for secure API access
export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  keyName: varchar("key_name", { length: 100 }).notNull(),
  hashedKey: text("hashed_key").notNull(),
  isActive: boolean("is_active").default(true),
  userId: varchar("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
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

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  createdAt: true,
});

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const gpgSettingsSchema = z.object({
  gpgPublicKey: z.string().optional(),
  gpgEnabled: z.boolean(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type ResumeData = typeof resumeData.$inferSelect;
export type InsertResumeData = z.infer<typeof insertResumeDataSchema>;
export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type GpgSettings = z.infer<typeof gpgSettingsSchema>;
