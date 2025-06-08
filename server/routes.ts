import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  enhanceLyricsRequestSchema, 
  openAIEnhanceLyricsRequestSchema,
  songwriterRequestSchema,
  soundDesignRequestSchema,
  styleTransformerRequestSchema,
  registerSchema,
  loginSchema,
  artistProfileRequestSchema,
  playlistRequestSchema
} from "@shared/schema";
import { setupAuth, requireAuth, optionalAuth, hashPassword } from "./auth";
import passport from "passport";
import { enhanceLyrics } from "./processors/enhancer";
import { enhanceLyricsWithOpenAI } from "./processors/openai-enhancer";
import { analyzeLyricComplexity } from "./processors/complexity-analyzer";
import { improveLyrics } from "./processors/lyric-improver";
import { generateSongLyrics } from "./processors/songwriter";
import { generateSoundDesignSuggestion } from "./processors/sounddesign";
import { transformLyrics } from "./processors/style-transformer";
import { getAvailableVoices, generateSpeech, defaultVoiceMappings } from "./processors/elevenlabs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validationResult = registerSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed",
          errors: validationResult.error.errors 
        });
      }

      const { email, username, password, firstName, lastName } = validationResult.data;

      // Check if user already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // Remove password from response
      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse, message: "Registration successful" });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user as any;
    const { password: _, ...userResponse } = user;
    res.json({ user: userResponse, message: "Login successful" });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      const { password: _, ...userResponse } = user;
      res.json({ user: userResponse });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Google OAuth routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      // Successful authentication, redirect to home
      res.redirect("/");
    }
  );

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

  // API route to get available ElevenLabs voices
  app.get("/api/voices", async (req, res) => {
    try {
      // Check if API key is configured
      if (!process.env.ELEVENLABS_API_KEY) {
        return res.status(500).json({ 
          message: "ElevenLabs API key is not configured" 
        });
      }
      
      // Get available voices
      const voices = await getAvailableVoices();
      
      return res.status(200).json({ voices });
    } catch (error) {
      console.error("Error fetching voices:", error);
      return res.status(500).json({ 
        message: "Failed to fetch voices from ElevenLabs" 
      });
    }
  });
  
  // API route to get voice preview
  app.post("/api/voice/preview", async (req, res) => {
    try {
      const { text, voiceId, modelId, stability, similarityBoost } = req.body;
      
      // Validate inputs
      if (!text || !voiceId) {
        return res.status(400).json({ 
          message: "Missing required parameters: text and voiceId are required" 
        });
      }
      
      // Check if API key is configured
      if (!process.env.ELEVENLABS_API_KEY) {
        return res.status(500).json({ 
          message: "ElevenLabs API key is not configured" 
        });
      }
      
      // Generate speech
      const audioBuffer = await generateSpeech(
        text, 
        voiceId, 
        modelId,
        stability || 0.5,
        similarityBoost || 0.75
      );
      
      // Send audio data
      res.set('Content-Type', 'audio/mpeg');
      res.send(audioBuffer);
    } catch (error) {
      console.error("Error generating voice preview:", error);
      return res.status(500).json({ 
        message: "Failed to generate voice preview" 
      });
    }
  });
  
  // API route to get default voice for persona
  app.get("/api/voice/mapping/:personaId", (req, res) => {
    const { personaId } = req.params;
    
    if (!personaId) {
      return res.status(400).json({ message: "Persona ID is required" });
    }
    
    // Get voice mapping for persona
    const voiceId = defaultVoiceMappings[personaId] || defaultVoiceMappings.default;
    
    return res.status(200).json({ voiceId });
  });

  // API route for Style Transformer
  app.post("/api/style-transformer/transform", async (req, res) => {
    try {
      // Validate request body
      const validationResult = styleTransformerRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request body",
          errors: validationResult.error.errors
        });
      }
      
      const { 
        lyrics, 
        targetStyle, 
        mood, 
        strength, 
        preserveStructure, 
        keepRhymes, 
        maintainThemes, 
        enhanceImagery, 
        customInstructions,
        useAI 
      } = validationResult.data;
      
      // Check if OpenAI API key is configured
      if (useAI && !process.env.OPENAI_API_KEY) {
        return res.status(500).json({ 
          message: "OpenAI API key is not configured" 
        });
      }
      
      // Transform lyrics using the style transformer
      const transformedLyrics = await transformLyrics(
        lyrics,
        {
          targetStyle,
          mood,
          strength,
          preserveStructure,
          keepRhymes,
          maintainThemes,
          enhanceImagery,
          customInstructions
        }
      );
      
      return res.status(200).json({ transformedLyrics });
    } catch (error) {
      console.error("Error transforming lyrics:", error);
      return res.status(500).json({ 
        message: "Failed to transform lyrics",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Artist Profile Routes
  app.get("/api/artist-profile", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getArtistProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      return res.status(200).json(profile);
    } catch (error) {
      console.error("Error fetching artist profile:", error);
      return res.status(500).json({ 
        message: "Failed to fetch profile",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/artist-profile", requireAuth, async (req: any, res) => {
    try {
      const validationResult = artistProfileRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed",
          errors: validationResult.error.errors 
        });
      }

      const userId = req.user.id;
      const profileData = validationResult.data;
      
      const profile = await storage.upsertArtistProfile(userId, profileData);
      
      return res.status(200).json(profile);
    } catch (error) {
      console.error("Error saving artist profile:", error);
      return res.status(500).json({ 
        message: "Failed to save profile",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // File Upload Routes (placeholder - requires multer middleware)
  app.post("/api/upload/photo", requireAuth, async (req: any, res) => {
    try {
      // This would need multer middleware for actual file handling
      return res.status(501).json({ 
        message: "Photo upload not yet implemented - requires file storage setup" 
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      return res.status(500).json({ 
        message: "Failed to upload photo",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/upload/song", requireAuth, async (req: any, res) => {
    try {
      // This would need multer middleware for actual file handling
      return res.status(501).json({ 
        message: "Song upload not yet implemented - requires file storage setup" 
      });
    } catch (error) {
      console.error("Error uploading song:", error);
      return res.status(500).json({ 
        message: "Failed to upload song",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Playlist Routes
  app.get("/api/playlists", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const playlists = await storage.getUserPlaylists(userId);
      
      return res.status(200).json(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      return res.status(500).json({ 
        message: "Failed to fetch playlists",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/playlists", requireAuth, async (req: any, res) => {
    try {
      const validationResult = playlistRequestSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Validation failed",
          errors: validationResult.error.errors 
        });
      }

      const userId = req.user.id;
      const playlistData = validationResult.data;
      
      const playlist = await storage.createPlaylist(userId, playlistData);
      
      return res.status(201).json(playlist);
    } catch (error) {
      console.error("Error creating playlist:", error);
      return res.status(500).json({ 
        message: "Failed to create playlist",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // API route for complexity analysis
  app.post("/api/complexity/analyze", async (req, res) => {
    try {
      const { lyrics } = req.body;
      
      if (!lyrics || typeof lyrics !== 'string') {
        return res.status(400).json({ 
          message: "Invalid request: lyrics must be provided as a string" 
        });
      }
      
      if (lyrics.trim().length === 0) {
        return res.status(400).json({ 
          message: "Invalid request: lyrics cannot be empty" 
        });
      }
      
      console.log("Analyzing lyric complexity with AI");
      const score = await analyzeLyricComplexity(lyrics);
      
      return res.status(200).json({ score });
    } catch (error) {
      console.error("Error analyzing lyric complexity:", error);
      return res.status(500).json({ 
        message: "Failed to analyze lyric complexity",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // API route for lyric improvement
  app.post("/api/complexity/improve", async (req, res) => {
    try {
      const { lyrics, focusAreas, currentScore, improvementLevel } = req.body;
      
      if (!lyrics || typeof lyrics !== 'string') {
        return res.status(400).json({ 
          message: "Invalid request: lyrics must be provided as a string" 
        });
      }
      
      if (lyrics.trim().length === 0) {
        return res.status(400).json({ 
          message: "Invalid request: lyrics cannot be empty" 
        });
      }
      
      console.log("Improving lyrics with AI enhancement tools");
      const improvedLyrics = await improveLyrics({
        lyrics,
        focusAreas: focusAreas || ['balanced'],
        currentScore,
        improvementLevel: improvementLevel || 'moderate'
      });
      
      return res.status(200).json({ improvedLyrics });
    } catch (error) {
      console.error("Error improving lyrics:", error);
      return res.status(500).json({ 
        message: "Failed to improve lyrics",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get songs from artist profile
  app.get("/api/artist-profile/songs", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const profile = await storage.getArtistProfile(userId);
      
      if (!profile) {
        return res.status(200).json([]);
      }
      
      return res.status(200).json(profile.songs || []);
    } catch (error) {
      console.error("Error fetching songs:", error);
      return res.status(500).json({ 
        message: "Failed to fetch songs",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Admin Routes
  // Get user statistics
  app.get("/api/admin/stats/users", requireAuth, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getUserStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return res.status(500).json({ 
        message: "Failed to fetch user statistics",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get system statistics
  app.get("/api/admin/stats/system", requireAuth, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const stats = await storage.getSystemStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching system stats:", error);
      return res.status(500).json({ 
        message: "Failed to fetch system statistics",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get all users (admin only)
  app.get("/api/admin/users", requireAuth, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ 
        message: "Failed to fetch users",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Create user (admin only)
  app.post("/api/admin/users", requireAuth, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const userData = req.body;
      const newUser = await storage.createAdminUser(userData);
      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ 
        message: "Failed to create user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Update user (admin only)
  app.put("/api/admin/users/:id", requireAuth, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const userId = parseInt(req.params.id);
      const userData = req.body;
      const updatedUser = await storage.updateAdminUser(userId, userData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ 
        message: "Failed to update user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Delete user (admin only)
  app.delete("/api/admin/users/:id", requireAuth, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const userId = parseInt(req.params.id);
      const success = await storage.deleteAdminUser(userId);
      
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ 
        message: "Failed to delete user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get system settings
  app.get("/api/admin/settings", requireAuth, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const settings = await storage.getSystemSettings();
      return res.status(200).json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      return res.status(500).json({ 
        message: "Failed to fetch settings",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Update system settings
  app.put("/api/admin/settings", requireAuth, async (req: any, res) => {
    try {
      if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const settingsData = req.body;
      const updatedSettings = await storage.updateSystemSettings(settingsData);
      return res.status(200).json(updatedSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      return res.status(500).json({ 
        message: "Failed to update settings",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
