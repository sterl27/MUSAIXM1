import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/layout/PageLayout";
import ToolsNavigation from "@/components/layout/ToolsNavigation";
import PersonaEnergyMeter from "@/components/PersonaEnergyMeter";
import { apiRequest } from "@/lib/queryClient";
import { Persona, getPersonas } from "@/lib/types";
import { Download, Save, Sparkles, Bot, FileText, Music2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SongNotebook() {
  const [lyrics, setLyrics] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [useAI, setUseAI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  
  const { toast } = useToast();
  const personas = getPersonas();

  // AI Enhancement mutation
  const { mutate: getAiSuggestion } = useMutation({
    mutationFn: async () => {
      setLoading(true);
      try {
        const response = await apiRequest(
          "POST",
          "/api/openai-enhance",
          {
            lyrics: aiPrompt || "Generate creative lyrics",
            prompt: `Generate creative lyrics based on: ${aiPrompt}`,
            temperature: 0.8,
            personaId: selectedPersona?.id || null
          }
        );
        
        const data = await response.json();
        return data.enhancedLyrics;
      } catch (error) {
        throw new Error("Failed to get AI suggestion");
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (data) => {
      setAiSuggestion(data);
      toast({
        title: "AI suggestion ready!",
        description: "Check the AI sidebar for creative inspiration.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "AI Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Save lyrics as TXT file
  const saveLyricsAsFile = () => {
    if (!lyrics.trim()) {
      toast({
        title: "No lyrics to save",
        description: "Please write some lyrics before saving.",
        variant: "destructive",
      });
      return;
    }

    const fileName = songTitle.trim() ? `${songTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt` : 'song_lyrics.txt';
    const fileContent = `${songTitle ? `Title: ${songTitle}\n\n` : ''}${lyrics}`;
    
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Lyrics saved!",
      description: `Downloaded as ${fileName}`,
    });
  };

  // Insert AI suggestion into lyrics
  const insertAiSuggestion = () => {
    if (aiSuggestion) {
      const newLyrics = lyrics ? `${lyrics}\n\n${aiSuggestion}` : aiSuggestion;
      setLyrics(newLyrics);
      toast({
        title: "AI suggestion added!",
        description: "The AI-generated content has been added to your lyrics.",
      });
    }
  };

  // Clear everything
  const clearAll = () => {
    setLyrics("");
    setSongTitle("");
    setAiPrompt("");
    setAiSuggestion(null);
  };

  return (
    <PageLayout>
      <ToolsNavigation />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold musaix-gradient-text">Song Notebook</h1>
            <p className="text-gray-400 mt-1">Write, create, and save your lyrics with AI assistance</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={clearAll} className="gap-2">
              <FileText className="h-4 w-4" />
              New Song
            </Button>
            <Button onClick={saveLyricsAsFile} className="musaix-gradient-button gap-2">
              <Download className="h-4 w-4" />
              Save Lyrics
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Writing Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Song Title */}
            <Card className="musaix-card-border bg-black/50">
              <CardContent className="p-4">
                <Label htmlFor="song-title" className="text-white font-medium">Song Title</Label>
                <Input
                  id="song-title"
                  placeholder="Enter your song title..."
                  value={songTitle}
                  onChange={(e) => setSongTitle(e.target.value)}
                  className="mt-2 bg-gray-800 border-gray-600 text-white"
                />
              </CardContent>
            </Card>

            {/* Lyrics Editor */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music2 className="h-5 w-5 text-[#FF4081]" />
                    <CardTitle className="text-white">Lyrics</CardTitle>
                  </div>
                  <div className="text-sm text-gray-400">
                    {lyrics.split('\n').length} lines • {lyrics.split(/\s+/).filter(w => w.length > 0).length} words
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Start writing your lyrics here...

Verse 1:
[Your lyrics here]

Chorus:
[Your lyrics here]

Verse 2:
[Your lyrics here]"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  className="min-h-[500px] bg-gray-900 border-gray-600 text-white text-lg leading-relaxed font-mono resize-none"
                />
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xs text-gray-500">
                    Auto-saves locally as you type
                  </div>
                  <Button variant="ghost" onClick={() => setLyrics("")} className="text-gray-400 hover:text-white">
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Energy Meter */}
            {lyrics && (
              <PersonaEnergyMeter 
                persona={selectedPersona}
                lyrics={lyrics}
                className="w-full"
                showDetails={true}
                animateOnChange={true}
              />
            )}

            {/* AI Assistant */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-[#FFC107]" />
                  <CardTitle className="text-white text-lg">AI Assistant</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Get creative suggestions and inspiration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* AI Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="use-ai" className="text-white">Enable AI</Label>
                  <Switch 
                    id="use-ai" 
                    checked={useAI} 
                    onCheckedChange={setUseAI} 
                  />
                </div>

                {useAI && (
                  <>
                    {/* Persona Selection */}
                    <div className="space-y-2">
                      <Label className="text-white">Style</Label>
                      <Select 
                        value={selectedPersona?.id || ""} 
                        onValueChange={(value) => {
                          const persona = personas.find(p => p.id === value);
                          setSelectedPersona(persona || null);
                        }}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Default</SelectItem>
                          {personas.map((persona) => (
                            <SelectItem key={persona.id} value={persona.id}>
                              {persona.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* AI Prompt */}
                    <div className="space-y-2">
                      <Label className="text-white">What do you want to write about?</Label>
                      <Textarea 
                        placeholder="Describe your idea, theme, or what you need help with..."
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="h-20 bg-gray-800 border-gray-600 text-white"
                      />
                    </div>

                    {/* Generate Button */}
                    <Button 
                      onClick={() => getAiSuggestion()} 
                      disabled={loading || !aiPrompt.trim()}
                      className="w-full musaix-gradient-button gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      {loading ? "Generating..." : "Get AI Suggestion"}
                    </Button>

                    {/* AI Suggestion */}
                    {aiSuggestion && (
                      <div className="space-y-3">
                        <Label className="text-white">AI Suggestion:</Label>
                        <div className="p-3 bg-gray-800 rounded-md border border-gray-600">
                          <p className="text-sm text-gray-300 whitespace-pre-wrap">{aiSuggestion}</p>
                        </div>
                        <Button 
                          onClick={insertAiSuggestion}
                          variant="outline" 
                          className="w-full gap-2 border-[#FF4081]/50 text-[#FF4081] hover:bg-[#FF4081]/10"
                        >
                          <Save className="h-4 w-4" />
                          Add to Lyrics
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {!useAI && (
                  <div className="text-center text-gray-400 py-8">
                    <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Enable AI to get creative suggestions</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full gap-2 text-white border-gray-600 hover:bg-gray-700"
                  onClick={() => setAiPrompt("Write a powerful rap verse about overcoming challenges")}
                >
                  💪 Motivational Verse
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 text-white border-gray-600 hover:bg-gray-700"
                  onClick={() => setAiPrompt("Create a catchy hook about success and ambition")}
                >
                  🚀 Success Hook
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full gap-2 text-white border-gray-600 hover:bg-gray-700"
                  onClick={() => setAiPrompt("Write emotional lyrics about personal growth")}
                >
                  ❤️ Personal Story
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}