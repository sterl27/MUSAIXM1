import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Search, 
  Volume2, 
  Brain, 
  Star,
  TrendingUp,
  Clock,
  Zap
} from "lucide-react";

interface Persona {
  id: string;
  name: string;
  description: string;
  voiceId?: string;
  category: string;
  popularity: number;
  complexity: number;
  characteristics: string[];
  matchingVoices: string[];
}

interface PersonaSelectorProps {
  selectedPersona: string;
  onPersonaSelect: (personaId: string) => void;
  suggestedPersonas?: Array<{
    id: string;
    name: string;
    description: string;
    matchScore: number;
  }>;
  userLyrics?: string;
}

const PERSONAS: Persona[] = [
  {
    id: "eminem",
    name: "Eminem",
    description: "Rapid-fire delivery, complex wordplay, aggressive energy",
    voiceId: "pNInz6obpgDQGcFmaJgB",
    category: "aggressive",
    popularity: 95,
    complexity: 9,
    characteristics: ["Fast delivery", "Complex rhyme schemes", "Aggressive tone", "Technical wordplay"],
    matchingVoices: ["Adam", "Antoni", "Arnold"]
  },
  {
    id: "kendrick",
    name: "Kendrick Lamar",
    description: "Conscious rap, intricate storytelling, social commentary",
    voiceId: "ErXwobaYiN019PkySvjV",
    category: "conscious",
    popularity: 92,
    complexity: 8,
    characteristics: ["Storytelling", "Social awareness", "Dynamic flow", "Jazz influences"],
    matchingVoices: ["Josh", "Marcus", "Samuel"]
  },
  {
    id: "drake",
    name: "Drake",
    description: "Melodic rap, emotional vulnerability, mainstream appeal",
    voiceId: "VR6AewLTigWG4xSOukaG",
    category: "melodic",
    popularity: 98,
    complexity: 6,
    characteristics: ["Melodic hooks", "Emotional depth", "R&B influences", "Commercial appeal"],
    matchingVoices: ["Brian", "Chris", "Eric"]
  },
  {
    id: "jcole",
    name: "J. Cole",
    description: "Introspective lyricism, authentic storytelling, soulful production",
    voiceId: "pqHfZKP75CvOlQylNhV4",
    category: "conscious",
    popularity: 88,
    complexity: 7,
    characteristics: ["Introspection", "Life stories", "Soulful beats", "Genuine emotion"],
    matchingVoices: ["Daniel", "Dave", "Ethan"]
  },
  {
    id: "travisscott",
    name: "Travis Scott",
    description: "Auto-tuned vocals, atmospheric production, energetic performances",
    voiceId: "N2lVS1w4EtoT3dr4eOWO",
    category: "atmospheric",
    popularity: 89,
    complexity: 5,
    characteristics: ["Auto-tune effects", "Atmospheric sounds", "High energy", "Psychedelic vibes"],
    matchingVoices: ["Clyde", "Fin", "Harry"]
  },
  {
    id: "lilwayne",
    name: "Lil Wayne",
    description: "Clever wordplay, punchline rap, versatile flow patterns",
    voiceId: "flq6f7yk4E4fJM5XTYuZ",
    category: "punchline",
    popularity: 85,
    complexity: 8,
    characteristics: ["Punchlines", "Metaphors", "Flow switching", "Creative wordplay"],
    matchingVoices: ["Antoni", "Arnold", "Jeremy"]
  },
  {
    id: "nas",
    name: "Nas",
    description: "Lyrical prowess, street poetry, timeless storytelling",
    voiceId: "TxGEqnHWrfWFTfGW9XjX",
    category: "lyrical",
    popularity: 82,
    complexity: 9,
    characteristics: ["Lyrical density", "Street narratives", "Poetic imagery", "Classic flow"],
    matchingVoices: ["Michael", "River", "Roger"]
  },
  {
    id: "jayz",
    name: "Jay-Z",
    description: "Business-minded rap, confident delivery, commercial success",
    voiceId: "CYw3kZ02Hs0563khs1Fj",
    category: "business",
    popularity: 94,
    complexity: 7,
    characteristics: ["Business themes", "Confident delivery", "Luxury references", "Smooth flow"],
    matchingVoices: ["Bill", "Charlie", "George"]
  }
];

const CATEGORIES = [
  { id: "all", name: "All Personas", color: "bg-gray-500" },
  { id: "aggressive", name: "Aggressive", color: "bg-red-500" },
  { id: "conscious", name: "Conscious", color: "bg-green-500" },
  { id: "melodic", name: "Melodic", color: "bg-blue-500" },
  { id: "atmospheric", name: "Atmospheric", color: "bg-purple-500" },
  { id: "punchline", name: "Punchline", color: "bg-yellow-500" },
  { id: "lyrical", name: "Lyrical", color: "bg-indigo-500" },
  { id: "business", name: "Business", color: "bg-orange-500" }
];

