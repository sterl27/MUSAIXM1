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
  const [complexity, setComplexity] = useState([3]);
  const [length, setLength] = useState<string>("medium");
  const [structure, setStructure] = useState<string[]>(["verse", "chorus", "verse", "chorus", "bridge", "chorus"]);
  const [useAI, setUseAI] = useState(true);
  
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [selectedMusicStyle, setSelectedMusicStyle] = useState<MusicStyle | null>(null);
  
  const [generatedLyrics, setGeneratedLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const personas = getPersonas();
  const musicStyles = getMusicStyles();
  
  // Song generation function
  const { mutate: generateSong } = useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(null);
      
      // Get details for request
      const personaId = selectedPersona?.id || null;
      
      try {
        const response = await apiRequest(
          "POST",
          "/api/songwriter",
          {
            topic,
            mood,
            genre: selectedMusicStyle?.id || genre,
            complexity: complexity[0],
            length,
            structure,
            personaId,
            useAI
          }
        );
        
        const data = await response.json();
        return data;
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    
    onSuccess: (data) => {
      if (data && data.lyrics) {
        setGeneratedLyrics(data.lyrics);
      }
    },
    
    onError: (err: Error) => {
      setError(err.message);
    }
  });
  
  const handleAddSection = (section: string) => {
    setStructure([...structure, section]);
  };
  
  const handleRemoveSection = (index: number) => {
    setStructure(structure.filter((_, i) => i !== index));
  };
  
  const handleMoveSection = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index > 0) {
      const newStructure = [...structure];
      [newStructure[index - 1], newStructure[index]] = [newStructure[index], newStructure[index - 1]];
      setStructure(newStructure);
    } else if (direction === "down" && index < structure.length - 1) {
      const newStructure = [...structure];
      [newStructure[index], newStructure[index + 1]] = [newStructure[index + 1], newStructure[index]];
      setStructure(newStructure);
    }
  };
  
  const handleGenerate = () => {
    if (!topic.trim()) {
      setError("Please enter a topic for your song");
      return;
    }
    
    generateSong();
  };
  
  const handleClear = () => {
    setGeneratedLyrics(null);
    setError(null);
  };
  
  const copyToClipboard = () => {
    if (generatedLyrics) {
      navigator.clipboard.writeText(generatedLyrics);
    }
  };
  
  // Get section name
  const getSectionName = (section: string) => {
    switch (section) {
      case "verse": return "Verse";
      case "chorus": return "Chorus";
      case "bridge": return "Bridge";
      case "intro": return "Intro";
      case "outro": return "Outro";
      case "pre-chorus": return "Pre-Chorus";
      default: return section;
    }
  };

  return (
    <PageLayout title="AI Song Writer" description="Generate song lyrics based on your ideas">
      <ToolsNavigation />
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 w-full md:w-[400px]">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="output">Generated Lyrics</TabsTrigger>
        </TabsList>
        
        {/* Basic Options Tab */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Song Idea</CardTitle>
                <CardDescription>
                  Describe what you want your song to be about
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic or Theme</Label>
                  <Input
                    id="topic"
                    placeholder="Enter the main topic of your song"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Example: "Love", "Heartbreak", "Summer vibes", "Overcoming challenges"
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mood">Mood</Label>
                  <RadioGroup
                    value={mood}
                    onValueChange={setMood}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="happy" id="happy" />
                      <Label htmlFor="happy">Happy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sad" id="sad" />
                      <Label htmlFor="sad">Sad</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="chill" id="chill" />
                      <Label htmlFor="chill">Chill</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="energetic" id="energetic" />
                      <Label htmlFor="energetic">Energetic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="angry" id="angry" />
                      <Label htmlFor="angry">Angry</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reflective" id="reflective" />
                      <Label htmlFor="reflective">Reflective</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="musicStyle">Music Style Template</Label>
                  <Select 
                    value={selectedMusicStyle?.id || "none"} 
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
                
                {!selectedMusicStyle && (
                  <div className="space-y-2">
                    <Label htmlFor="genre">Custom Genre</Label>
                    <Input
                      id="genre"
                      placeholder="Enter a music genre"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      disabled={!!selectedMusicStyle}
                    />
                    <p className="text-sm text-muted-foreground">
                      Example: "Pop", "Hip-hop", "Rock", "Country", "EDM"
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleGenerate} 
                  disabled={loading || !topic.trim()}
                  className="w-full"
                >
                  {loading ? "Generating..." : "Generate Lyrics"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Song Structure</CardTitle>
                <CardDescription>
                  Define how your song is structured
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="complexity">Complexity: {complexity[0]}</Label>
                  <Slider
                    id="complexity"
                    min={1}
                    max={5}
                    step={1}
                    value={complexity}
                    onValueChange={setComplexity}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Simple</span>
                    <span>Complex</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="length">Song Length</Label>
                  <RadioGroup
                    value={length}
                    onValueChange={setLength}
                    className="grid grid-cols-3 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="short" id="short" />
                      <Label htmlFor="short">Short</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="long" id="long" />
                      <Label htmlFor="long">Long</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <Label htmlFor="useAI" className="cursor-pointer">Use AI Generation</Label>
                  <Switch 
                    id="useAI" 
                    checked={useAI} 
                    onCheckedChange={setUseAI} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="persona">Artist Style (Optional)</Label>
                  <Select 
                    value={selectedPersona?.id || ""} 
                    onValueChange={(value) => {
                      const persona = personas.find(p => p.id === value);
                      setSelectedPersona(persona || null);
                    }}
                  >
                    <SelectTrigger id="persona">
                      <SelectValue placeholder="Select an artist style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {personas.map((persona) => (
                        <SelectItem key={persona.id} value={persona.id}>
                          {persona.name} - {persona.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Applies an artist's writing style to your lyrics
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Advanced Options Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Song Structure</CardTitle>
                <CardDescription>
                  Arrange the sections of your song
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Structure</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    {structure.map((section, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between items-center p-2 bg-muted rounded-md"
                      >
                        <span className="font-medium">{getSectionName(section)}</span>
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMoveSection(index, "up")}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleMoveSection(index, "down")}
                            disabled={index === structure.length - 1}
                          >
                            ↓
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveSection(index)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {structure.length === 0 && (
                      <div className="text-center text-muted-foreground py-2">
                        No sections added yet
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label>Add Section</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleAddSection("intro")}
                    >
                      Add Intro
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAddSection("verse")}
                    >
                      Add Verse
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAddSection("pre-chorus")}
                    >
                      Add Pre-Chorus
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAddSection("chorus")}
                    >
                      Add Chorus
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAddSection("bridge")}
                    >
                      Add Bridge
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleAddSection("outro")}
                    >
                      Add Outro
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setStructure(["verse", "chorus", "verse", "chorus", "bridge", "chorus"])}
                >
                  Reset to Default
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Settings</CardTitle>
                <CardDescription>
                  Configure AI generation options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-md p-4 space-y-3">
                  <h3 className="font-medium">AI Features</h3>
                  <p className="text-sm text-muted-foreground">
                    When AI generation is enabled, our system will:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Generate lyrics based on your topic and mood</li>
                    <li>Apply the selected artist style (if chosen)</li>
                    <li>Structure the song according to your preferences</li>
                    <li>Add rhyming patterns and flow to match your genre</li>
                  </ul>
                  <div className="pt-2">
                    <Button 
                      onClick={handleGenerate} 
                      disabled={loading || !topic.trim()}
                      className="w-full"
                    >
                      {loading ? "Generating..." : "Generate Lyrics"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Output Tab */}
        <TabsContent value="output">
          <Card>
            <CardHeader>
              <CardTitle>Generated Lyrics</CardTitle>
              <CardDescription>
                {generatedLyrics ? "Your AI-generated lyrics" : "Generated lyrics will appear here"}
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
    </PageLayout>
  );
}