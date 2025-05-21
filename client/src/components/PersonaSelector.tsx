import { Persona } from "@/lib/types";
import { getPersonas } from "@/lib/types";
import { Crown, Flame, Volume2, Mic, CheckCircle, Theater } from "lucide-react";
import VoicePreview from "./VoicePreview";

interface PersonaSelectorProps {
  selectedPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
}

// Function to get sample text for each persona
function getSampleTextForPersona(personaId: string): string {
  switch(personaId) {
    case "outkast":
      return "ATL, here we go for the show. Spittin' verses while we're stackin' dough. The South got somethin' to say, every single day.";
    case "goodiemob":
      return "In the dirty South we rise, wisdom in our eyes. Soul food for thought while we touch the sky. Cell therapy for the mind.";
    case "liljon":
      return "YEAH! WHAT? OKAY! LET'S GO! TURN UP THE SPEAKERS AND FEEL THE BEAT! CRUNK AIN'T DEAD!";
    case "ti":
      return "Welcome to the trap, where we strategize and adapt. Hustle hard, stay sharp, that's the only way to live large.";
    default:
      return "Welcome to Musaix. Let's enhance these lyrics with some Southern flow.";
  }
}

export default function PersonaSelector({ selectedPersona, onSelectPersona }: PersonaSelectorProps) {
  const personas = getPersonas();
  
  // Function to render the appropriate icon based on persona.icon
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "crown":
        return <Crown className="text-secondary" />;
      case "fire":
        return <Flame className="text-secondary" />;
      case "volume-high":
        return <Volume2 className="text-secondary" />;
      case "microphone":
        return <Mic className="text-secondary" />;
      default:
        return <Mic className="text-secondary" />;
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-5 border border-muted">
      <h2 className="font-semibold text-xl mb-4 flex items-center">
        <Theater className="text-secondary mr-2" size={20} />
        Music Persona
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Choose a music persona to define genre, tempo, sound vibe, vocals and overall style
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {personas.map((persona) => (
          <div className="relative" key={persona.id}>
            <input 
              type="radio" 
              id={`persona-${persona.id}`}
              name="persona" 
              value={persona.id}
              className="peer sr-only" 
              checked={selectedPersona.id === persona.id}
              onChange={() => onSelectPersona(persona)}
            />
            <label 
              htmlFor={`persona-${persona.id}`} 
              className="flex flex-col items-center p-3 border-2 border-muted rounded-lg cursor-pointer hover:bg-muted transition-colors peer-checked:border-secondary peer-checked:bg-muted"
            >
              <span className="font-medium text-lg">{persona.name}</span>
              <span className="text-sm text-muted-foreground mt-1">{persona.description}</span>
            </label>
            <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-secondary">
              <CheckCircle size={16} />
            </div>
          </div>
        ))}
      </div>
      
      {/* Voice Preview Section */}
      <div className="mt-4 pt-4 border-t border-muted">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <Volume2 className="text-secondary mr-2" size={16} />
          Voice Preview
        </h3>
        <p className="text-xs text-muted-foreground mb-2">
          Hear how your lyrics might sound with this persona's voice
        </p>
        
        <div className="bg-muted p-3 rounded-md">
          <VoicePreview 
            persona={selectedPersona} 
            sampleText={getSampleTextForPersona(selectedPersona.id)}
          />
          <p className="text-xs text-muted-foreground mt-2 italic">
            Using Microsoft David - English (United States)
          </p>
        </div>
      </div>
    </div>
  );
}
