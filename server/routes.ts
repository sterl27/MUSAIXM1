import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { enhanceLyricsRequestSchema } from "@shared/schema";
import { enhanceLyrics } from "./processors/enhancer";

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
      
      const { lyrics, personaId, options } = validationResult.data;
      
      // Process lyrics through AI enhancement
      const enhancedLyrics = await enhanceLyrics(lyrics, personaId, options);
      
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

  const httpServer = createServer(app);

  return httpServer;
}
