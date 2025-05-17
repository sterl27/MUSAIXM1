import { Persona } from "@/lib/types";
import { getPersonas } from "@/lib/types";
import { Crown, Flame, Volume2, Mic, CheckCircle, Theater } from "lucide-react";

interface PersonaSelectorProps {
  selectedPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
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
        Persona Selection
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Choose a rap style/persona to enhance your lyrics
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
              <div className="text-2xl mb-1">
                {renderIcon(persona.icon)}
              </div>
              <span className="font-medium">{persona.name}</span>
              <span className="text-xs text-muted-foreground">{persona.description}</span>
            </label>
            <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-secondary">
              <CheckCircle size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
