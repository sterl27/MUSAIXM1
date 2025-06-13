import OpenAI from "openai";
import type { GenreRecommendationRequest, GenreRecommendationResponse } from "@shared/schema";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface GenreAnalysis {
  primaryGenre: string;
  secondaryGenres: string[];
  confidence: number;
  reasoning: string;
  suggestions: string[];
  relatedArtists: string[];
}

/**
 * AI-powered music genre recommendation engine
 */
export async function recommendGenres(request: GenreRecommendationRequest): Promise<GenreRecommendationResponse> {
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackRecommendation(request);
  }

  try {
    const analysis = await analyzeWithOpenAI(request);
    return analysis;
  } catch (error) {
    console.error("Error with OpenAI genre analysis:", error);
    return generateFallbackRecommendation(request);
  }
}

/**
 * Analyze music characteristics using OpenAI GPT-4o
 */
async function analyzeWithOpenAI(request: GenreRecommendationRequest): Promise<GenreRecommendationResponse> {
  const prompt = constructAnalysisPrompt(request);
  
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert music industry analyst and genre classification specialist with deep knowledge of music theory, cultural contexts, and contemporary music trends. You analyze musical content and provide accurate genre recommendations with detailed reasoning.

Your analysis should consider:
- Lyrical themes, language patterns, and storytelling approaches
- Musical characteristics (tempo, rhythm, instrumentation preferences)
- Cultural and geographic influences
- Target audience demographics
- Current industry trends and subgenre evolution

Respond with a JSON object containing:
{
  "primaryGenre": "most fitting main genre",
  "secondaryGenres": ["2-4 additional fitting genres"],
  "confidence": number between 0-100,
  "reasoning": "detailed explanation of genre assignment",
  "suggestions": ["3-5 specific recommendations for the artist"],
  "relatedArtists": ["3-5 artists with similar style/genre"]
}`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 1000
  });

  const result = response.choices[0].message.content;
  if (!result) {
    throw new Error("No analysis generated");
  }

  const analysis: GenreAnalysis = JSON.parse(result);
  
  return {
    primaryGenre: analysis.primaryGenre,
    secondaryGenres: analysis.secondaryGenres,
    confidence: Math.max(0, Math.min(100, analysis.confidence)),
    reasoning: analysis.reasoning,
    suggestions: analysis.suggestions,
    relatedArtists: analysis.relatedArtists
  };
}

/**
 * Construct detailed analysis prompt from user input
 */
function constructAnalysisPrompt(request: GenreRecommendationRequest): string {
  let prompt = "Analyze the following musical content and recommend the most appropriate genres:\n\n";

  if (request.lyrics) {
    prompt += `LYRICS:\n${request.lyrics}\n\n`;
  }

  if (request.musicDescription) {
    prompt += `MUSIC DESCRIPTION:\n${request.musicDescription}\n\n`;
  }

  if (request.currentGenre) {
    prompt += `CURRENT GENRE CLASSIFICATION:\n${request.currentGenre}\n\n`;
  }

  if (request.mood) {
    prompt += `INTENDED MOOD:\n${request.mood}\n\n`;
  }

  if (request.influences && request.influences.length > 0) {
    prompt += `MUSICAL INFLUENCES:\n${request.influences.join(", ")}\n\n`;
  }

  if (request.targetAudience) {
    prompt += `TARGET AUDIENCE:\n${request.targetAudience}\n\n`;
  }

  prompt += `Please provide a comprehensive genre analysis with primary and secondary genre recommendations, confidence level, detailed reasoning, and actionable suggestions for the artist.`;

  return prompt;
}

/**
 * Fallback genre recommendation using rule-based analysis
 */
function generateFallbackRecommendation(request: GenreRecommendationRequest): GenreRecommendationResponse {
  const genres = analyzeGenreCharacteristics(request);
  
  return {
    primaryGenre: genres.primary,
    secondaryGenres: genres.secondary,
    confidence: 75,
    reasoning: "Analysis based on lyrical content, mood indicators, and stated influences. For more detailed analysis, ensure OpenAI API access is configured.",
    suggestions: [
      "Experiment with genre-blending techniques",
      "Study artists from your recommended genres",
      "Consider your target audience's preferences",
      "Develop a unique sound within your genre"
    ],
    relatedArtists: getRelatedArtists(genres.primary)
  };
}

/**
 * Rule-based genre analysis for fallback
 */
function analyzeGenreCharacteristics(request: GenreRecommendationRequest): { primary: string; secondary: string[] } {
  // Analyze lyrics for genre indicators
  const lyricsGenres = request.lyrics ? analyzeLyricsForGenre(request.lyrics) : [];
  
  // Consider stated influences
  const influenceGenres = request.influences || [];
  
  // Mood-based genre mapping
  const moodGenres = request.mood ? getMoodGenres(request.mood) : [];
  
  // Combine all indicators
  const allGenres = [...lyricsGenres, ...influenceGenres, ...moodGenres];
  const genreCounts = countGenreOccurrences(allGenres);
  
  // Get primary and secondary genres
  const sortedGenres = Object.entries(genreCounts)
    .sort(([,a], [,b]) => b - a)
    .map(([genre]) => genre);
    
  return {
    primary: sortedGenres[0] || request.currentGenre || "Pop",
    secondary: sortedGenres.slice(1, 4)
  };
}

/**
 * Analyze lyrics content for genre indicators
 */
function analyzeLyricsForGenre(lyrics: string): string[] {
  const lowerLyrics = lyrics.toLowerCase();
  const genres: string[] = [];
  
  // Hip-Hop/Rap indicators
  if (lyricsHasPatterns(lowerLyrics, ["flow", "beat", "rhyme", "bars", "mic", "hustle", "street"])) {
    genres.push("Hip-Hop", "Rap");
  }
  
  // R&B indicators
  if (lyricsHasPatterns(lowerLyrics, ["love", "heart", "soul", "baby", "tonight", "feelings"])) {
    genres.push("R&B", "Soul");
  }
  
  // Rock indicators
  if (lyricsHasPatterns(lowerLyrics, ["rock", "rebel", "fight", "break", "wild", "loud"])) {
    genres.push("Rock", "Alternative");
  }
  
  // Pop indicators
  if (lyricsHasPatterns(lowerLyrics, ["dance", "party", "fun", "bright", "shine", "star"])) {
    genres.push("Pop", "Dance-Pop");
  }
  
  // Electronic indicators
  if (lyricsHasPatterns(lowerLyrics, ["electric", "digital", "neon", "techno", "synth", "pulse"])) {
    genres.push("Electronic", "EDM");
  }
  
  return genres;
}

/**
 * Check if lyrics contain genre-specific patterns
 */
function lyricsHasPatterns(lyrics: string, patterns: string[]): boolean {
  return patterns.some(pattern => lyrics.includes(pattern));
}

/**
 * Map moods to likely genres
 */
function getMoodGenres(mood: string): string[] {
  const moodMap: Record<string, string[]> = {
    "aggressive": ["Metal", "Hardcore", "Trap", "Drill"],
    "energetic": ["EDM", "Pop", "Rock", "Dance"],
    "melancholy": ["Indie", "Alternative", "R&B", "Soul"],
    "romantic": ["R&B", "Pop", "Soul", "Soft Rock"],
    "dark": ["Gothic", "Industrial", "Dark Trap", "Alternative"],
    "happy": ["Pop", "Reggae", "Dance", "Folk"],
    "calm": ["Ambient", "Chill", "Acoustic", "New Age"],
    "epic": ["Orchestral", "Cinematic", "Progressive Rock", "Symphonic Metal"]
  };
  
  return moodMap[mood.toLowerCase()] || [];
}

/**
 * Count genre occurrences for weighted analysis
 */
function countGenreOccurrences(genres: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  genres.forEach(genre => {
    counts[genre] = (counts[genre] || 0) + 1;
  });
  return counts;
}

/**
 * Get related artists for a given genre
 */
function getRelatedArtists(genre: string): string[] {
  const artistMap: Record<string, string[]> = {
    "Hip-Hop": ["Kendrick Lamar", "Drake", "J. Cole", "Travis Scott", "Tyler, The Creator"],
    "Rap": ["Eminem", "Jay-Z", "Nas", "Kanye West", "Lil Wayne"],
    "R&B": ["The Weeknd", "Frank Ocean", "SZA", "Daniel Caesar", "H.E.R."],
    "Pop": ["Taylor Swift", "Ariana Grande", "Dua Lipa", "Harry Styles", "Billie Eilish"],
    "Rock": ["Arctic Monkeys", "The Strokes", "Imagine Dragons", "Twenty One Pilots", "Red Hot Chili Peppers"],
    "Electronic": ["Calvin Harris", "Deadmau5", "Skrillex", "Porter Robinson", "Flume"],
    "Alternative": ["Radiohead", "Tame Impala", "The 1975", "Vampire Weekend", "MGMT"],
    "Indie": ["Bon Iver", "Phoebe Bridgers", "Mac DeMarco", "Beach House", "Clairo"]
  };
  
  return artistMap[genre] || ["Various Artists"];
}