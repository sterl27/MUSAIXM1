import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  enhanceLyricsRequestSchema, 
  openAIEnhanceLyricsRequestSchema,
  songwriterRequestSchema,
  soundDesignRequestSchema
} from "@shared/schema";
import { enhanceLyrics } from "./processors/enhancer";
import { enhanceLyricsWithOpenAI } from "./processors/openai-enhancer";
import { generateSongLyrics } from "./processors/songwriter";
import { generateSoundDesignSuggestion } from "./processors/sounddesign";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for lyrics enhancement
  app.post("/api/enhance", async (req, res) => {
    try {
      // Validate request body
      const validationResult = enhanceLyricsRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request body",
          errors: validationResult.error.errors
        });
      }
      
      const { lyrics, personaId, options, customDescription } = validationResult.data;
      
      // Process lyrics through AI enhancement
      const enhancedLyrics = await enhanceLyrics(lyrics, personaId, options, customDescription);
      
      // Store the lyrics in the database (commented out for now)
      // If user is authenticated, you could save to the database
      // const userId = req.session.userId;
      // if (userId) {
      //   await storage.saveLyrics({
      //     userId,
      //     original: lyrics,
      //     enhanced: enhancedLyrics,
      //     personaId,
      //     options,
      //     createdAt: new Date().toISOString()
      //   });
      // }
      
      return res.status(200).json({ enhancedLyrics });
    } catch (error) {
      console.error("Error enhancing lyrics:", error);
      return res.status(500).json({ message: "Failed to enhance lyrics" });
    }
  });

  // API route for OpenAI lyrics enhancement
  app.post("/api/openai/enhance", async (req, res) => {
    try {
      // Validate request body
      const validationResult = openAIEnhanceLyricsRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request body",
          errors: validationResult.error.errors
        });
      }
      
      const { lyrics, prompt, temperature, personaId, useAI } = validationResult.data;
      
      // Process lyrics through OpenAI enhancement
      const enhancedLyrics = await enhanceLyricsWithOpenAI(lyrics, prompt, temperature, personaId, useAI);
      
      return res.status(200).json({ enhancedLyrics });
    } catch (error) {
      console.error("Error enhancing lyrics with OpenAI:", error);
      return res.status(500).json({ message: "Failed to enhance lyrics with OpenAI" });
    }
  });

  // API route for Song Writer
  app.post("/api/songwriter/generate", async (req, res) => {
    try {
      // Validate request body
      const validationResult = songwriterRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request body",
          errors: validationResult.error.errors
        });
      }
      
      const { topic, mood, genre, structure, linesPerVerse, personaId } = validationResult.data;
      
      // Generate song lyrics
      const generatedLyrics = await generateSongLyrics(
        topic || "", 
        mood, 
        genre || "", 
        structure, 
        linesPerVerse, 
        personaId
      );
      
      return res.status(200).json({ generatedLyrics });
    } catch (error) {
      console.error("Error generating song lyrics:", error);
      return res.status(500).json({ message: "Failed to generate song lyrics" });
    }
  });

  // API route for Sound Design
  app.post("/api/sounddesign/suggest", async (req, res) => {
    try {
      // Validate request body
      const validationResult = soundDesignRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request body",
          errors: validationResult.error.errors
        });
      }
      
      const { description, effects, instruments } = validationResult.data;
      
      // Generate sound design suggestions
      const suggestion = await generateSoundDesignSuggestion(
        description,
        effects,
        instruments
      );
      
      return res.status(200).json({ suggestion });
    } catch (error) {
      console.error("Error generating sound design suggestions:", error);
      return res.status(500).json({ message: "Failed to generate sound design suggestions" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
