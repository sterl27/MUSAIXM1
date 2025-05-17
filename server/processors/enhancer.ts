import { EnhancementOptions } from "@/lib/types";

// Effects available for FX cues
const fxCues = ["ECHO", "REVERB", "DELAY", "DISTORT", "FILTER", "CHORUS"];

// Suno production tags
const sunoTags = [
  "dirty south beat", 
  "trap drums", 
  "808 bass", 
  "melodic sample", 
  "piano loop", 
  "slow tempo", 
  "organic percussion"
];

// BPM ranges for different styles
const bpmRanges = {
  "outkast": [85, 95],
  "goodiemob": [75, 90],
  "liljon": [95, 110],
  "ti": [65, 85]
};

/**
 * Enhance lyrics based on selected persona and options
 */
export async function enhanceLyrics(
  lyrics: string, 
  personaId: string, 
  options: EnhancementOptions
): Promise<string> {
  // This would typically call an AI service API
  // For now, we'll implement a rule-based enhancer

  // Split the lyrics into lines
  const lines = lyrics.split("\n").filter(line => line.trim());
  
  // Enhanced lines to return
  const enhancedLines: string[] = [];
  
  // Add a Suno tag at the beginning if enabled
  if (options.includeSunoTags) {
    const bpmRange = bpmRanges[personaId as keyof typeof bpmRanges] || [85, 95];
    const bpm = Math.floor(Math.random() * (bpmRange[1] - bpmRange[0] + 1)) + bpmRange[0];
    const randomTag = sunoTags[Math.floor(Math.random() * sunoTags.length)];
    enhancedLines.push(`[SUNO: ${randomTag}, ${bpm} BPM]`);
    enhancedLines.push("");
  }
  
  // Apply persona-specific transformations to each line
  lines.forEach((line, index) => {
    if (!line.trim()) {
      enhancedLines.push("");
      return;
    }
    
    let enhancedLine = enhanceLineByPersona(line, personaId, options.flowStrength);
    
    // Add FX cue to approximately 1/4 of lines if enabled
    if (options.includeFxCues && Math.random() < 0.25) {
      const randomFx = fxCues[Math.floor(Math.random() * fxCues.length)];
      enhancedLine += ` [${randomFx}]`;
    }
    
    enhancedLines.push(enhancedLine);
    
    // Add occasional Suno production direction
    if (options.includeSunoTags && (index === lines.length - 1 || Math.random() < 0.2)) {
      if (Math.random() < 0.5) {
        enhancedLines.push("");
        enhancedLines.push(`[SUNO: add ${sunoTags[Math.floor(Math.random() * sunoTags.length)]} here]`);
      }
    }
  });
  
  return enhancedLines.join("\n");
}

/**
 * Apply persona-specific enhancements to a line of lyrics
 */
function enhanceLineByPersona(line: string, personaId: string, flowStrength: number): string {
  // Skip enhancement if the strength is minimal
  if (flowStrength <= 1) return line;
  
  let enhancedLine = line;
  
  // Replace common words with persona-specific vocabulary
  switch (personaId) {
    case "outkast":
      // OutKast transformations (Southern ATL style)
      enhancedLine = enhancedLine
        .replace(/city/gi, "A-T-L")
        .replace(/people/gi, "squad")
        .replace(/looking/gi, "peeping")
        .replace(/feeling/gi, "feelin'")
        .replace(/going to/gi, "finna")
        .replace(/about to/gi, "bout to")
        .replace(/understand/gi, "comprehend")
        .replace(/skyline/gi, "skyline gleamin'");
      break;
    
    case "goodiemob":
      // Goodie Mob transformations (soulful, conscious)
      enhancedLine = enhancedLine
        .replace(/city/gi, "dirty South")
        .replace(/looking/gi, "witnessing")
        .replace(/feeling/gi, "soul feeling")
        .replace(/understand/gi, "overstand")
        .replace(/face/gi, "endure")
        .replace(/stories/gi, "testaments")
        .replace(/streets/gi, "concrete jungle");
      break;
      
    case "liljon":
      // Lil Jon transformations (crunk, energetic)
      enhancedLine = enhancedLine.toUpperCase();
      if (Math.random() < 0.3) {
        enhancedLine += "! YEAAAH!";
      }
      enhancedLine = enhancedLine
        .replace(/LOOKING/g, "LOOKIN'")
        .replace(/FEELING/g, "FEELIN'")
        .replace(/WITH/g, "WIT'")
        .replace(/GOING TO/g, "FINNA")
        .replace(/ABOUT TO/g, "BOUTA");
      break;
      
    case "ti":
      // T.I. transformations (trap, precise flow)
      enhancedLine = enhancedLine
        .replace(/city/gi, "trap")
        .replace(/people/gi, "hustlers")
        .replace(/looking/gi, "surveying")
        .replace(/feeling/gi, "experiencing")
        .replace(/understand/gi, "comprehend")
        .replace(/face/gi, "confront")
        .replace(/stories/gi, "chronicles")
        .replace(/streets/gi, "concrete terrain");
      break;
  }
  
  // Apply more aggressive transformations based on flow strength
  if (flowStrength >= 4) {
    // Add more slang and stylistic elements for higher flow strength
    enhancedLine = addAdditionalStyleElements(enhancedLine, personaId);
  }
  
  return enhancedLine;
}

/**
 * Add additional stylistic elements based on persona
 */
function addAdditionalStyleElements(line: string, personaId: string): string {
  let result = line;
  
  switch (personaId) {
    case "outkast":
      // Additional OutKast stylistic elements
      if (Math.random() < 0.3) {
        result = result.replace(/\b(we|i|they)\b/gi, (match) => {
          return match + " be";
        });
      }
      break;
      
    case "goodiemob":
      // Add metaphors and deeper meanings
      if (Math.random() < 0.3 && result.length < 40) {
        result += " - food for the soul";
      }
      break;
      
    case "liljon":
      // Add Lil Jon ad-libs
      if (Math.random() < 0.3) {
        const adlibs = ["OKAY!", "WHAT!", "LET'S GO!", "TURN UP!"];
        result += " " + adlibs[Math.floor(Math.random() * adlibs.length)];
      }
      break;
      
    case "ti":
      // Add T.I. style precise wordplay
      if (Math.random() < 0.3) {
        result = result.replace(/\b(the)\b/gi, "thy");
      }
      break;
  }
  
  return result;
}
