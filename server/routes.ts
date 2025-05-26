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
  loginSchema
} from "@shared/schema";
import { setupAuth, requireAuth, optionalAuth, hashPassword } from "./auth";
import passport from "passport";
import { enhanceLyrics } from "./processors/enhancer";
import { enhanceLyricsWithOpenAI } from "./processors/openai-enhancer";
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

  const httpServer = createServer(app);

  return httpServer;
}