export default function PersonaSelector({ 
  selectedPersona, 
  onPersonaSelect, 
  suggestedPersonas = [],
  userLyrics = "" 
}: PersonaSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"popularity" | "complexity" | "name">("popularity");

  const filteredPersonas = PERSONAS
    .filter(persona => 
      selectedCategory === "all" || persona.category === selectedCategory
    )
    .filter(persona => 
      persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.characteristics.some(char => 
        char.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularity - a.popularity;
        case "complexity":
          return b.complexity - a.complexity;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const selectedPersonaData = PERSONAS.find(p => p.id === selectedPersona);

  return (
    <div className="space-y-4">
      
      {/* AI Suggestions */}
      {suggestedPersonas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Brain className="h-4 w-4 text-purple-400" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestedPersonas.map((suggestion) => (
              <div 
                key={suggestion.id}
                className={`p-3 rounded-lg transition-all cursor-pointer border-2 ${
                  selectedPersona === suggestion.id 
                    ? 'bg-purple-900/30 border-purple-500' 
                    : 'bg-gray-800 border-transparent hover:bg-gray-700'
                }`}
                onClick={() => onPersonaSelect(suggestion.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">{suggestion.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs bg-purple-600">
                      {Math.round(suggestion.matchScore)}% match
                    </Badge>
                    <Star className="h-3 w-3 text-yellow-500" />
                  </div>
                </div>
                <p className="text-xs text-gray-400">{suggestion.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4" />
            Browse Personas ({filteredPersonas.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search personas, styles, characteristics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-1 text-xs"
              >
                <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                {category.name}
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Sort by:</span>
            <Button
              variant={sortBy === "popularity" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("popularity")}
              className="flex items-center gap-1"
            >
              <TrendingUp className="h-3 w-3" />
              Popular
            </Button>
            <Button
              variant={sortBy === "complexity" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("complexity")}
              className="flex items-center gap-1"
            >
              <Zap className="h-3 w-3" />
              Complex
            </Button>
            <Button
              variant={sortBy === "name" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("name")}
              className="flex items-center gap-1"
            >
              <User className="h-3 w-3" />
              A-Z
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Persona Grid */}
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 gap-3">
          {filteredPersonas.map((persona) => (
            <Card 
              key={persona.id}
              className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                selectedPersona === persona.id 
                  ? 'bg-blue-900/30 border-blue-500 shadow-blue-500/20' 
                  : 'border-gray-700 hover:border-gray-500'
              }`}
              onClick={() => onPersonaSelect(persona.id)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-base">{persona.name}</h3>
                    <p className="text-xs text-gray-400 mb-2">{persona.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${CATEGORIES.find(c => c.id === persona.category)?.color.replace('bg-', 'bg-opacity-20 border-')}`}
                    >
                      {CATEGORIES.find(c => c.id === persona.category)?.name}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-gray-400">{persona.popularity}%</span>
                    </div>
                  </div>
                </div>

                {/* Characteristics */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {persona.characteristics.slice(0, 3).map((char) => (
                    <Badge key={char} variant="outline" className="text-xs">
                      {char}
                    </Badge>
                  ))}
                  {persona.characteristics.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{persona.characteristics.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      <span>Complexity {persona.complexity}/10</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Volume2 className="h-3 w-3" />
                      <span>{persona.matchingVoices.length} voices</span>
                    </div>
                  </div>
                  {selectedPersona === persona.id && (
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Selected Persona Details */}
      {selectedPersonaData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              Selected: {selectedPersonaData.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-300">{selectedPersonaData.description}</p>
            
            <Separator />
            
            <div>
              <p className="text-xs text-gray-400 mb-2">Key Characteristics:</p>
              <div className="flex flex-wrap gap-1">
                {selectedPersonaData.characteristics.map((char) => (
                  <Badge key={char} variant="secondary" className="text-xs">
                    {char}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-xs text-gray-400 mb-2">Matching Voice Options:</p>
              <div className="flex flex-wrap gap-1">
                {selectedPersonaData.matchingVoices.map((voice) => (
                  <Badge key={voice} variant="outline" className="text-xs flex items-center gap-1">
                    <Volume2 className="h-2 w-2" />
                    {voice}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <p className="text-lg font-bold text-green-500">{selectedPersonaData.popularity}%</p>
                <p className="text-xs text-gray-400">Popularity</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-blue-500">{selectedPersonaData.complexity}/10</p>
                <p className="text-xs text-gray-400">Complexity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}