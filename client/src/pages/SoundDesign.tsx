import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { apiRequest } from "@/lib/queryClient";

export default function SoundDesign() {
  // Tab state
  const [activeTab, setActiveTab] = useState("effects");
  
  // Effects
  const [selectedEffect, setSelectedEffect] = useState("reverb");
  const [intensity, setIntensity] = useState([50]);
  const [effectsChain, setEffectsChain] = useState<string[]>([]);
  
  // Instruments
  const [selectedInstrument, setSelectedInstrument] = useState("synth");
  const [pitch, setPitch] = useState([0]);
  const [instrumentPresets, setInstrumentPresets] = useState<string[]>([]);
  
  // Sound description
  const [soundDescription, setSoundDescription] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  
  // Shared state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Effects list
  const effects = [
    { id: "reverb", name: "Reverb", description: "Add space and depth" },
    { id: "delay", name: "Delay", description: "Echo effects" },
    { id: "distortion", name: "Distortion", description: "Add grit and character" },
    { id: "compression", name: "Compression", description: "Balance dynamics" },
    { id: "filter", name: "Filter", description: "Shape frequency response" },
    { id: "chorus", name: "Chorus", description: "Create thickness and movement" },
    { id: "flanger", name: "Flanger", description: "Swooshing sounds" },
    { id: "phaser", name: "Phaser", description: "Sweeping effects" }
  ];
  
  // Instruments list
  const instruments = [
    { id: "synth", name: "Synthesizer", description: "Electronic tones" },
    { id: "piano", name: "Piano", description: "Acoustic or electric" },
    { id: "guitar", name: "Guitar", description: "Acoustic or electric" },
    { id: "bass", name: "Bass", description: "Low-end foundation" },
    { id: "strings", name: "Strings", description: "Orchestral elements" },
    { id: "brass", name: "Brass", description: "Trumpet, saxophone, etc." },
    { id: "drums", name: "Drums", description: "Percussion elements" },
    { id: "pads", name: "Pads", description: "Ambient textures" }
  ];
  
  // Add an effect to the chain
  const addEffect = () => {
    if (!effectsChain.includes(selectedEffect)) {
      setEffectsChain([...effectsChain, selectedEffect]);
    }
  };
  
  // Remove an effect from the chain
  const removeEffect = (effectId: string) => {
    setEffectsChain(effectsChain.filter(id => id !== effectId));
  };
  
  // Add an instrument preset
  const addInstrument = () => {
    const preset = `${selectedInstrument} (pitch: ${pitch[0]})`;
    if (!instrumentPresets.includes(preset)) {
      setInstrumentPresets([...instrumentPresets, preset]);
    }
  };
  
  // Remove an instrument preset
  const removeInstrument = (index: number) => {
    setInstrumentPresets(instrumentPresets.filter((_, i) => i !== index));
  };
  
  // Generate sound design suggestion
  const generateSuggestion = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/sounddesign/suggest", {
        description: soundDescription,
        effects: effectsChain,
        instruments: instrumentPresets
      });
      return res.json() as Promise<{ suggestion: string }>;
    },
    onSuccess: (data) => {
      setAiSuggestion(data.suggestion);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to generate sound design suggestion");
      console.error("Error generating suggestion:", err);
    }
  });
  
  // Handle generate suggestion
  const handleGenerateSuggestion = () => {
    if (!soundDescription.trim()) {
      setError("Please enter a sound description");
      return;
    }
    
    setLoading(true);
    generateSuggestion.mutate();
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Sound Design</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="effects">Effects</TabsTrigger>
            <TabsTrigger value="instruments">Instruments</TabsTrigger>
            <TabsTrigger value="generator">AI Sound Generator</TabsTrigger>
          </TabsList>
          
          {/* Effects Tab */}
          <TabsContent value="effects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Audio Effects</CardTitle>
                  <CardDescription>
                    Add effects to your sound design chain
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="effect">Select Effect</Label>
                    <Select 
                      value={selectedEffect} 
                      onValueChange={setSelectedEffect}
                    >
                      <SelectTrigger id="effect">
                        <SelectValue placeholder="Select effect" />
                      </SelectTrigger>
                      <SelectContent>
                        {effects.map((effect) => (
                          <SelectItem key={effect.id} value={effect.id}>
                            {effect.name} - {effect.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="intensity">Effect Intensity: {intensity[0]}%</Label>
                    </div>
                    <Slider
                      id="intensity"
                      min={0}
                      max={100}
                      step={1}
                      value={intensity}
                      onValueChange={setIntensity}
                    />
                  </div>
                  
                  <Button 
                    onClick={addEffect} 
                    className="w-full mt-4"
                  >
                    Add To Chain
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Effects Chain</CardTitle>
                  <CardDescription>
                    Your sound processing chain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {effectsChain.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No effects added yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {effectsChain.map((effectId, index) => {
                        const effect = effects.find(e => e.id === effectId);
                        return (
                          <div 
                            key={`${effectId}-${index}`} 
                            className="flex items-center justify-between p-3 bg-muted rounded-md"
                          >
                            <div>
                              <span className="font-medium">{effect?.name}</span>
                              <span className="text-sm text-muted-foreground ml-2">
                                {intensity[0]}% intensity
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeEffect(effectId)}
                            >
                              Remove
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setEffectsChain([])}
                    disabled={effectsChain.length === 0}
                  >
                    Clear Chain
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* Instruments Tab */}
          <TabsContent value="instruments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Instruments</CardTitle>
                  <CardDescription>
                    Configure instruments for your sound design
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="instrument">Select Instrument</Label>
                    <Select 
                      value={selectedInstrument} 
                      onValueChange={setSelectedInstrument}
                    >
                      <SelectTrigger id="instrument">
                        <SelectValue placeholder="Select instrument" />
                      </SelectTrigger>
                      <SelectContent>
                        {instruments.map((instrument) => (
                          <SelectItem key={instrument.id} value={instrument.id}>
                            {instrument.name} - {instrument.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pitch">Pitch Adjustment: {pitch[0]} semitones</Label>
                    </div>
                    <Slider
                      id="pitch"
                      min={-12}
                      max={12}
                      step={1}
                      value={pitch}
                      onValueChange={setPitch}
                    />
                  </div>
                  
                  <Button 
                    onClick={addInstrument} 
                    className="w-full mt-4"
                  >
                    Add Instrument
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Instrument Setup</CardTitle>
                  <CardDescription>
                    Your instrument configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {instrumentPresets.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No instruments added yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {instrumentPresets.map((preset, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-muted rounded-md"
                        >
                          <div>
                            <span className="font-medium">{preset}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeInstrument(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setInstrumentPresets([])}
                    disabled={instrumentPresets.length === 0}
                  >
                    Clear Instruments
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          {/* AI Sound Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Sound Designer</CardTitle>
                  <CardDescription>
                    Describe the sound you want to create
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Sound Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the sound you want (e.g., 'A deep atmospheric pad with subtle movement and texture')"
                      value={soundDescription}
                      onChange={(e) => setSoundDescription(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleGenerateSuggestion} 
                    disabled={loading || !soundDescription.trim()}
                    className="w-full mt-4"
                  >
                    {loading ? "Generating..." : "Get Sound Design Suggestions"}
                  </Button>
                  
                  {error && (
                    <div className="rounded-md bg-destructive/15 p-4 text-destructive">
                      {error}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sound Design Suggestion</CardTitle>
                  <CardDescription>
                    AI-generated suggestions for your sound
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {aiSuggestion ? (
                    <div className="whitespace-pre-wrap bg-muted p-4 rounded-md min-h-[250px]">
                      {aiSuggestion}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-muted-foreground min-h-[250px]">
                      Enter a description and generate suggestions
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSoundDescription("");
                      setAiSuggestion(null);
                    }}
                    disabled={!aiSuggestion}
                  >
                    Clear
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}