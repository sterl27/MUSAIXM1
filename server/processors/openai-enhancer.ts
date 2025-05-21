import { getPersonaById } from "@/lib/types";
import { enhanceLyrics } from "./enhancer";
import { log } from "../vite";

/**
 * Enhance lyrics using OpenAI or fallback to built-in enhancer
 */
export async function enhanceLyricsWithOpenAI(
  lyrics: string,
  prompt: string,
  temperature: number,
  personaId: string | null,
  useAI: boolean
): Promise<string> {
  // If OpenAI is disabled or we don't have API key, use built-in enhancer
  if (!useAI || !process.env.OPENAI_API_KEY) {
    console.log("Using built-in enhancer as fallback");
    
    // Use the existing enhancer with some default options
    const enhancementOptions = {
      includeSunoTags: true,
      includeFxCues: true,
      flowStrength: Math.round(temperature * 5), // Convert temperature to flow strength
      musicStyle: null
    };
    
    return await enhanceLyrics(
      lyrics,
      personaId || "outkast", // Default to OutKast if no persona selected
      enhancementOptions
    );
  }
  
  try {
    // Construct the prompt with persona context if provided
    let contextualPrompt = prompt;
    
    if (personaId) {
      const persona = getPersonaById(personaId);
      if (persona) {
        contextualPrompt = `Act as if you're ${persona.name}. ${persona.description}. ${prompt}`;
      }
    }
    
    const fullPrompt = `
      ${contextualPrompt}
      
      Original lyrics:
      ${lyrics}
      
      Enhanced lyrics:
    `.trim();
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a creative lyric writer and enhancer that helps transform lyrics into different styles."
          },
          {
            role: "user",
            content: fullPrompt
          }
        ],
        temperature: temperature,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      throw new Error(`OpenAI API error: ${error.error?.message || "Unknown error"}`);
    }
    
    const data = await response.json();
    const enhancedLyrics = data.choices[0]?.message?.content?.trim();
    
    if (!enhancedLyrics) {
      throw new Error("No response generated from OpenAI");
    }
    
    return enhancedLyrics;
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    
    // Fall back to built-in enhancer if OpenAI fails
    console.log("Falling back to built-in enhancer due to OpenAI error");
    const enhancementOptions = {
      includeSunoTags: true,
      includeFxCues: true,
      flowStrength: Math.round(temperature * 5),
      musicStyle: null
    };
    
    return await enhanceLyrics(
      lyrics,
      personaId || "outkast",
      enhancementOptions
    );
  }
}