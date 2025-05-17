export interface Persona {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface EnhancementOptions {
  includeSunoTags: boolean;
  includeFxCues: boolean;
  flowStrength: number;
}

export interface EnhancedLyrics {
  content: string;
  persona: Persona;
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
