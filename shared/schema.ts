import { pgTable, text, serial, integer, boolean, jsonb, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enhanced user schema with OAuth support
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  username: varchar("username", { length: 100 }).unique(),
  password: varchar("password", { length: 255 }), // Optional for OAuth users
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  profileImageUrl: text("profile_image_url"),
  provider: varchar("provider", { length: 50 }).default("local"), // 'local', 'google'
  providerId: varchar("provider_id", { length: 255 }),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
  firstName: true,
  lastName: true,
});

// Registration schema
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must be less than 50 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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

// Artist Profiles table
export const artistProfiles = pgTable("artist_profiles", {
  id: varchar("id").primaryKey().notNull(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  artistName: varchar("artist_name").notNull(),
  bio: text("bio").default(""),
  genre: varchar("genre").default(""),
  location: varchar("location").default(""),
  influences: text("influences").array().default([]),
  socialLinks: jsonb("social_links").default({}),
  photos: text("photos").array().default([]),
  songs: jsonb("songs").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertArtistProfileSchema = createInsertSchema(artistProfiles).pick({
  artistName: true,
  bio: true,
  genre: true,
  location: true,
  influences: true,
  socialLinks: true,
  photos: true,
  songs: true,
});

export const artistProfileRequestSchema = z.object({
  artistName: z.string().min(1, "Artist name is required"),
  bio: z.string().default(""),
  genre: z.string().default(""),
  location: z.string().default(""),
  influences: z.array(z.string()).default([]),
  socialLinks: z.object({
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    spotify: z.string().optional(),
    soundcloud: z.string().optional(),
  }).default({}),
  photos: z.array(z.string()).default([]),
  songs: z.array(z.object({
    id: z.string(),
    title: z.string(),
    fileUrl: z.string(),
    uploadDate: z.string(),
  })).default([]),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLyrics = z.infer<typeof insertLyricsSchema>;
export type Lyrics = typeof lyrics.$inferSelect;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type EnhanceLyricsRequest = z.infer<typeof enhanceLyricsRequestSchema>;
export type OpenAIEnhanceLyricsRequest = z.infer<typeof openAIEnhanceLyricsRequestSchema>;
export type SongwriterRequest = z.infer<typeof songwriterRequestSchema>;
export type SoundDesignRequest = z.infer<typeof soundDesignRequestSchema>;
export type StyleTransformerRequest = z.infer<typeof styleTransformerRequestSchema>;
// Playlists table
export const playlists = pgTable("playlists", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name").notNull(),
  description: text("description").default(""),
  songIds: text("song_ids").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPlaylistSchema = createInsertSchema(playlists).pick({
  name: true,
  description: true,
  songIds: true,
});

export const playlistRequestSchema = z.object({
  name: z.string().min(1, "Playlist name is required"),
  description: z.string().default(""),
  songs: z.array(z.string()).default([]),
});

export type InsertArtistProfile = z.infer<typeof insertArtistProfileSchema>;
export type ArtistProfile = typeof artistProfiles.$inferSelect;
export type ArtistProfileRequest = z.infer<typeof artistProfileRequestSchema>;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;
export type PlaylistRequest = z.infer<typeof playlistRequestSchema>;
