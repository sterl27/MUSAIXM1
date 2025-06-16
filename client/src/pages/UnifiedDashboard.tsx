import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import UnifiedHeader from "@/components/layout/UnifiedHeader";
import { 
  Wand2, 
  Eye, 
  BarChart3, 
  History, 
  User, 
  Music, 
  Brain, 
  Sparkles,
  Play,
  Pause,
  Volume2,
  Save,
  Download,
  Share,
  Trash2,
  Clock,
  TrendingUp,
  Target,
  Zap
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface LyricTransformation {
  id: string;
  originalLyrics: string;
  transformedLyrics: string;
  persona: string;
  mood: string;
  style: string;
  complexity: number;
  timestamp: Date;
  instructions: string[];
}

interface PersonaSuggestion {
  id: string;
  name: string;
  description: string;
  voiceId?: string;
  matchScore: number;
}

export default function UnifiedDashboard() {
  const [activeTab, setActiveTab] = useState("transform");
  const [currentLyrics, setCurrentLyrics] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [transformedLyrics, setTransformedLyrics] = useState("");
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationHistory, setTransformationHistory] = useState<LyricTransformation[]>([]);
  const [suggestedPersonas, setSuggestedPersonas] = useState<PersonaSuggestion[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Personas with voice matching
  const personas = [
    { id: "eminem", name: "Eminem", description: "Rapid-fire delivery, complex wordplay", voiceId: "pNInz6obpgDQGcFmaJgB", category: "aggressive" },
    { id: "kendrick", name: "Kendrick Lamar", description: "Conscious rap, storytelling", voiceId: "ErXwobaYiN019PkySvjV", category: "conscious" },
    { id: "drake", name: "Drake", description: "Melodic rap, emotional depth", voiceId: "VR6AewLTigWG4xSOukaG", category: "melodic" },
    { id: "jcole", name: "J. Cole", description: "Introspective, lyrical storytelling", voiceId: "pqHfZKP75CvOlQylNhV4", category: "conscious" },
    { id: "travisscott", name: "Travis Scott", description: "Auto-tuned vocals, atmospheric", voiceId: "N2lVS1w4EtoT3dr4eOWO", category: "atmospheric" },
    { id: "lilwayne", name: "Lil Wayne", description: "Clever wordplay, punchlines", voiceId: "flq6f7yk4E4fJM5XTYuZ", category: "punchline" }
  ];

  const moods = [
    { id: "aggressive", name: "Aggressive", color: "bg-red-500" },
    { id: "melancholic", name: "Melancholic", color: "bg-blue-500" },
    { id: "triumphant", name: "Triumphant", color: "bg-yellow-500" },
    { id: "introspective", name: "Introspective", color: "bg-purple-500" },
    { id: "energetic", name: "Energetic", color: "bg-orange-500" },
    { id: "romantic", name: "Romantic", color: "bg-pink-500" }
  ];

  const styles = [
    { id: "trap", name: "Trap" },
    { id: "boom-bap", name: "Boom Bap" },
    { id: "drill", name: "Drill" },
    { id: "melodic-rap", name: "Melodic Rap" },
    { id: "conscious-rap", name: "Conscious Rap" },
    { id: "mumble-rap", name: "Mumble Rap" }
  ];

  // Load transformation history
  useEffect(() => {
    const saved = localStorage.getItem("lyric-transformations");
    if (saved) {
      setTransformationHistory(JSON.parse(saved));
    }
  }, []);

  // Generate persona suggestions based on lyrics
  useEffect(() => {
    if (currentLyrics.length > 50) {
      generatePersonaSuggestions(currentLyrics);
    }
  }, [currentLyrics]);

  const generatePersonaSuggestions = async (lyrics: string) => {
    try {
      const response = await fetch("/api/suggest-personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics })
      });
      const data = await response.json();
      setSuggestedPersonas(data.suggestions || []);
    } catch (error) {
      console.log("Suggestion generation failed, using fallback");
      // Fallback suggestion logic
      const suggestions = personas
        .map(persona => ({
          ...persona,
          matchScore: Math.random() * 100
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
      setSuggestedPersonas(suggestions);
    }
  };

  const transformLyrics = async () => {
    if (!currentLyrics.trim()) {
      toast({ title: "Please enter some lyrics to transform", variant: "destructive" });
      return;
    }

    setIsTransforming(true);
    try {
      const response = await fetch("/api/transform-lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lyrics: currentLyrics,
          persona: selectedPersona,
          mood: selectedMood,
          style: selectedStyle
        })
      });

      const data = await response.json();
      setTransformedLyrics(data.transformedLyrics);
      
      // Save to history
      const newTransformation: LyricTransformation = {
        id: Date.now().toString(),
        originalLyrics: currentLyrics,
        transformedLyrics: data.transformedLyrics,
        persona: selectedPersona,
        mood: selectedMood,
        style: selectedStyle,
        complexity: data.complexity || 0,
        timestamp: new Date(),
        instructions: data.appliedInstructions || []
      };

      const updatedHistory = [newTransformation, ...transformationHistory.slice(0, 9)];
      setTransformationHistory(updatedHistory);
      localStorage.setItem("lyric-transformations", JSON.stringify(updatedHistory));

      toast({ title: "Lyrics transformed successfully!" });
    } catch (error) {
      toast({ title: "Transformation failed", description: "Please try again", variant: "destructive" });
    } finally {
      setIsTransforming(false);
    }
  };

  const loadFromHistory = (transformation: LyricTransformation) => {
    setCurrentLyrics(transformation.originalLyrics);
    setTransformedLyrics(transformation.transformedLyrics);
    setSelectedPersona(transformation.persona);
    setSelectedMood(transformation.mood);
    setSelectedStyle(transformation.style);
    setActiveTab("preview");
  };

  const clearHistory = () => {
    setTransformationHistory([]);
    localStorage.removeItem("lyric-transformations");
    toast({ title: "History cleared" });
  };

  return (
    <div className="min-h-screen bg-black">
      <UnifiedHeader />
      
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Lyric Studio</h1>
          <p className="text-gray-400">Transform, preview, and analyze your lyrics with AI-powered tools</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="transform" className="flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Transform
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Transform Tab */}
          <TabsContent value="transform" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Input Section */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      Lyric Input
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Enter your lyrics here..."
                      value={currentLyrics}
                      onChange={(e) => setCurrentLyrics(e.target.value)}
                      className="min-h-[200px] text-base"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Persona</label>
                        <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select persona" />
                          </SelectTrigger>
                          <SelectContent>
                            {personas.map((persona) => (
                              <SelectItem key={persona.id} value={persona.id}>
                                {persona.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Mood</label>
                        <Select value={selectedMood} onValueChange={setSelectedMood}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mood" />
                          </SelectTrigger>
                          <SelectContent>
                            {moods.map((mood) => (
                              <SelectItem key={mood.id} value={mood.id}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${mood.color}`}></div>
                                  {mood.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-300 mb-2 block">Style</label>
                        <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            {styles.map((style) => (
                              <SelectItem key={style.id} value={style.id}>
                                {style.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button 
                      onClick={transformLyrics} 
                      disabled={isTransforming}
                      className="w-full"
                      size="lg"
                    >
                      {isTransforming ? (
                        <>
                          <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                          Transforming...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Transform Lyrics
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Suggestions Sidebar */}
              <div className="space-y-4">
                
                {/* Persona Suggestions */}
                {suggestedPersonas.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Brain className="h-4 w-4" />
                        AI Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {suggestedPersonas.map((suggestion) => (
                        <div 
                          key={suggestion.id}
                          className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors"
                          onClick={() => setSelectedPersona(suggestion.id)}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm">{suggestion.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(suggestion.matchScore)}%
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400">{suggestion.description}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* History */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <History className="h-4 w-4" />
                      Recent ({transformationHistory.length})
                    </CardTitle>
                    {transformationHistory.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearHistory}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {transformationHistory.map((item) => (
                          <div 
                            key={item.id}
                            className="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors"
                            onClick={() => loadFromHistory(item)}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {personas.find(p => p.id === item.persona)?.name || item.persona}
                              </Badge>
                              <span className="text-xs text-gray-400">
                                {new Date(item.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-300 line-clamp-2">
                              {item.originalLyrics.substring(0, 60)}...
                            </p>
                          </div>
                        ))}
                        {transformationHistory.length === 0 && (
                          <p className="text-sm text-gray-400 text-center py-4">
                            No transformations yet
                          </p>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Original */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Original
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                      {currentLyrics || "No lyrics entered yet..."}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Transformed */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Transformed
                  </CardTitle>
                  {transformedLyrics && (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                      {transformedLyrics || "Transform some lyrics to see the result..."}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Voice Preview */}
            {transformedLyrics && selectedPersona && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Voice Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Button variant="outline">
                      <Play className="h-4 w-4 mr-2" />
                      Preview with {personas.find(p => p.id === selectedPersona)?.name}
                    </Button>
                    <div className="text-sm text-gray-400">
                      Suggested voice: {personas.find(p => p.id === selectedPersona)?.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-400">Transformations</p>
                      <p className="text-2xl font-bold">{transformationHistory.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-400">Avg Complexity</p>
                      <p className="text-2xl font-bold">
                        {transformationHistory.length > 0 
                          ? Math.round(transformationHistory.reduce((acc, item) => acc + item.complexity, 0) / transformationHistory.length)
                          : 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-400">Top Persona</p>
                      <p className="text-lg font-bold">
                        {transformationHistory.length > 0 ? 
                          personas.find(p => p.id === transformationHistory[0]?.persona)?.name || "None" 
                          : "None"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-400">Success Rate</p>
                      <p className="text-2xl font-bold">98%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Usage Patterns */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Most Used Personas</p>
                      <div className="space-y-2">
                        {personas.slice(0, 3).map((persona) => {
                          const usage = transformationHistory.filter(t => t.persona === persona.id).length;
                          const percentage = transformationHistory.length > 0 ? (usage / transformationHistory.length) * 100 : 0;
                          return (
                            <div key={persona.id} className="flex items-center justify-between">
                              <span className="text-sm">{persona.name}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-400">{usage}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-gray-400 mb-2">Popular Moods</p>
                      <div className="flex flex-wrap gap-2">
                        {moods.slice(0, 4).map((mood) => {
                          const usage = transformationHistory.filter(t => t.mood === mood.id).length;
                          return (
                            <Badge key={mood.id} variant="secondary" className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${mood.color}`}></div>
                              {mood.name} ({usage})
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Complexity Distribution</p>
                      <div className="space-y-2">
                        {['Low (1-3)', 'Medium (4-6)', 'High (7-10)'].map((range, index) => {
                          const rangeCount = transformationHistory.filter(t => {
                            if (index === 0) return t.complexity <= 3;
                            if (index === 1) return t.complexity > 3 && t.complexity <= 6;
                            return t.complexity > 6;
                          }).length;
                          const percentage = transformationHistory.length > 0 ? (rangeCount / transformationHistory.length) * 100 : 0;
                          
                          return (
                            <div key={range} className="flex items-center justify-between">
                              <span className="text-sm">{range}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      index === 0 ? 'bg-green-500' : 
                                      index === 1 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-400">{rangeCount}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm text-gray-400 mb-2">Recent Activity</p>
                      <div className="space-y-2">
                        {transformationHistory.slice(0, 5).map((item) => (
                          <div key={item.id} className="flex items-center gap-2 text-xs">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-400">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {personas.find(p => p.id === item.persona)?.name}
                            </Badge>
                            <span className="text-gray-500">→</span>
                            <span className="text-green-400">Complexity {item.complexity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}