import { log } from "../vite";

/**
 * Generate sound design suggestions based on description and parameters
 */
export async function generateSoundDesignSuggestion(
  description: string,
  genre?: string,
  mood?: string,
  instruments?: string[],
  effects?: string[]
): Promise<string> {
  log(`Generating sound design suggestion - Description: ${description}, Genre: ${genre}, Mood: ${mood}, Instruments: ${instruments?.join(', ')}, Effects: ${effects?.join(', ')}`);
  
  return generateWithBuiltIn(description, genre, mood, instruments, effects);
}

/**
 * Generate sound design suggestions using built-in templates
 */
function generateWithBuiltIn(
  description: string,
  genre?: string,
  mood?: string,
  instruments?: string[],
  effects?: string[]
): string {
  let suggestion = `Sound Design Suggestions for: "${description}"\n\n`;
  
  // Genre-specific suggestions
  if (genre) {
    suggestion += `Genre: ${genre}\n`;
    suggestion += getGenreSpecificSuggestion(genre) + "\n\n";
  }
  
  // Mood-based suggestions
  if (mood) {
    suggestion += `Mood: ${mood}\n`;
    suggestion += getMoodBasedSuggestion(mood) + "\n\n";
  }
  
  // Instrument suggestions
  if (instruments && instruments.length > 0) {
    suggestion += "Instrument Processing:\n";
    instruments.forEach(instrument => {
      suggestion += `- ${instrument}: ${getSoundSourceSuggestion(instrument)}\n`;
    });
    suggestion += "\n";
  }
  
  // Effect suggestions
  if (effects && effects.length > 0) {
    suggestion += "Effect Chain:\n";
    effects.forEach(effect => {
      suggestion += `- ${effect}: ${getEffectSuggestion(effect)}\n`;
    });
    suggestion += "\n";
  }
  
  // General production tips
  suggestion += getGeneralProductionTips(description);
  
  return suggestion;
}

/**
 * Get genre-specific sound design suggestions
 */
function getGenreSpecificSuggestion(genre: string): string {
  const genreSuggestions: Record<string, string> = {
    "trap": "Heavy 808s with pitch slides, hi-hat rolls, and dark atmospheric pads. Use heavy compression and saturation.",
    "drill": "Dark, menacing beats with sliding 808s and eerie melodies. Layer multiple percussion elements for complexity.",
    "boom bap": "Punchy kick and snare with vinyl crackle. Use analog warmth and moderate compression for that classic sound.",
    "lo-fi": "Add vinyl noise, bit crushing, and gentle filtering. Use warm, muffled tones with subtle pitch modulation.",
    "house": "Four-on-the-floor kick pattern with filtered chord stabs. Use sidechain compression and reverb for space.",
    "dubstep": "Heavy bass drops with modulated synths. Use extreme filtering and distortion for aggressive textures.",
    "ambient": "Long reverb tails, gentle filtering, and layered textures. Focus on creating space and atmosphere."
  };
  
  return genreSuggestions[genre.toLowerCase()] || "Experiment with genre-appropriate sounds and production techniques.";
}

/**
 * Get mood-based sound design suggestions
 */
function getMoodBasedSuggestion(mood: string): string {
  const moodSuggestions: Record<string, string> = {
    "dark": "Use minor keys, low-pass filtering, and heavy reverb. Add subtle distortion and compression.",
    "bright": "Emphasize high frequencies, use chorus and delay effects. Add sparkle with subtle harmonic enhancement.",
    "aggressive": "Heavy compression, distortion, and limiting. Use sharp transients and punchy dynamics.",
    "calm": "Gentle dynamics, soft filtering, and subtle modulation. Use warm tones and spacious reverb.",
    "energetic": "Fast attack times, bright EQ, and dynamic range. Use exciting harmonic content.",
    "melancholic": "Soft compression, gentle filtering, and atmospheric reverb. Focus on emotional resonance."
  };
  
  return moodSuggestions[mood.toLowerCase()] || "Adjust the sonic character to match the intended emotional impact.";
}

/**
 * Get suggestion for specific sound source/instrument
 */
function getSoundSourceSuggestion(instrument: string): string {
  const suggestions: Record<string, string> = {
    "kick": "Use EQ to boost around 60-80Hz for punch, compress with fast attack for tightness",
    "snare": "Boost around 200Hz for body and 5kHz for crack, add subtle reverb for space",
    "hi-hat": "High-pass filter to remove low frequencies, use compression for consistency",
    "bass": "High-pass at 30Hz, compress heavily, use saturation for harmonics",
    "lead": "Use delay and reverb for space, EQ to cut through the mix",
    "pad": "Wide stereo image, gentle filtering, long reverb tails",
    "vocals": "De-ess, compress, EQ for clarity, add reverb and delay tastefully",
    "guitar": "Use amp simulation, compression, and effects for desired tone",
    "piano": "Natural reverb, gentle compression, EQ for frequency balance",
    "strings": "Spacious reverb, gentle compression, subtle stereo widening"
  };
  
  return suggestions[instrument.toLowerCase()] || "Process according to its role in the mix and desired character";
}

/**
 * Get suggestion for specific effect
 */
function getEffectSuggestion(effect: string): string {
  const suggestions: Record<string, string> = {
    "reverb": "Adjust decay time based on tempo, use pre-delay for clarity",
    "delay": "Sync to tempo, use feedback for character, filter for texture",
    "chorus": "Subtle depth and width, don't overdo the modulation",
    "distortion": "Use sparingly for character, filter to control harshness",
    "compressor": "Set attack/release for desired pump, use makeup gain appropriately",
    "eq": "Cut problem frequencies, boost musical ones, use high/low pass filters",
    "filter": "Automate cutoff for movement, use resonance for character",
    "saturation": "Add harmonic richness, use parallel processing for blend",
    "limiter": "Control peaks while maintaining dynamics, watch for pumping",
    "phaser": "Slow modulation for subtle movement, sync to tempo if desired"
  };
  
  return suggestions[effect.toLowerCase()] || "Use creatively to enhance the sonic character";
}

/**
 * Get general production tips based on description
 */
function getGeneralProductionTips(description: string): string {
  const keywords = description.toLowerCase();
  let tips = "Production Tips:\n";
  
  if (keywords.includes("heavy") || keywords.includes("hard")) {
    tips += "- Use heavy compression and limiting for impact\n";
    tips += "- Layer multiple elements for thickness\n";
  }
  
  if (keywords.includes("soft") || keywords.includes("gentle")) {
    tips += "- Use gentle processing to maintain naturalness\n";
    tips += "- Focus on subtle enhancements rather than dramatic changes\n";
  }
  
  if (keywords.includes("wide") || keywords.includes("spacious")) {
    tips += "- Use stereo widening techniques carefully\n";
    tips += "- Add reverb and delay for spatial depth\n";
  }
  
  if (keywords.includes("punchy") || keywords.includes("tight")) {
    tips += "- Use fast attack compression\n";
    tips += "- Focus on transient shaping\n";
  }
  
  tips += "- Always reference your mix on multiple systems\n";
  tips += "- Use your ears and trust your instincts\n";
  
  return tips;
}