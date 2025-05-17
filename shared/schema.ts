import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema remains the same
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Create lyrics schema
export const lyrics = pgTable("lyrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  original: text("original").notNull(),
  enhanced: text("enhanced").notNull(),
  personaId: text("persona_id").notNull(),
  options: jsonb("options").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertLyricsSchema = createInsertSchema(lyrics).pick({
  userId: true,
  original: true,
  enhanced: true,
  personaId: true,
  options: true,
  createdAt: true,
});

// Define schemas for API requests
export const enhanceLyricsRequestSchema = z.object({
  lyrics: z.string().min(1, "Lyrics cannot be empty"),
  personaId: z.string().min(1, "Persona must be selected"),
  options: z.object({
    includeSunoTags: z.boolean(),
    includeFxCues: z.boolean(),
    flowStrength: z.number().min(1).max(5)
  })
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLyrics = z.infer<typeof insertLyricsSchema>;
export type Lyrics = typeof lyrics.$inferSelect;
export type EnhanceLyricsRequest = z.infer<typeof enhanceLyricsRequestSchema>;
