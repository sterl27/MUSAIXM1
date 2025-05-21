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
  sunoDescription: string;
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
    // Hip-Hop & Rap Personas
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
    },
    // Rock & Alternative Personas
    {
      id: "rock-ballad",
      name: "Rock Ballad",
      description: "Emotional power ballads",
      icon: "music"
    },
    {
      id: "alt-indie",
      name: "Alt/Indie",
      description: "Introspective and atmospheric",
      icon: "headphones"
    },
    // Electronic & Dance Personas
    {
      id: "edm",
      name: "EDM",
      description: "High-energy dance music",
      icon: "disc"
    },
    {
      id: "ambient",
      name: "Ambient",
      description: "Atmospheric soundscapes",
      icon: "cloud"
    },
    // Pop & R&B Personas
    {
      id: "pop-vocals",
      name: "Pop Vocals",
      description: "Catchy hooks and melodies",
      icon: "mic"
    },
    {
      id: "rnb-smooth",
      name: "R&B Smooth",
      description: "Soulful and melodic",
      icon: "heart"
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
      sunoDescription: "Heavy 808 bass, punchy drums, and dark synths create an atmospheric trap soundscape. Hi-hats roll with precision while sub-bass rumbles beneath. Minimal melody gives space for vocals while maintaining an aggressive edge."
    },
    {
      id: "rnb",
      name: "R&B",
      description: "Smooth, soulful production",
      icon: "music",
      sunoDescription: "Lush chord progressions and soulful instrumentation blend with mellow drums. Warm bass lines support smooth vocals, while subtle keys and atmospheric pads create depth. Organic percussion adds rhythm to this intimate sonic palette."
    },
    {
      id: "boom-bap",
      name: "Boom Bap",
      description: "Classic hip-hop drums",
      icon: "drum",
      sunoDescription: "Gritty vinyl samples and jazz loops create nostalgic texture. Hard-hitting kicks and snappy snares define the classic boom-bap rhythm. Dusty breaks and horn sections punctuate the groove, while vintage bass lines anchor this golden-era sound."
    },
    {
      id: "drill",
      name: "Drill",
      description: "Dark, sliding 808s",
      icon: "trending-up",
      sunoDescription: "Sliding 808 bass notes create menacing tension beneath dark melodies. Rapid hi-hats and punchy drums drive the rhythm with relentless energy. Minimal synthetic elements create space for vocals while maintaining a cold, street edge."
    },
    {
      id: "pop-rap",
      name: "Pop Rap",
      description: "Radio-friendly production",
      icon: "radio",
      sunoDescription: "Bright synthesizers and catchy hooks blend with clean, punchy production. Commercial polish gives way to radio-friendly structures and infectious melodies. Modern drum programming supports upbeat energy while maintaining hip-hop credibility."
    },
    {
      id: "lofi",
      name: "Lo-Fi",
      description: "Mellow, chill beats",
      icon: "coffee",
      sunoDescription: "Vinyl crackle and tape hiss add warmth to jazzy samples and dusty drums. Relaxed tempos create a laid-back atmosphere perfect for focus or relaxation. Filtered piano loops and subtle bass create a nostalgic, dreamy soundscape."
    },
    {
      id: "rock",
      name: "Rock",
      description: "Electric guitars and live drums",
      icon: "guitar",
      sunoDescription: "Crunchy electric guitars, punchy bass, and commanding drums introduce a bold theme. Alternating melodic sections use snare-driven, syncopated rhythms. Clean tones and octave melodies build into a raucous, up-tempo reprise with layered instrumentation."
    },
    {
      id: "future-funk",
      name: "Future Funk",
      description: "Retro-futuristic disco vibes",
      icon: "disc",
      sunoDescription: "Atmospheric city pop samples blend with funky bass lines and hypnotic DJ beats. Vintage synthesizers create nostalgic melodies while modern production techniques add punch. Disco influence merges with electronic elements for a retro-futuristic dance experience."
    }
  ];
}

// Get music style by ID
export function getMusicStyleById(id: string): MusicStyle | undefined {
  return getMusicStyles().find(style => style.id === id);
}
