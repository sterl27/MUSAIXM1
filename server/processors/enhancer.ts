import { EnhancementOptions, getMusicStyleById } from "@/lib/types";

// Effects available for FX cues
const fxCues = ["ECHO", "REVERB", "DELAY", "DISTORT", "FILTER", "CHORUS"];

// Default Suno production tags
const defaultSunoTags = [
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
  // Persona-based BPM ranges
  "outkast": [85, 95],
  "goodiemob": [75, 90],
  "liljon": [95, 110],
  "ti": [65, 85],
  
  // Music style-based BPM ranges
  "trap": [130, 150],
  "rnb": [60, 80],
  "boom-bap": [85, 95],
  "drill": [140, 150],
  "pop-rap": [90, 110],
  "lofi": [70, 85]
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
    // Determine which BPM range to use based on music style or persona
    let bpmRangeKey = personaId;
    let tags = [...defaultSunoTags];
    
    // If a music style is selected, use its BPM range and description
    if (options.musicStyle) {
      const musicStyle = getMusicStyleById(options.musicStyle);
      if (musicStyle) {
        bpmRangeKey = options.musicStyle;
        // Use the music style's Suno description
        enhancedLines.push(`[SUNO: ${musicStyle.sunoDescription}]`);
        enhancedLines.push("");
      }
    } else {
      const bpmRange = bpmRanges[bpmRangeKey as keyof typeof bpmRanges] || [85, 95];
      const bpm = Math.floor(Math.random() * (bpmRange[1] - bpmRange[0] + 1)) + bpmRange[0];
      const randomTag = tags[Math.floor(Math.random() * tags.length)];
      enhancedLines.push(`[SUNO: ${randomTag}, ${bpm} BPM]`);
      enhancedLines.push("");
    }
  }
  
  // Apply persona-specific transformations to each line
  lines.forEach((line, index) => {
    if (!line.trim()) {
      enhancedLines.push("");
      return;
    }
    
    let enhancedLine = enhanceLineByPersona(line, personaId, options.flowStrength);
    
    // Apply music style-specific enhancements if selected
    if (options.musicStyle) {
      enhancedLine = enhanceLineByMusicStyle(enhancedLine, options.musicStyle, options.flowStrength);
    }
    
    // Add FX cue to approximately 1/4 of lines if enabled
    if (options.includeFxCues && Math.random() < 0.25) {
      const randomFx = fxCues[Math.floor(Math.random() * fxCues.length)];
      enhancedLine += ` [${randomFx}]`;
    }
    
    enhancedLines.push(enhancedLine);
    
    // Add occasional Suno production direction
    if (options.includeSunoTags && (index === lines.length - 1 || Math.random() < 0.2)) {
      if (Math.random() < 0.5) {
        // Add a Suno direction based on music style or default
        if (options.musicStyle) {
          const musicStyle = getMusicStyleById(options.musicStyle);
          if (musicStyle) {
            // Extract a random segment from the Suno description
            const segments = musicStyle.sunoDescription.split('.');
            const randomSegment = segments[Math.floor(Math.random() * segments.length)].trim();
            if (randomSegment) {
              enhancedLines.push("");
              enhancedLines.push(`[SUNO: ${randomSegment}]`);
            }
          } else {
            // Fallback to default tags
            enhancedLines.push("");
            enhancedLines.push(`[SUNO: add ${defaultSunoTags[Math.floor(Math.random() * defaultSunoTags.length)]} here]`);
          }
        } else {
          // Use default tags
          enhancedLines.push("");
          enhancedLines.push(`[SUNO: add ${defaultSunoTags[Math.floor(Math.random() * defaultSunoTags.length)]} here]`);
        }
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
 * Apply music style-specific enhancements to a line of lyrics
 */
function enhanceLineByMusicStyle(line: string, musicStyleId: string, flowStrength: number): string {
  // Skip enhancement if the strength is minimal
  if (flowStrength <= 1) return line;
  
  let enhancedLine = line;
  
  // Replace common words with music style-specific vocabulary
  switch (musicStyleId) {
    case "trap":
      // Trap music style transformations
      enhancedLine = enhancedLine
        .replace(/money/gi, "bands")
        .replace(/drugs/gi, "work")
        .replace(/friends/gi, "squad")
        .replace(/house/gi, "trap")
        .replace(/car/gi, "whip")
        .replace(/jewelry/gi, "ice");
      break;
    
    case "rnb":
      // R&B transformations
      enhancedLine = enhancedLine
        .replace(/love/gi, "lovin'")
        .replace(/girl/gi, "shorty")
        .replace(/relationship/gi, "vibe")
        .replace(/dance/gi, "groove")
        .replace(/feeling/gi, "feelin'");
      break;
      
    case "boom-bap":
      // Boom bap transformations
      enhancedLine = enhancedLine
        .replace(/city/gi, "concrete jungle")
        .replace(/speak/gi, "spit")
        .replace(/good/gi, "dope")
        .replace(/music/gi, "beats")
        .replace(/rhymes/gi, "bars");
      break;
      
    case "drill":
      // Drill transformations
      enhancedLine = enhancedLine
        .replace(/enemies/gi, "opps")
        .replace(/area/gi, "block")
        .replace(/gun/gi, "pole")
        .replace(/friends/gi, "gang")
        .replace(/talk/gi, "cap");
      break;
      
    case "pop-rap":
      // Pop rap transformations
      enhancedLine = enhancedLine
        .replace(/party/gi, "function")
        .replace(/happy/gi, "lit")
        .replace(/good/gi, "fire")
        .replace(/excited/gi, "hyped")
        .replace(/amazing/gi, "legendary");
      break;
      
    case "lofi":
      // Lo-Fi transformations
      enhancedLine = enhancedLine
        .replace(/relax/gi, "vibe")
        .replace(/think/gi, "reflect")
        .replace(/remember/gi, "reminisce")
        .replace(/calm/gi, "chill")
        .replace(/night/gi, "late night");
      break;
  }
  
  // Apply more thematic elements for higher flow strength
  if (flowStrength >= 4) {
    enhancedLine = addMusicStyleElements(enhancedLine, musicStyleId);
  }
  
  return enhancedLine;
}

/**
 * Add additional stylistic elements based on music style
 */
function addMusicStyleElements(line: string, musicStyleId: string): string {
  let result = line;
  
  switch (musicStyleId) {
    case "trap":
      // Additional trap elements
      if (Math.random() < 0.3 && result.length < 40) {
        const adlibs = [", skrrt", ", yeah", ", aye", ", gang"];
        result += adlibs[Math.floor(Math.random() * adlibs.length)];
      }
      break;
      
    case "rnb":
      // Additional R&B elements
      if (Math.random() < 0.3 && result.length < 40) {
        result = result.replace(/[.!?]$/, "... baby");
      }
      break;
      
    case "boom-bap":
      // Additional boom bap elements
      if (Math.random() < 0.3) {
        result = result.replace(/\b(my|the|your)\b/gi, "that");
      }
      break;
      
    case "drill":
      // Additional drill elements
      if (Math.random() < 0.3) {
        const endings = [", no cap", ", on foe nem", ", on gang"];
        result += endings[Math.floor(Math.random() * endings.length)];
      }
      break;
      
    case "pop-rap":
      // Additional pop-rap elements
      if (Math.random() < 0.3) {
        result = result.replace(/[.!?]$/, "!");
      }
      break;
      
    case "lofi":
      // Additional lo-fi elements
      if (Math.random() < 0.3 && result.length < 40) {
        result += "... *lo-fi beat plays*";
      }
      break;
  }
  
  return result;
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
