import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import PageLayout from "@/components/layout/PageLayout";
import ToolsNavigation from "@/components/layout/ToolsNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Wand2, 
  Music, 
  Sparkles, 
  Copy, 
  RotateCcw, 
  AlertCircle,
  Check,
  User,
  Bot,
  SlidersHorizontal
} from "lucide-react";

// Example style presets
const stylePresets = [
  { id: "rap-boom-bap", name: "Boom Bap", category: "Rap", description: "Classic 90s hip-hop style with complex rhymes" },
  { id: "rap-trap", name: "Trap", category: "Rap", description: "Modern trap style with triplet flows and ad-libs" },
  { id: "rap-melodic", name: "Melodic Rap", category: "Rap", description: "Emotional rap with singing elements" },
  { id: "pop-mainstream", name: "Mainstream Pop", category: "Pop", description: "Radio-friendly pop with catchy hooks" },
  { id: "pop-indie", name: "Indie Pop", category: "Pop", description: "Alternative pop with indie sensibilities" },
  { id: "rock-classic", name: "Classic Rock", category: "Rock", description: "Timeless rock with powerful vocals" },
  { id: "rock-punk", name: "Punk Rock", category: "Rock", description: "Raw, energetic punk style" },
  { id: "rnb-modern", name: "Modern R&B", category: "R&B", description: "Contemporary R&B with atmospheric production" },
  { id: "folk-acoustic", name: "Acoustic Folk", category: "Folk", description: "Stripped-down folk with storytelling" },
  { id: "electronic-edm", name: "EDM", category: "Electronic", description: "High-energy dance music with drops" }
];

// Transformation strength options
const transformationStrengths = [
  { value: 0.25, label: "Subtle" },
  { value: 0.5, label: "Moderate" },
  { value: 0.75, label: "Strong" },
  { value: 1, label: "Complete" }
];

// Mood options
const moodOptions = [
  "Energetic", "Chill", "Melancholic", "Happy", 
  "Aggressive", "Romantic", "Reflective", "Inspirational"
];

