export interface Persona {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface MusicStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface EnhancementOptions {
  includeSunoTags: boolean;
  includeFxCues: boolean;
  flowStrength: number;
  musicStyle: string | null;
}

export interface EnhancedLyrics {
  content: string;
  persona: Persona;
  musicStyle?: MusicStyle;
}

// Function to get all available personas
export function getPersonas(): Persona[] {
  return [
    {
      id: "outkast",
      name: "OutKast",
      description: "Southern flow",
      icon: "crown"
    },
    {
      id: "goodiemob",
      name: "Goodie Mob",
      description: "Soul food vibes",
      icon: "fire"
    },
    {
      id: "liljon",
      name: "Lil Jon",
      description: "Crunk energy",
      icon: "volume-high"
    },
    {
      id: "ti",
      name: "T.I.",
      description: "Trap precision",
      icon: "microphone"
    }
  ];
}

// Get persona by ID
export function getPersonaById(id: string): Persona | undefined {
  return getPersonas().find(persona => persona.id === id);
}

// Function to get all available music styles
export function getMusicStyles(): MusicStyle[] {
  return [
    {
      id: "trap",
      name: "Trap",
      description: "Hard-hitting bass and 808s",
      icon: "bass",
      tags: ["trap drums", "808 bass", "dark synths", "hi-hats"]
    },
    {
      id: "rnb",
      name: "R&B",
      description: "Smooth, soulful production",
      icon: "music",
      tags: ["melodic", "soul samples", "smooth drums", "vocal harmonies"]
    },
    {
      id: "boom-bap",
      name: "Boom Bap",
      description: "Classic hip-hop drums",
      icon: "drum",
      tags: ["vinyl samples", "heavy drums", "jazz loops", "boom bap drums"]
    },
    {
      id: "drill",
      name: "Drill",
      description: "Dark, sliding 808s",
      icon: "trending-up",
      tags: ["sliding 808s", "dark melodies", "punchy drums", "energetic"]
    },
    {
      id: "pop-rap",
      name: "Pop Rap",
      description: "Radio-friendly production",
      icon: "radio",
      tags: ["catchy hooks", "clean production", "bright synths", "melodic"]
    },
    {
      id: "lofi",
      name: "Lo-Fi",
      description: "Mellow, chill beats",
      icon: "coffee",
      tags: ["vinyl crackle", "jazz samples", "chill drums", "relaxed tempo"]
    }
  ];
}

// Get music style by ID
export function getMusicStyleById(id: string): MusicStyle | undefined {
  return getMusicStyles().find(style => style.id === id);
}
