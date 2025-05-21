import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import ToolsNavigation from "@/components/layout/ToolsNavigation";
import PersonaSelector from "@/components/PersonaSelector";
import { Persona, getPersonas } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoicePreview from "@/components/VoicePreview";
import SoundSignature from "@/components/SoundSignature";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MusicIcon, Flame, Star, Activity } from "lucide-react";

export default function Personas() {
  const [selectedPersona, setSelectedPersona] = useState<Persona>({
    id: "outkast",
    name: "OutKast",
    description: "Southern flow",
    icon: "crown"
  });
  
  const [activeTab, setActiveTab] = useState("all");
  
  const personas = getPersonas();
  
  // Group personas by category
  const personaCategories = {
    "hiphop": personas.filter(p => 
      ["kendrick", "drake", "future", "jcole", "travis", "nicki", "outkast"].includes(p.id)
    ),
    "rock": personas.filter(p => 
      ["rock-classic", "rock-punk", "rock-indie", "metal"].includes(p.id)
    ),
    "electronic": personas.filter(p => 
      ["electronic-edm", "electronic-ambient", "electronic-techno"].includes(p.id)
    ),
    "pop": personas.filter(p => 
      ["pop-mainstream", "pop-indie", "rnb-classic", "rnb-modern"].includes(p.id)
    ),
    "other": personas.filter(p => 
      ["country", "jazz", "folk"].includes(p.id)
    )
  };
  
  // Display all personas or filtered by category
  const displayedPersonas = activeTab === "all" 
    ? personas 
    : personaCategories[activeTab as keyof typeof personaCategories] || [];

  return (
    <PageLayout title="Music Personas" description="Explore and preview different music styles and personas">
      <ToolsNavigation />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Selected Persona</CardTitle>
              <CardDescription>Preview and test the selected music persona</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">{selectedPersona.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedPersona.name}</h3>
                  <p className="text-muted-foreground">{selectedPersona.description}</p>
                </div>
              </div>
              
              <div className="space-y-3 p-4 bg-muted/50 rounded-md">
                <h4 className="font-medium flex items-center">
                  <Flame className="w-4 h-4 mr-2 text-amber-500" />
                  Characteristics
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-primary/5">Delivery Style</Badge>
                  <Badge variant="outline" className="bg-primary/5">Flow Patterns</Badge>
                  <Badge variant="outline" className="bg-primary/5">Vocal Range</Badge>
                  <Badge variant="outline" className="bg-primary/5">Lyrical Themes</Badge>
                </div>
              </div>
              
              {/* Sound Signature Visualization */}
              <div className="p-4 border rounded-md bg-card">
                <h4 className="text-sm font-medium flex items-center mb-2">
                  <Activity className="w-4 h-4 mr-2 text-blue-500" />
                  Sound Signature
                </h4>
                <SoundSignature persona={selectedPersona} />
              </div>
              
              <VoicePreview 
                persona={selectedPersona} 
                sampleText="This is how your lyrics will sound when enhanced with this persona style." 
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MusicIcon className="mr-2 h-5 w-5" />
                Browse Personas
              </CardTitle>
              <CardDescription>
                Select a persona to preview its style and characteristics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-6 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="hiphop">Hip-Hop</TabsTrigger>
                  <TabsTrigger value="rock">Rock</TabsTrigger>
                  <TabsTrigger value="electronic">Electronic</TabsTrigger>
                  <TabsTrigger value="pop">Pop/R&B</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayedPersonas.map(persona => (
                      <div 
                        key={persona.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedPersona.id === persona.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedPersona(persona)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary">{persona.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{persona.name}</h3>
                              {selectedPersona.id === persona.id && (
                                <Star className="h-4 w-4 ml-2 fill-amber-500 text-amber-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{persona.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}