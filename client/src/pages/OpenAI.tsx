import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import PageLayout from "@/components/layout/PageLayout";
import ToolsNavigation from "@/components/layout/ToolsNavigation";
import PersonaEnergyMeter from "@/components/PersonaEnergyMeter";
import { apiRequest } from "@/lib/queryClient";
import { Persona, getPersonaById, getPersonas } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OpenAI() {
  const [lyrics, setLyrics] = useState("");
  const [enhancedLyrics, setEnhancedLyrics] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("Transform these lyrics in your own style");
  const [temperature, setTemperature] = useState([0.7]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usePersona, setUsePersona] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  
  const personas = getPersonas();

  const { mutate: enhanceLyrics } = useMutation({
    mutationFn: async () => {
      setLoading(true);
      setError(null);
      
      try {
        const personaId = selectedPersona?.id || null;
        
        const response = await apiRequest(
          "POST",
          "/api/openai-enhance",
          {
            lyrics,
            prompt,
            temperature: temperature[0],
            personaId: usePersona ? personaId : null
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
      if (data && data.enhancedLyrics) {
        setEnhancedLyrics(data.enhancedLyrics);
      }
    },
    
    onError: (err: Error) => {
      setError(err.message);
    }
  });
  
  const handleEnhance = () => {
    if (!lyrics.trim()) {
      setError("Please enter some lyrics to enhance");
      return;
    }
    
    enhanceLyrics();
  };
  
  const handleClearLyrics = () => {
    setLyrics("");
    setEnhancedLyrics(null);
    setError(null);
  };
  
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLyrics(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      setError("Failed to read from clipboard. Please paste manually.");
    }
  };

  return (
    <PageLayout title="OpenAI Lyrics Enhancement" description="Use the power of AI to enhance your lyrics">
      <ToolsNavigation />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Lyrics</CardTitle>
              <CardDescription>
                Enter your lyrics to enhance with OpenAI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste your lyrics here..."
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="min-h-[200px]"
              />
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleClearLyrics}>
                Clear
              </Button>
              <Button variant="outline" onClick={handlePasteFromClipboard}>
                Paste
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>OpenAI Settings</CardTitle>
              <CardDescription>
                Customize how OpenAI enhances your lyrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* OpenAI Prompt Guidance */}
              <div className="bg-muted/50 rounded-md p-3 mb-2 text-sm">
                <h3 className="font-medium mb-1 text-foreground/80">AI Enhancement Tips:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Customize the prompt to guide AI enhancement</li>
                  <li>Choose a persona to influence the writing style</li>
                  <li>Adjust temperature for creativity vs consistency</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Label htmlFor="persona">Select Persona</Label>
                <Select 
                  value={selectedPersona?.id || "default"} 
                  onValueChange={(value) => {
                    if (value === "default") {
                      setSelectedPersona(null);
                    } else {
                      const persona = getPersonaById(value);
                      if (persona) {
                        setSelectedPersona(persona);
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a persona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    {personas.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.name} - {persona.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  The selected persona will influence the style of the enhanced lyrics
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="usePersona" className="cursor-pointer">Use Persona Style</Label>
                <Switch 
                  id="usePersona" 
                  checked={usePersona} 
                  onCheckedChange={setUsePersona} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prompt">Custom Prompt</Label>
                <Textarea 
                  id="prompt"
                  placeholder="Enter a custom instruction for OpenAI..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-20"
                />
                <p className="text-sm text-muted-foreground">
                  Custom instructions on how to enhance the lyrics
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="temperature">Temperature: {temperature[0].toFixed(1)}</Label>
                </div>
                <Slider 
                  id="temperature"
                  min={0} 
                  max={1} 
                  step={0.1} 
                  value={temperature}
                  onValueChange={setTemperature}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Creative</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleEnhance} 
                disabled={loading || !lyrics.trim()}
                className="w-full"
              >
                {loading ? "Enhancing..." : "Enhance with OpenAI"}
              </Button>
            </CardFooter>
          </Card>
          {/* Energy Meter */}
          {lyrics && (
            <PersonaEnergyMeter 
              persona={usePersona ? selectedPersona : null}
              lyrics={lyrics}
              className="w-full"
              showDetails={true}
              animateOnChange={true}
            />
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          {/* Energy Meter for Enhanced Lyrics */}
          {enhancedLyrics && (
            <PersonaEnergyMeter 
              persona={usePersona ? selectedPersona : null}
              lyrics={enhancedLyrics}
              className="w-full"
              showDetails={true}
              animateOnChange={true}
            />
          )}
          
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Enhanced Lyrics</CardTitle>
              <CardDescription>
                {enhancedLyrics ? "Your enhanced lyrics are ready" : "Enhanced lyrics will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="rounded-md bg-destructive/15 p-4 text-destructive">
                  {error}
                </div>
              ) : enhancedLyrics ? (
                <div className="whitespace-pre-wrap bg-muted p-4 rounded-md min-h-[400px]">
                  {enhancedLyrics}
                </div>
              ) : (
                <div className="flex items-center justify-center text-muted-foreground min-h-[400px]">
                  Enter lyrics and click "Enhance" to see results
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}