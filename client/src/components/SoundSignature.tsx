import { useState, useEffect } from "react";
import { Persona } from "@/lib/types";
import { CardContent } from "@/components/ui/card";

// Vocal characteristics to visualize
interface VocalCharacteristics {
  pitch: number;      // Scale of 1-10, lower to higher
  richness: number;   // Scale of 1-10, thin to rich/full
  intensity: number;  // Scale of 1-10, soft to powerful
  clarity: number;    // Scale of 1-10, raspy to clear
  pace: number;       // Scale of 1-10, slow to fast
}

interface SoundSignatureProps {
  persona: Persona;
  lyrics?: string; // Optional lyrics that might influence the signature
  className?: string;
}

export default function SoundSignature({ persona, lyrics = "", className = "" }: SoundSignatureProps) {
  const [characteristics, setCharacteristics] = useState<VocalCharacteristics>({
    pitch: 5,
    richness: 5,
    intensity: 5,
    clarity: 5,
    pace: 5
  });

  // Calculate vocal characteristics based on persona
  useEffect(() => {
    // Define base characteristics for each persona type
    const getBaseCharacteristics = (): VocalCharacteristics => {
      switch (persona.id) {
        // Rap personas
        case "kendrick":
          return { pitch: 6, richness: 7, intensity: 8, clarity: 9, pace: 7 };
        case "drake":
          return { pitch: 5, richness: 6, intensity: 6, clarity: 8, pace: 6 };
        case "future":
          return { pitch: 4, richness: 8, intensity: 7, clarity: 4, pace: 6 };
        case "jcole":
          return { pitch: 5, richness: 7, intensity: 6, clarity: 8, pace: 5 };
        case "travis":
          return { pitch: 4, richness: 6, intensity: 7, clarity: 5, pace: 6 };
        case "nicki":
          return { pitch: 8, richness: 6, intensity: 9, clarity: 7, pace: 8 };
        case "outkast":
          return { pitch: 7, richness: 8, intensity: 8, clarity: 7, pace: 8 };
          
        // Rock personas
        case "rock-classic":
          return { pitch: 6, richness: 9, intensity: 9, clarity: 7, pace: 6 };
        case "rock-punk":
          return { pitch: 7, richness: 6, intensity: 10, clarity: 5, pace: 9 };
        case "rock-indie":
          return { pitch: 6, richness: 7, intensity: 6, clarity: 8, pace: 5 };
          
        // Electronic personas
        case "electronic-edm":
          return { pitch: 5, richness: 5, intensity: 8, clarity: 7, pace: 9 };
        case "electronic-ambient":
          return { pitch: 4, richness: 9, intensity: 4, clarity: 9, pace: 3 };
        case "electronic-techno":
          return { pitch: 5, richness: 6, intensity: 8, clarity: 6, pace: 10 };
          
        // Pop personas
        case "pop-mainstream":
          return { pitch: 7, richness: 7, intensity: 7, clarity: 9, pace: 7 };
        case "pop-indie":
          return { pitch: 6, richness: 6, intensity: 5, clarity: 8, pace: 5 };
          
        // R&B personas
        case "rnb-classic":
          return { pitch: 6, richness: 9, intensity: 6, clarity: 8, pace: 4 };
        case "rnb-modern":
          return { pitch: 7, richness: 8, intensity: 7, clarity: 8, pace: 6 };
          
        // Default/fallback
        default:
          return { pitch: 5, richness: 5, intensity: 5, clarity: 5, pace: 5 };
      }
    };
    
    // Get base characteristics
    const baseCharacteristics = getBaseCharacteristics();
    
    // Adjust based on lyrics if provided
    if (lyrics) {
      // Create a copy of the base characteristics
      const adjustedCharacteristics = { ...baseCharacteristics };
      
      // Apply simple adjustments based on lyrics content
      const lowerCaseLyrics = lyrics.toLowerCase();

      // Intensity adjustment - check for exclamation marks or intensity words
      if (lyrics.includes("!") || 
          lowerCaseLyrics.includes("fire") || 
          lowerCaseLyrics.includes("strong") ||
          lowerCaseLyrics.includes("power")) {
        adjustedCharacteristics.intensity = Math.min(10, adjustedCharacteristics.intensity + 1);
      }
      
      // Pace adjustment - check for fast-paced indicators
      if (lowerCaseLyrics.includes("fast") || 
          lowerCaseLyrics.includes("quick") || 
          lowerCaseLyrics.includes("rush")) {
        adjustedCharacteristics.pace = Math.min(10, adjustedCharacteristics.pace + 1);
      } else if (lowerCaseLyrics.includes("slow") || 
                lowerCaseLyrics.includes("calm") || 
                lowerCaseLyrics.includes("peaceful")) {
        adjustedCharacteristics.pace = Math.max(1, adjustedCharacteristics.pace - 1);
      }
      
      // Set the adjusted characteristics
      setCharacteristics(adjustedCharacteristics);
    } else {
      // If no lyrics, just use the base characteristics
      setCharacteristics(baseCharacteristics);
    }
  }, [persona.id, lyrics]);

  // Function to get color based on value
  const getColor = (value: number): string => {
    // Color gradient from blue (cool) to red (hot)
    const hue = Math.max(0, Math.min(240 - (value - 1) * 24, 240));
    return `hsl(${hue}, 100%, 50%)`;
  };

  return (
    <div className={`relative p-4 ${className}`}>
      <h3 className="text-sm font-medium mb-3">Sound Signature</h3>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Object.entries(characteristics).map(([key, value]) => (
          <div key={key} className="flex flex-col items-center">
            <div
              className="w-4 rounded-full transition-all duration-300"
              style={{
                height: `${value * 6}px`,
                backgroundColor: getColor(value),
                boxShadow: `0 0 8px ${getColor(value)}80`
              }}
            ></div>
            <span className="text-xs mt-2 capitalize">{key}</span>
            <span className="text-xs text-muted-foreground">{value}/10</span>
          </div>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        This visualization represents the vocal characteristics of {persona.name}'s sound signature.
      </div>
    </div>
  );
}