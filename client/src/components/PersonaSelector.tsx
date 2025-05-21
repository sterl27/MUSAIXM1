import { Persona } from "@/lib/types";
import { getPersonas } from "@/lib/types";
import { Crown, Flame, Volume2, Mic, CheckCircle, Theater } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoicePreview from "./VoicePreview";

interface PersonaSelectorProps {
  selectedPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
}

// Function to get sample text for each persona
function getSampleTextForPersona(personaId: string): string {
  switch(personaId) {
    // Hip Hop & Rap
    case "outkast":
      return "ATL, here we go for the show. Spittin' verses while we're stackin' dough. The South got somethin' to say, every single day.";
    case "goodiemob":
      return "In the dirty South we rise, wisdom in our eyes. Soul food for thought while we touch the sky. Cell therapy for the mind.";
    case "liljon":
      return "YEAH! WHAT? OKAY! LET'S GO! TURN UP THE SPEAKERS AND FEEL THE BEAT! CRUNK AIN'T DEAD!";
    case "ti":
      return "Welcome to the trap, where we strategize and adapt. Hustle hard, stay sharp, that's the only way to live large.";
    
    // Rock & Alternative
    case "rock-ballad":
      return "As the night falls, I remember your face. Every moment, every heartbeat, I can't erase. The memories we made, like a flame that won't die.";
    case "alt-indie":
      return "Whispers in vacant rooms, echoes of forgotten dreams. We're hanging by a thread as the city sleeps, searching for meaning in the noise.";
    
    // Electronic & Dance
    case "edm":
      return "Feel the bass drop, as we reach for the sky. Hands up, lose yourself, let the rhythm take you high. The night is young, and we won't stop.";
    case "ambient":
      return "Floating through endless space, surrounded by stars and silence. Time stands still as waves of sound wash over consciousness.";
    
    // Pop & R&B
    case "pop-vocals":
      return "This is the moment we've been waiting for. Tonight we're letting go, dancing on the edge. Your love is like a melody I can't get out of my head.";
    case "rnb-smooth":
      return "Baby, when the lights are low, and it's just you and me. I feel your heart beating close to mine. Let me show you what love can be.";
    
    // Default
    default:
      return "Welcome to Musaix. Select a music persona to enhance your lyrics with unique style and sound.";
  }
}

export default function PersonaSelector({ selectedPersona, onSelectPersona }: PersonaSelectorProps) {
  const personas = getPersonas();
  
  // Function to render the appropriate icon based on persona.icon
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "crown":
        return <Crown className="text-secondary" />;
      case "brain":
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/></svg>;
      case "zap":
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
      case "target":
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
      case "music":
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
      case "headphones":
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;
      case "disc":
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m9.17 14.83-4.24 4.24"/></svg>;
      case "cloud":
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>;
      case "mic":
        return <Mic className="text-secondary" />;
      case "heart":
        return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>;
      default:
        return <Mic className="text-secondary" />;
    }
  };

  // Group personas by category
  const hiphopPersonas = personas.filter(p => ["outkast", "goodiemob", "liljon", "ti"].includes(p.id));
  const rockPersonas = personas.filter(p => ["rock-ballad", "alt-indie"].includes(p.id));
  const electronicPersonas = personas.filter(p => ["edm", "ambient"].includes(p.id));
  const popRnbPersonas = personas.filter(p => ["pop-vocals", "rnb-smooth"].includes(p.id));

  return (
    <div className="bg-card rounded-xl shadow-lg p-5 border border-muted">
      <h2 className="font-semibold text-xl mb-4 flex items-center">
        <Theater className="text-secondary mr-2" size={20} />
        Music Persona
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Choose a music persona to define genre, tempo, sound vibe, vocals and overall style
      </p>
      
      <Tabs defaultValue="hiphop" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="hiphop">Hip-Hop</TabsTrigger>
          <TabsTrigger value="rock">Rock</TabsTrigger>
          <TabsTrigger value="electronic">Electronic</TabsTrigger>
          <TabsTrigger value="pop">Pop/R&B</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hiphop">
          <div className="grid grid-cols-2 gap-3">
            {hiphopPersonas.map((persona) => (
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
                  <span className="font-medium text-lg">{persona.name}</span>
                  <span className="text-sm text-muted-foreground mt-1">{persona.description}</span>
                </label>
                <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-secondary">
                  <CheckCircle size={16} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="rock">
          <div className="grid grid-cols-2 gap-3">
            {rockPersonas.map((persona) => (
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
                  <span className="font-medium text-lg">{persona.name}</span>
                  <span className="text-sm text-muted-foreground mt-1">{persona.description}</span>
                </label>
                <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-secondary">
                  <CheckCircle size={16} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="electronic">
          <div className="grid grid-cols-2 gap-3">
            {electronicPersonas.map((persona) => (
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
                  <span className="font-medium text-lg">{persona.name}</span>
                  <span className="text-sm text-muted-foreground mt-1">{persona.description}</span>
                </label>
                <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-secondary">
                  <CheckCircle size={16} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pop">
          <div className="grid grid-cols-2 gap-3">
            {popRnbPersonas.map((persona) => (
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
                  <span className="font-medium text-lg">{persona.name}</span>
                  <span className="text-sm text-muted-foreground mt-1">{persona.description}</span>
                </label>
                <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-secondary">
                  <CheckCircle size={16} />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
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
