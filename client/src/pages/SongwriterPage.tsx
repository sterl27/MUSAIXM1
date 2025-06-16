import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import UnifiedHeader from "@/components/layout/UnifiedHeader";
import PersonaSelector from "@/components/PersonaSelector";
import { 
  PenTool, 
  Play, 
  Pause, 
  Volume2, 
  Wand2, 
  Save, 
  Download, 
  Share,
  RefreshCw,
  Mic,
  Music,
  Zap,
  Target,
  Brain,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LyricProject {
  id: string;
  title: string;
  lyrics: string;
  persona: string;
  style: string;
  mood: string;
  lastModified: Date;
  complexity: number;
}

interface StyleControls {
  rhymeComplexity: number;
  flowSpeed: number;
  wordplayDensity: number;
  emotionalIntensity: number;
  narrativeStructure: number;
}

export default function SongwriterPage() {
  const [currentLyrics, setCurrentLyrics] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("");
  const [currentProject, setCurrentProject] = useState<LyricProject | null>(null);
  const [projects, setProjects] = useState<LyricProject[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("compose");
  
  const [styleControls, setStyleControls] = useState<StyleControls>({
    rhymeComplexity: 70,
    flowSpeed: 60,
    wordplayDensity: 50,
    emotionalIntensity: 80,
    narrativeStructure: 40
  });

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [voicePreview, setVoicePreview] = useState<string | null>(null);

  const { toast } = useToast();

  // Load projects from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("songwriter-projects");
    if (saved) {
      const parsedProjects = JSON.parse(saved);
      setProjects(parsedProjects);
      if (parsedProjects.length > 0) {
        setCurrentProject(parsedProjects[0]);
        setCurrentLyrics(parsedProjects[0].lyrics);
        setSelectedPersona(parsedProjects[0].persona);
      }
    }
  }, []);

  const saveProject = (project: LyricProject) => {
    const updatedProjects = [project, ...projects.filter(p => p.id !== project.id)];
    setProjects(updatedProjects);
    localStorage.setItem("songwriter-projects", JSON.stringify(updatedProjects));
    setCurrentProject(project);
    toast({ title: "Project saved successfully" });
  };

  const createNewProject = () => {
    const newProject: LyricProject = {
      id: Date.now().toString(),
      title: `Untitled Song ${projects.length + 1}`,
      lyrics: "",
      persona: selectedPersona,
      style: "trap",
      mood: "energetic",
      lastModified: new Date(),
      complexity: 0
    };
    
    setCurrentProject(newProject);
    setCurrentLyrics("");
    saveProject(newProject);
  };

  const generateLyrics = async () => {
    if (!selectedPersona) {
      toast({ title: "Please select a persona first", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/songwriter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona: selectedPersona,
          topic: "struggle and success",
          mood: "energetic",
          style: "trap",
          sections: ["verse", "chorus"],
          rhymeComplexity: styleControls.rhymeComplexity,
          flowSpeed: styleControls.flowSpeed,
          wordplayDensity: styleControls.wordplayDensity
        })
      });

      const data = await response.json();
      setCurrentLyrics(data.lyrics || "Generated lyrics would appear here...");
      
      if (currentProject) {
        const updatedProject = {
          ...currentProject,
          lyrics: data.lyrics || currentLyrics,
          lastModified: new Date(),
          complexity: data.complexity || Math.floor(Math.random() * 10)
        };
        saveProject(updatedProject);
      }

      toast({ title: "Lyrics generated successfully!" });
    } catch (error) {
      toast({ title: "Generation failed", description: "Please try again", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const enhanceLyrics = async () => {
    if (!currentLyrics.trim()) {
      toast({ title: "Please enter some lyrics to enhance", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/transform-lyrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lyrics: currentLyrics,
          persona: selectedPersona,
          mood: "energetic",
          style: "trap"
        })
      });

      const data = await response.json();
      setCurrentLyrics(data.transformedLyrics);

      if (currentProject) {
        const updatedProject = {
          ...currentProject,
          lyrics: data.transformedLyrics,
          lastModified: new Date(),
          complexity: data.complexity || currentProject.complexity
        };
        saveProject(updatedProject);
      }

      toast({ title: "Lyrics enhanced successfully!" });
    } catch (error) {
      toast({ title: "Enhancement failed", description: "Please try again", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSuggestions = () => {
    const suggestionBank = [
      "Add more internal rhymes in the second verse",
      "Consider a bridge section for emotional contrast",
      "Try metaphors related to climbing or rising",
      "Experiment with alliteration in the hook",
      "Add a call-and-response element",
      "Consider switching the flow pattern in verse 2",
      "Try incorporating more imagery about the journey",
      "Add emphasis words for better rhythm"
    ];
    
    setSuggestions(suggestionBank.slice(0, 3 + Math.floor(Math.random() * 3)));
  };

  const previewVoice = () => {
    setIsPreviewPlaying(!isPreviewPlaying);
    // In a real implementation, this would trigger ElevenLabs voice synthesis
    toast({ 
      title: isPreviewPlaying ? "Voice preview stopped" : "Voice preview started",
      description: `Playing with ${selectedPersona} voice style`
    });
    
    // Simulate preview duration
    if (!isPreviewPlaying) {
      setTimeout(() => setIsPreviewPlaying(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <UnifiedHeader />
      
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Songwriter Studio</h1>
          <p className="text-gray-400">Create, enhance, and preview your lyrics with AI-powered tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Composition Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Project Header */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    {currentProject?.title || "New Project"}
                  </CardTitle>
                  {currentProject && (
                    <p className="text-sm text-gray-400">
                      Last modified: {new Date(currentProject.lastModified).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={createNewProject}>
                    New Project
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => currentProject && saveProject(currentProject)}>
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="compose">Compose</TabsTrigger>
                <TabsTrigger value="enhance">Enhance</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              {/* Compose Tab */}
              <TabsContent value="compose" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Lyric Workspace</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateLyrics}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 mr-2" />
                              Generate
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={generateSuggestions}>
                          <Brain className="h-4 w-4 mr-2" />
                          Suggest
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Start writing your lyrics here..."
                      value={currentLyrics}
                      onChange={(e) => setCurrentLyrics(e.target.value)}
                      className="min-h-[300px] text-base font-mono leading-relaxed"
                    />
                    
                    {/* Live Stats */}
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                      <span>Lines: {currentLyrics.split('\n').filter(line => line.trim()).length}</span>
                      <span>Words: {currentLyrics.split(' ').filter(word => word.trim()).length}</span>
                      <span>Characters: {currentLyrics.length}</span>
                      {currentProject?.complexity && (
                        <Badge variant="secondary">
                          Complexity: {currentProject.complexity}/10
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Suggestions Panel */}
                {suggestions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">AI Suggestions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <div key={index} className="p-3 bg-gray-800 rounded-lg text-sm">
                            <Target className="h-3 w-3 inline mr-2 text-blue-400" />
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Enhance Tab */}
              <TabsContent value="enhance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      Style Controls
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Rhyme Complexity ({styleControls.rhymeComplexity}%)
                        </label>
                        <Slider
                          value={[styleControls.rhymeComplexity]}
                          onValueChange={([value]) => setStyleControls(prev => ({ ...prev, rhymeComplexity: value }))}
                          min={0}
                          max={100}
                          step={5}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Flow Speed ({styleControls.flowSpeed}%)
                        </label>
                        <Slider
                          value={[styleControls.flowSpeed]}
                          onValueChange={([value]) => setStyleControls(prev => ({ ...prev, flowSpeed: value }))}
                          min={0}
                          max={100}
                          step={5}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Wordplay Density ({styleControls.wordplayDensity}%)
                        </label>
                        <Slider
                          value={[styleControls.wordplayDensity]}
                          onValueChange={([value]) => setStyleControls(prev => ({ ...prev, wordplayDensity: value }))}
                          min={0}
                          max={100}
                          step={5}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Emotional Intensity ({styleControls.emotionalIntensity}%)
                        </label>
                        <Slider
                          value={[styleControls.emotionalIntensity]}
                          onValueChange={([value]) => setStyleControls(prev => ({ ...prev, emotionalIntensity: value }))}
                          min={0}
                          max={100}
                          step={5}
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={enhanceLyrics}
                      disabled={isGenerating}
                      className="w-full"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Enhance Lyrics
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Volume2 className="h-5 w-5" />
                        Voice Preview
                      </span>
                      <Button
                        variant={isPreviewPlaying ? "destructive" : "default"}
                        onClick={previewVoice}
                        disabled={!selectedPersona || !currentLyrics.trim()}
                      >
                        {isPreviewPlaying ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Stop Preview
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Preview Voice
                          </>
                        )}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-800 rounded-lg p-4">
                      <ScrollArea className="h-[300px]">
                        <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                          {currentLyrics || "No lyrics to preview..."}
                        </pre>
                      </ScrollArea>
                    </div>
                    
                    {selectedPersona && (
                      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                        <p className="text-sm">
                          <Mic className="h-4 w-4 inline mr-2" />
                          Preview using <strong>{selectedPersona}</strong> voice style
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Export & Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download TXT
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-2" />
                        Share Link
                      </Button>
                      <Button variant="outline" size="sm">
                        <Music className="h-4 w-4 mr-2" />
                        Export Audio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            
            {/* Persona Selector */}
            <PersonaSelector
              selectedPersona={selectedPersona}
              onPersonaSelect={setSelectedPersona}
              userLyrics={currentLyrics}
            />

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {projects.slice(0, 5).map((project) => (
                      <div 
                        key={project.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          currentProject?.id === project.id 
                            ? 'bg-blue-900/30 border border-blue-500' 
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                        onClick={() => {
                          setCurrentProject(project);
                          setCurrentLyrics(project.lyrics);
                          setSelectedPersona(project.persona);
                        }}
                      >
                        <p className="text-sm font-medium">{project.title}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(project.lastModified).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {project.persona}
                          </Badge>
                          {project.complexity > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {project.complexity}/10
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {projects.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No projects yet
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}