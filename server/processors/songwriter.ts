import { log } from "../vite";

// Simple list of personas for reference
const personas = [
  {
    id: "outkast",
    name: "OutKast",
    description: "Southern flow",
    icon: "crown"
  },
  {
    id: "goodiemob",
    name: "Goodie Mob",
    description: "Soulful conscious",
    icon: "brain"
  },
  {
    id: "liljon",
    name: "Lil Jon",
    description: "Crunk energy",
    icon: "zap"
  },
  {
    id: "ti",
    name: "T.I.",
    description: "Trap precision",
    icon: "target"
  }
];

// Helper function to get persona by ID
function getPersonaById(id: string) {
  return personas.find(persona => persona.id === id);
}

/**
 * Generate lyrics based on provided parameters
 */
export async function generateSongLyrics(
  topic: string,
  mood: string,
  genre: string,
  structure: string,
  linesPerVerse: number,
  personaId: string | null
): Promise<string> {
  try {
    log("Using built-in song lyrics generator");
    return generateWithBuiltIn(topic, mood, genre, structure, linesPerVerse, personaId);
  } catch (error) {
    log(`Error generating song lyrics: ${error}`);
    throw error;
  }
}



/**
 * Generate lyrics using built-in templates and algorithms
 */
function generateWithBuiltIn(
  topic: string,
  mood: string,
  genre: string,
  structure: string,
  linesPerVerse: number,
  personaId: string | null
): string {
  // Parse structure to determine the required sections
  const sections = structure.split('-');
  
  // Generate lyrics for each section
  const lyricsOutput: string[] = [];
  
  // Keep track of verses and choruses
  let verseCount = 0;
  let chorusCount = 0;
  
  // Generate each section
  sections.forEach(section => {
    const sectionType = section.trim().toLowerCase();
    
    if (sectionType === 'verse') {
      verseCount++;
      lyricsOutput.push(`VERSE ${verseCount}:`);
      lyricsOutput.push(...generateVerse(topic, mood, genre, linesPerVerse, personaId));
      lyricsOutput.push(""); // Add empty line
    } else if (sectionType === 'chorus') {
      if (chorusCount === 0) {
        chorusCount++;
        lyricsOutput.push("CHORUS:");
        lyricsOutput.push(...generateChorus(topic, mood, genre, personaId));
      } else {
        lyricsOutput.push("CHORUS: (Repeat)");
      }
      lyricsOutput.push(""); // Add empty line
    } else if (sectionType === 'bridge') {
      lyricsOutput.push("BRIDGE:");
      lyricsOutput.push(...generateBridge(topic, mood, genre, personaId));
      lyricsOutput.push(""); // Add empty line
    } else if (sectionType === 'intro') {
      lyricsOutput.push("INTRO:");
      lyricsOutput.push(...generateIntro(genre));
      lyricsOutput.push(""); // Add empty line
    } else if (sectionType === 'outro') {
      lyricsOutput.push("OUTRO:");
      lyricsOutput.push(...generateOutro(mood));
      lyricsOutput.push(""); // Add empty line
    } else if (sectionType === 'pre-chorus') {
      lyricsOutput.push("PRE-CHORUS:");
      lyricsOutput.push(...generatePreChorus(mood, genre));
      lyricsOutput.push(""); // Add empty line
    }
  });
  
  return lyricsOutput.join("\n");
}

/**
 * Generate a verse based on topic, mood, and genre
 */
function generateVerse(
  topic: string,
  mood: string,
  genre: string,
  lineCount: number,
  personaId: string | null
): string[] {
  // Template lines for different topics
  const topicTemplates: { [key: string]: string[] } = {
    'love': [
      "I've been thinking about you all day",
      "The way you look in the morning light",
      "Every time I close my eyes, I see your face",
      "We've been through so much together",
      "When you hold me close, time stands still",
      "Remember when we first met, it was electric",
      "Your love is like a fire that never dies",
      "I can't imagine a world without you in it",
      "The distance between us feels like forever",
      "Through all the ups and downs, we've stayed strong"
    ],
    'struggle': [
      "Fighting against the odds every day",
      "Nobody said it would be easy, but here we are",
      "When the world turns its back on you",
      "Climbing mountains just to fall back down",
      "The streets don't love nobody, that's the truth",
      "Been grinding since day one, no handouts",
      "Sometimes I wonder if it's all worth it",
      "They try to hold me down, but I keep rising",
      "Every obstacle is just another step to the top",
      "When everything is against you, you find your strength"
    ],
    'party': [
      "Tonight we're taking over the city",
      "Hands in the air, no time for worries",
      "The beat drops and the crowd goes wild",
      "From dusk till dawn, we're not stopping",
      "The energy in this room is electric",
      "Bottles popping, music blasting",
      "Dance floor packed, everybody moving",
      "This is our night, make it legendary",
      "The DJ's spinning all our favorite tracks",
      "Life's too short, let's celebrate right now"
    ],
    'reflection': [
      "Looking back on all the choices I've made",
      "Time passes but the memories remain",
      "The road I've traveled has shaped who I am",
      "Some lessons can only be learned the hard way",
      "In the silence, I find my truest thoughts",
      "When I close my eyes, I see my journey clearly",
      "The person I was and who I've become",
      "Some friendships fade, but their impact remains",
      "The city changes, but its soul stays the same",
      "Through it all, I've found myself along the way"
    ]
  };
  
  // Default to reflection if no topic or unknown topic
  const relevantTemplates = topicTemplates[topic.toLowerCase()] || topicTemplates['reflection'];
  
  // Generate the verse
  const verse: string[] = [];
  
  // Calculate how many lines we need to generate
  const neededLines = Math.min(lineCount, 24); // Cap at 24 lines
  
  // Generate lines for the verse
  for (let i = 0; i < neededLines; i++) {
    // Cycle through templates if we need more lines than we have templates
    const line = relevantTemplates[i % relevantTemplates.length];
    
    // Modify based on persona if specified
    let modifiedLine = line;
    if (personaId) {
      modifiedLine = applyPersonaStyle(line, personaId);
    }
    
    verse.push(modifiedLine);
  }
  
  return verse;
}

