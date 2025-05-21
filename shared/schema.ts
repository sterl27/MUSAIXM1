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
    flowStrength: z.number().min(1).max(5),
    musicStyle: z.string().nullable()
  }),
  customDescription: z.string().optional()
});

// Schema for OpenAI lyrics enhancement request
export const openAIEnhanceLyricsRequestSchema = z.object({
  lyrics: z.string().min(1, "Lyrics cannot be empty"),
  prompt: z.string().default("Transform these lyrics in your own style"),
  temperature: z.number().min(0.1).max(1.0).default(0.7),
  personaId: z.string().nullable(),
  useAI: z.boolean().default(true)
});

// Schema for SongWriter request
export const songwriterRequestSchema = z.object({
  topic: z.string().optional(),
  mood: z.string().default("happy"),
  genre: z.string().optional(),
  structure: z.string().default("verse-chorus-verse-chorus-bridge-chorus"),
  linesPerVerse: z.number().min(4).max(24).default(16),
  personaId: z.string().nullable()
});

// Schema for SoundDesign request
export const soundDesignRequestSchema = z.object({
  description: z.string().min(1, "Sound description is required"),
  effects: z.array(z.string()).default([]),
  instruments: z.array(z.string()).default([])
});

// Schema for StyleTransformer request
export const styleTransformerRequestSchema = z.object({
  lyrics: z.string().min(1, "Lyrics cannot be empty"),
  targetStyle: z.string().min(1, "Target style must be selected"),
  mood: z.string().optional(),
  strength: z.number().min(0.25).max(1).default(0.5),
  preserveStructure: z.boolean().default(true),
  keepRhymes: z.boolean().default(true),
  maintainThemes: z.boolean().default(true),
  enhanceImagery: z.boolean().default(false),
  customInstructions: z.string().optional(),
  useAI: z.boolean().default(true)
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLyrics = z.infer<typeof insertLyricsSchema>;
export type Lyrics = typeof lyrics.$inferSelect;
export type EnhanceLyricsRequest = z.infer<typeof enhanceLyricsRequestSchema>;
export type OpenAIEnhanceLyricsRequest = z.infer<typeof openAIEnhanceLyricsRequestSchema>;
export type SongwriterRequest = z.infer<typeof songwriterRequestSchema>;
export type SoundDesignRequest = z.infer<typeof soundDesignRequestSchema>;
export type StyleTransformerRequest = z.infer<typeof styleTransformerRequestSchema>;
