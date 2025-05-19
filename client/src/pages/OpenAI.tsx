import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
  const [useAI, setUseAI] = useState(true);

  // Selected persona will be used as context for the AI
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(
    getPersonaById("outkast") || null
  );

  const enhanceMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/openai/enhance", {
        lyrics,
        prompt,
        temperature: temperature[0],
        personaId: selectedPersona?.id || null,
        useAI
      });
      return res.json() as Promise<{ enhancedLyrics: string }>;
    },
    onSuccess: (data) => {
      setEnhancedLyrics(data.enhancedLyrics);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || "Failed to enhance lyrics with OpenAI");
      console.error("Error enhancing lyrics with OpenAI:", err);
    }
  });

  const handleEnhance = () => {
    if (!lyrics.trim()) {
      setError("Please enter some lyrics to enhance");
      return;
    }
    
    setLoading(true);
    enhanceMutation.mutate();
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
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">OpenAI Lyrics Enhancement</h1>
        
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
                  placeholder="Type or paste your lyrics here..."
                  className="min-h-[200px]"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
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
                <div className="space-y-2">
                  <Label htmlFor="prompt">Custom Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Enter instructions for OpenAI..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature">Temperature: {temperature[0].toFixed(1)}</Label>
                  </div>
                  <Slider
                    id="temperature"
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    value={temperature}
                    onValueChange={setTemperature}
                  />
                  <p className="text-sm text-muted-foreground">
                    Lower values make output more deterministic, higher values more creative
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="useAI" 
                    checked={useAI} 
                    onCheckedChange={setUseAI} 
                  />
                  <Label htmlFor="useAI">Use OpenAI API</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  {useAI 
                    ? "Using OpenAI's API (requires API key)" 
                    : "Using built-in enhancement logic"}
                </p>
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
          </div>

          {/* Output Section */}
          <div>
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
      </main>

      <Footer />
    </div>
  );
}