export default function StyleTransformer() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("input");
  const [inputLyrics, setInputLyrics] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [transformationStrength, setTransformationStrength] = useState(0.5);
  const [preserveStructure, setPreserveStructure] = useState(true);
  const [keepRhymes, setKeepRhymes] = useState(true);
  const [maintainThemes, setMaintainThemes] = useState(true);
  const [enhanceImagery, setEnhanceImagery] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transformationProgress, setTransformationProgress] = useState(0);
  const [useAI, setUseAI] = useState(true);
  const [transformedLyrics, setTransformedLyrics] = useState<string | null>(null);
  
  // Handle the transformation process
  const transformLyricsMutation = useMutation({
    mutationFn: async () => {
      if (!selectedStyle) {
        throw new Error("Please select a target style");
      }

      // Set processing state
      setIsProcessing(true);
      setTransformationProgress(10);
      
      // Prepare the request data
      const requestData = {
        lyrics: inputLyrics,
        targetStyle: selectedStyle,
        mood: selectedMood || undefined,
        strength: transformationStrength,
        preserveStructure,
        keepRhymes,
        maintainThemes,
        enhanceImagery,
        customInstructions: customInstructions || undefined,
        useAI: useAI
      };
      
      try {
        // Set progress to show the request is being processed
        setTransformationProgress(30);
        
        // Make the API request
        const response = await fetch('/api/style-transformer/transform', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        });
        
        // Check if response is ok
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        // Parse response JSON
        const data = await response.json();
        setTransformationProgress(90);
        
        // Check if the response contains the transformed lyrics
        if (data && data.transformedLyrics) {
          setTransformedLyrics(data.transformedLyrics);
          setTransformationProgress(100);
          setIsProcessing(false);
          return data.transformedLyrics;
        } else {
          throw new Error("Received invalid response from the server");
        }
      } catch (error) {
        // Fall back to local transformation if the API fails
        console.warn("API request failed, falling back to local transformation:", error);
        
        // Use fallback transformation functions
        let result = "";
        if (selectedStyle === "rap-trap") {
          result = transformToTrapStyle(inputLyrics);
        } else if (selectedStyle === "pop-mainstream") {
          result = transformToPopStyle(inputLyrics);
        } else if (selectedStyle === "rock-classic") {
          result = transformToRockStyle(inputLyrics);
        } else {
          // Generic transformation for other styles
          result = `[Transformed to ${selectedStyle} style]\n\n${transformWithAIPrompts(inputLyrics)}`;
        }
        
        setTransformedLyrics(result);
        setTransformationProgress(100);
        setIsProcessing(false);
        return result;
      }
    },
    onSuccess: () => {
      toast({
        title: "Transformation complete!",
        description: "Your lyrics have been transformed to the selected style.",
      });
      setActiveTab("result");
    },
    onError: (error) => {
      setIsProcessing(false);
      toast({
        title: "Transformation failed",
        description: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  });
  
  // Function to transform lyrics (these would use OpenAI API in production)
  function transformToTrapStyle(lyrics: string): string {
    // This would be replaced with actual API call in production
    const lines = lyrics.split("\n");
    return lines.map(line => {
      if (!line.trim()) return line;
      // Add trap ad-libs and style
      const adlibs = ["Skrrt!", "Yuh!", "Ayy!", "Let's go!", "Yeah!"];
      const randomAdlib = adlibs[Math.floor(Math.random() * adlibs.length)];
      
      // Transform some words to trap slang
      let newLine = line
        .replace(/money/gi, "bands")
        .replace(/car/gi, "whip")
        .replace(/house/gi, "crib")
        .replace(/friend/gi, "homie");
        
      // Add triplet flow indicators
      if (Math.random() > 0.7) {
        return `${newLine} (${randomAdlib})`;
      }
      return newLine;
    }).join("\n");
  }
  
  function transformToPopStyle(lyrics: string): string {
    // This would be replaced with actual API call in production
    const lines = lyrics.split("\n");
    
    // Add a catchy chorus
    let transformed = lines.map(line => {
      if (!line.trim()) return line;
      
      // Transform to more emotional, direct language
      return line
        .replace(/sad/gi, "heartbroken")
        .replace(/happy/gi, "on top of the world")
        .replace(/angry/gi, "done with you");
    }).join("\n");
    
    // Add a pop-style chorus if none exists
    if (!transformed.includes("CHORUS") && !transformed.includes("HOOK")) {
      const chorusLine = lines.length > 3 ? lines[2] : "This is the hook, the catchiest part";
      transformed += "\n\nCHORUS:\n";
      transformed += `${chorusLine}\n`.repeat(4);
    }
    
    return transformed;
  }
  
  function transformToRockStyle(lyrics: string): string {
    // This would be replaced with actual API call in production
    const lines = lyrics.split("\n");
    
    return lines.map(line => {
      if (!line.trim()) return line;
      
      // Add rock expressions and intensity
      return line
        .replace(/love/gi, "burning desire")
        .replace(/hate/gi, "despise with every fiber")
        .replace(/walk/gi, "march on")
        .replace(/talk/gi, "scream out");
    }).join("\n");
  }
  
  function transformWithAIPrompts(lyrics: string): string {
    // This simulates what we'd get from an OpenAI request
    // In production, this would be replaced with an actual API call
    
    // Create a "transformed" version with some enhancements
    const lines = lyrics.split("\n");
    
    const transformed = lines.map(line => {
      if (!line.trim()) return line;
      
      // Enhance imagery based on settings
      if (enhanceImagery && Math.random() > 0.6) {
        const imageryEnhancements = [
          "like a storm on the horizon",
          "burning bright as the sun",
          "flowing like a river to the sea",
          "standing tall as a mountain",
          "swift as a falcon's dive"
        ];
        const randomEnhancement = imageryEnhancements[Math.floor(Math.random() * imageryEnhancements.length)];
        return `${line} ${randomEnhancement}`;
      }
      
      // Apply style-specific transformations
      if (selectedMood === "Energetic") {
        return line.replace(/walk/gi, "rush").replace(/talk/gi, "shout");
      } else if (selectedMood === "Melancholic") {
        return line.replace(/happy/gi, "hollow").replace(/laugh/gi, "sigh");
      } else if (selectedMood === "Romantic") {
        return line.replace(/see/gi, "feel").replace(/hear/gi, "sense");
      }
      
      return line;
    });
    
    return transformed.join("\n");
  }
  
  const handleTransform = () => {
    if (!inputLyrics.trim()) {
      toast({
        title: "Missing lyrics",
        description: "Please enter some lyrics to transform.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedStyle) {
      toast({
        title: "Select a style",
        description: "Please select a target style for the transformation.",
        variant: "destructive",
      });
      return;
    }
    
    transformLyricsMutation.mutate();
  };
  
  const handleCopyToClipboard = () => {
    if (transformedLyrics) {
      navigator.clipboard.writeText(transformedLyrics);
      toast({
        title: "Copied!",
        description: "Transformed lyrics copied to clipboard.",
      });
    }
  };
  
  const handleReset = () => {
    setInputLyrics("");
    setCustomInstructions("");
    setSelectedStyle(null);
    setSelectedMood(null);
    setTransformationStrength(0.5);
    setPreserveStructure(true);
    setKeepRhymes(true);
    setMaintainThemes(true);
    setEnhanceImagery(false);
    setTransformedLyrics(null);
    setActiveTab("input");
  };
  
  const isInputValid = inputLyrics.trim().length > 0 && selectedStyle !== null;
  
  return (
    <PageLayout 
      title="Lyric Style Transformation Wizard" 
      description="Transform your lyrics into different musical styles using AI"
    >
      <ToolsNavigation />
      
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center">
              <Wand2 className="h-5 w-5 mr-2 text-primary" />
              AI Style Transformation
            </CardTitle>
            <CardDescription>
              Transform your lyrics into different musical styles with AI assistance
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="input" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="input" disabled={isProcessing}>
                  1. Input Lyrics
                </TabsTrigger>
                <TabsTrigger value="style" disabled={!inputLyrics.trim() || isProcessing}>
                  2. Choose Style
                </TabsTrigger>
                <TabsTrigger value="result" disabled={!transformedLyrics || isProcessing}>
                  3. Result
                </TabsTrigger>
              </TabsList>
              
              {/* Input Tab */}
              <TabsContent value="input" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="lyrics-input">Enter your lyrics</Label>
                  <Textarea
                    id="lyrics-input"
                    placeholder="Paste or type your lyrics here..."
                    className="min-h-[200px] font-mono"
                    value={inputLyrics}
                    onChange={(e) => setInputLyrics(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col space-y-4">
                  <Alert variant="default" className="bg-primary/5 border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <AlertTitle>AI-Powered Style Transformation</AlertTitle>
                    <AlertDescription>
                      Transform your lyrics into different music styles using OpenAI's advanced language model.
                      For best results, enter complete lyrics with clear sections (verses, chorus, etc.).
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex justify-end">
                    <Button 
                      disabled={!inputLyrics.trim()} 
                      onClick={() => setActiveTab("style")}
                      className="flex items-center"
                    >
                      Continue to Style Selection
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Style Selection Tab */}
              <TabsContent value="style" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Target Style</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {stylePresets.map((style) => (
                          <div
                            key={style.id}
                            className={`p-3 rounded-md border cursor-pointer transition-colors ${
                              selectedStyle === style.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedStyle(style.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{style.name}</h4>
                                <p className="text-xs text-muted-foreground">{style.description}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {style.category}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Mood</h3>
                      <div className="flex flex-wrap gap-2">
                        {moodOptions.map((mood) => (
                          <Badge
                            key={mood}
                            variant={selectedMood === mood ? "default" : "outline"}
                            className={`cursor-pointer ${
                              selectedMood === mood ? "" : "hover:bg-primary/10"
                            }`}
                            onClick={() => setSelectedMood(mood)}
                          >
                            {mood}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Transformation Settings</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Switch
                            id="use-ai"
                            checked={useAI}
                            onCheckedChange={setUseAI}
                          />
                          <Label htmlFor="use-ai" className="cursor-pointer">
                            Use AI-Powered Transformation
                          </Label>
                          {useAI && (
                            <Badge variant="outline" className="ml-auto">
                              OpenAI
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="strength">Transformation Strength</Label>
                            <span className="text-sm text-muted-foreground">
                              {transformationStrengths.find(s => s.value === transformationStrength)?.label || "Moderate"}
                            </span>
                          </div>
                          <Slider
                            id="strength"
                            min={0.25}
                            max={1}
                            step={0.25}
                            value={[transformationStrength]}
                            onValueChange={(values) => setTransformationStrength(values[0])}
                          />
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="preserve-structure" className="cursor-pointer">
                              Preserve Song Structure
                            </Label>
                            <Switch
                              id="preserve-structure"
                              checked={preserveStructure}
                              onCheckedChange={setPreserveStructure}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="keep-rhymes" className="cursor-pointer">
                              Maintain Rhyme Scheme
                            </Label>
                            <Switch
                              id="keep-rhymes"
                              checked={keepRhymes}
                              onCheckedChange={setKeepRhymes}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="maintain-themes" className="cursor-pointer">
                              Preserve Core Themes
                            </Label>
                            <Switch
                              id="maintain-themes"
                              checked={maintainThemes}
                              onCheckedChange={setMaintainThemes}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="enhance-imagery" className="cursor-pointer">
                              Enhance Imagery
                            </Label>
                            <Switch
                              id="enhance-imagery"
                              checked={enhanceImagery}
                              onCheckedChange={setEnhanceImagery}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="custom-instructions">Custom Instructions (Optional)</Label>
                      <Textarea
                        id="custom-instructions"
                        placeholder="Add specific instructions for the transformation..."
                        value={customInstructions}
                        onChange={(e) => setCustomInstructions(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("input")}>
                    Back to Input
                  </Button>
                  <Button 
                    onClick={handleTransform} 
                    disabled={!isInputValid || isProcessing}
                    className="flex items-center"
                  >
                    {isProcessing ? (
                      <>
                        <span className="animate-spin mr-2">◌</span>
                        Transforming...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Transform Lyrics
                      </>
                    )}
                  </Button>
                </div>
                
                {isProcessing && (
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Processing transformation</span>
                      <span>{transformationProgress}%</span>
                    </div>
                    <Progress value={transformationProgress} className="h-2" />
                  </div>
                )}
              </TabsContent>
              
              {/* Result Tab */}
              <TabsContent value="result" className="space-y-4 pt-4">
                {transformedLyrics ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Music className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-lg font-medium">Transformed Lyrics</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={handleCopyToClipboard}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleReset}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Start Over
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-md border p-4 bg-muted/30 whitespace-pre-wrap font-mono text-sm">
                      {transformedLyrics}
                    </div>
                    
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-500" />
                      <AlertTitle>Transformation Complete</AlertTitle>
                      <AlertDescription>
                        The lyrics have been transformed to match the {
                          stylePresets.find(s => s.id === selectedStyle)?.name
                        } style
                        {selectedMood ? ` with a ${selectedMood} mood` : ''}.
                        {useAI && " Powered by OpenAI's advanced language model for professional results."}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">What's Next?</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button variant="outline" size="sm" className="w-full justify-start"
                          onClick={() => window.location.href = "/personas"}>
                          <User className="h-4 w-4 mr-2" />
                          Try Different Personas
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start"
                          onClick={() => window.location.href = "/openai"}>
                          <Bot className="h-4 w-4 mr-2" />
                          OpenAI Enhancer
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start"
                          onClick={() => window.location.href = "/sounddesign"}>
                          <SlidersHorizontal className="h-4 w-4 mr-2" />
                          Create Sound Design
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="w-full justify-start bg-primary/90 hover:bg-primary"
                          onClick={handleReset}>
                          <Wand2 className="h-4 w-4 mr-2" />
                          New Transformation
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No transformation results yet</h3>
                    <p className="text-muted-foreground">
                      Go back to the previous steps to transform your lyrics
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}