/**
 * Generate a chorus
 */
function generateChorus(topic: string, mood: string, genre: string, personaId: string | null): string[] {
  // Chorus templates based on mood
  const moodTemplates: { [key: string]: string[] } = {
    'happy': [
      "And I'm feeling so alive, nothing can bring me down",
      "This is our moment, let's make it count",
      "Life is beautiful, and we're living it right",
      "Together we can touch the sky, oh yeah"
    ],
    'sad': [
      "And the rain keeps falling, just like my tears",
      "I'm trying to hold on, but everything's slipping away",
      "Some wounds never heal, they just fade with time",
      "I'm standing alone in a crowd full of strangers"
    ],
    'energetic': [
      "Let's go, let's go, can't nobody stop us now!",
      "Turn it up, break it down, this is how we do!",
      "Move your body to the rhythm, feel the energy!",
      "We're unstoppable, unbreakable, unforgettable!"
    ],
    'reflective': [
      "Time tells its story in the lines on our faces",
      "We're all just travelers on this journey called life",
      "The more I learn, the less I know for sure",
      "In the silence between heartbeats, truth reveals itself"
    ]
  };
  
  // Default to happy if mood not found
  const relevantTemplates = moodTemplates[mood.toLowerCase()] || moodTemplates['happy'];
  
  // Apply persona style if specified
  const chorus = relevantTemplates.map(line => 
    personaId ? applyPersonaStyle(line, personaId) : line
  );
  
  return chorus;
}

/**
 * Generate a bridge section
 */
function generateBridge(topic: string, mood: string, genre: string, personaId: string | null): string[] {
  // Bridge templates
  const bridgeTemplates = [
    "Now everything has changed, nothing feels the same",
    "Looking back at where we started, how far we've come",
    "Break it down, let me tell you something",
    "When all is said and done, what remains is truth",
    "In this moment between past and future",
    "Take a breath, feel the shift in the air"
  ];
  
  // Select 3-4 lines for bridge
  const bridgeLength = Math.floor(Math.random() * 2) + 3; // 3 or 4 lines
  const bridge: string[] = [];
  
  for (let i = 0; i < bridgeLength; i++) {
    let line = bridgeTemplates[i % bridgeTemplates.length];
    if (personaId) {
      line = applyPersonaStyle(line, personaId);
    }
    bridge.push(line);
  }
  
  return bridge;
}

/**
 * Generate intro section
 */
function generateIntro(genre: string): string[] {
  return ["(Music intro)", "Yeah...", "Listen..."];
}

/**
 * Generate outro section
 */
function generateOutro(mood: string): string[] {
  return ["(Fade out)", "That's right...", "Remember that..."];
}

/**
 * Generate pre-chorus section
 */
function generatePreChorus(mood: string, genre: string): string[] {
  const templates = [
    "And now I'm ready for the moment of truth",
    "Building up to something bigger than us",
    "Feel the tension rising, can't hold back now",
    "Everything is about to change"
  ];
  
  // Return 2-3 lines
  return templates.slice(0, Math.floor(Math.random() * 2) + 2);
}

/**
 * Apply persona-specific style to a line
 */
function applyPersonaStyle(line: string, personaId: string): string {
  switch (personaId) {
    case 'outkast':
      // OutKast style: Southern ATL lingo, wordplay
      return line
        .replace(/my/g, "my")
        .replace(/you/g, "y'all")
        .replace(/going to/g, "finna")
        .replace(/friend/g, "playa");
      
    case 'goodiemob':
      // Goodie Mob style: Conscious, soulful
      return line
        .replace(/understand/g, "overstand")
        .replace(/think/g, "meditate on")
        .replace(/see/g, "witness")
        .replace(/world/g, "Babylon system");
      
    case 'liljon':
      // Lil Jon style: CRUNK, energetic, shouty
      return line.toUpperCase() + (Math.random() > 0.7 ? "! YEAAAH!" : "!");
      
    case 'ti':
      // T.I. style: Southern trap vocabulary, polished
      return line
        .replace(/money/g, "paper")
        .replace(/car/g, "whip")
        .replace(/house/g, "spot")
        .replace(/friend/g, "partner");
      
    default:
      return line;
  }
}