import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import ToolsNavigation from "@/components/layout/ToolsNavigation";
import { apiRequest } from "@/lib/queryClient";
import { getMusicStyles, getPersonas, Persona, MusicStyle } from "@/lib/types";

export default function SongWriter() {
  const [topic, setTopic] = useState("");
  const [mood, setMood] = useState("happy");
  const [genre, setGenre] = useState("");
  const [structure, setStructure] = useState("verse-chorus-verse-chorus-bridge-chorus");
  const [length, setLength] = useState([16]); // lines per verse
  const [generatedLyrics, setGeneratedLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("topic");
  
  // Get all personas and music styles
  const personas = getPersonas();
  const musicStyles = getMusicStyles();
  
  // Selected styles
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(
    personas[0] || null
  );
  
  const [selectedMusicStyle, setSelectedMusicStyle] = useState<MusicStyle | null>(
    null
  );

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/songwriter/generate", {
        topic,
        mood,
        genre: genre || (selectedMusicStyle?.name || ""),
        structure,
        linesPerVerse: length[0],
        personaId: selectedPersona?.id || null
      });
      return res.json() as Promise<{ generatedLyrics: string }>;
    },
    onSuccess: (data) => {
      setGeneratedLyrics(data.generatedLyrics);
      setActiveTab("results");
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to generate lyrics");
      console.error("Error generating lyrics:", err);
    }
  });

  const handleGenerate = () => {
    if (!topic.trim() && !genre.trim() && !selectedMusicStyle) {
      setError("Please enter a topic or select a genre/style");
      return;
    }
    
    setLoading(true);
    generateMutation.mutate();
  };

  const handleClear = () => {
    setTopic("");
    setGeneratedLyrics(null);
    setError(null);
    setActiveTab("topic");
  };

  const copyToClipboard = async () => {
    if (generatedLyrics) {
      try {
        await navigator.clipboard.writeText(generatedLyrics);
        // Show success message
      } catch (err) {
        console.error("Failed to copy to clipboard: ", err);
      }
    }
  };

  const moods = [
    "happy", "sad", "energetic", "calm", "angry", 
    "reflective", "hopeful", "dark", "uplifting"
  ];

  const songStructures = [
    "verse-chorus-verse-chorus-bridge-chorus",
    "verse-verse-chorus-verse-chorus",
    "intro-verse-chorus-verse-chorus-outro",
    "verse-pre-chorus-chorus-verse-pre-chorus-chorus-bridge-chorus",
    "verse-chorus-verse-chorus"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Song Writer</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="topic">Write Your Song</TabsTrigger>
            <TabsTrigger value="results" disabled={!generatedLyrics}>Generated Lyrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="topic" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Song Details</CardTitle>
                  <CardDescription>
                    Enter details for your song
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic or Theme</Label>
                    <Textarea
                      id="topic"
                      placeholder="What should your song be about?"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mood">Mood</Label>
                    <Select 
                      value={mood} 
                      onValueChange={setMood}
                    >
                      <SelectTrigger id="mood">
                        <SelectValue placeholder="Select mood" />
                      </SelectTrigger>
                      <SelectContent>
                        {moods.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m.charAt(0).toUpperCase() + m.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="genre">Genre (or enter custom)</Label>
                    <Input
                      id="genre"
                      placeholder="e.g., Hip Hop, R&B, Pop"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="musicStyle">Music Style Template</Label>
                    <Select 
                      value={selectedMusicStyle?.id || ""} 
                      onValueChange={(value) => {
                        const style = musicStyles.find(s => s.id === value);
                        setSelectedMusicStyle(style || null);
                        if (style) {
                          setGenre(""); // Clear custom genre if style is selected
                        }
                      }}
                    >
                      <SelectTrigger id="musicStyle">
                        <SelectValue placeholder="Select a style (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {musicStyles.map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            {style.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
              
              {/* Structure Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Song Structure</CardTitle>
                  <CardDescription>
                    Configure the structure of your song
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="structure">Song Structure</Label>
                    <Select 
                      value={structure} 
                      onValueChange={setStructure}
                    >
                      <SelectTrigger id="structure">
                        <SelectValue placeholder="Select structure" />
                      </SelectTrigger>
                      <SelectContent>
                        {songStructures.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('-')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="length">Lines Per Verse: {length[0]}</Label>
                    </div>
                    <Slider
                      id="length"
                      min={4}
                      max={24}
                      step={4}
                      value={length}
                      onValueChange={setLength}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="persona">Artist Style</Label>
                    <Select 
                      value={selectedPersona?.id || ""} 
                      onValueChange={(value) => {
                        const persona = personas.find(p => p.id === value);
                        setSelectedPersona(persona || null);
                      }}
                    >
                      <SelectTrigger id="persona">
                        <SelectValue placeholder="Select artist style" />
                      </SelectTrigger>
                      <SelectContent>
                        {personas.map((persona) => (
                          <SelectItem key={persona.id} value={persona.id}>
                            {persona.name} - {persona.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleGenerate} 
                    disabled={loading}
                    className="w-full mt-4"
                  >
                    {loading ? "Generating..." : "Generate Lyrics"}
                  </Button>
                  
                  {error && (
                    <div className="rounded-md bg-destructive/15 p-4 text-destructive">
                      {error}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Generated Lyrics</CardTitle>
                <CardDescription>
                  Your AI-generated song lyrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedLyrics ? (
                  <div className="whitespace-pre-wrap bg-muted p-4 rounded-md min-h-[400px]">
                    {generatedLyrics}
                  </div>
                ) : (
                  <div className="flex items-center justify-center text-muted-foreground min-h-[400px]">
                    No lyrics generated yet
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleClear}>
                  Start New Song
                </Button>
                <Button 
                  onClick={copyToClipboard} 
                  disabled={!generatedLyrics}
                >
                  Copy to Clipboard
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}