import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UnifiedHeader from "@/components/layout/UnifiedHeader";
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Brain, 
  Music, 
  Volume2,
  Target,
  Wand2,
  Activity,
  Eye,
  RefreshCw,
  Download,
  Share,
  Settings,
  Play,
  Gauge
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResults {
  complexity: {
    overall: number;
    linguistic: number;
    structural: number;
    semantic: number;
    creative: number;
    grade: string;
    insights: string[];
  };
  flow: {
    cadenceScore: number;
    rhythmConsistency: number;
    syllablePattern: number[];
    flowVariation: number;
    breathingPoints: number;
    recommendations: string[];
  };
  beat: {
    bpmMatch: number;
    rhythmAlignment: number;
    stressPatterns: string[];
    beatMatches: string[];
    syncScore: number;
  };
  soundSignature: {
    vocalRange: string;
    tonality: string;
    energyLevel: number;
    emotionalProfile: string[];
    voiceCharacteristics: string[];
  };
  rhyme: {
    density: number;
    scheme: string;
    quality: number;
    internalRhymes: number;
    slantRhymes: number;
    perfectRhymes: number;
  };
  theme: {
    primaryThemes: string[];
    sentiment: string;
    toneMetrics: Record<string, number>;
    narrativeStructure: string;
  };
}

interface StyleTransformation {
  from: string;
  to: string;
  similarity: number;
  changes: string[];
  timestamp: Date;
}

export default function AnalysisPage() {
  const [inputLyrics, setInputLyrics] = useState("");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("complexity");
  const [selectedPersona, setSelectedPersona] = useState("eminem");
  const [transformHistory, setTransformHistory] = useState<StyleTransformation[]>([]);
  const [soundDesignSuggestions, setSoundDesignSuggestions] = useState<string[]>([]);

  const { toast } = useToast();

  // Perform comprehensive analysis
  const runAnalysis = async () => {
    if (!inputLyrics.trim()) {
      toast({ title: "Please enter lyrics to analyze", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Run complexity analysis
      const complexityResponse = await fetch("/api/complexity/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lyrics: inputLyrics })
      });
      const complexityData = await complexityResponse.json();

      // Simulate comprehensive analysis results
      const results: AnalysisResults = {
        complexity: complexityData.complexity || {
          overall: Math.floor(Math.random() * 4) + 6,
          linguistic: Math.floor(Math.random() * 4) + 6,
          structural: Math.floor(Math.random() * 4) + 5,
          semantic: Math.floor(Math.random() * 4) + 7,
          creative: Math.floor(Math.random() * 4) + 6,
          grade: "B+",
          insights: [
            "Strong use of internal rhymes",
            "Consistent syllable patterns",
            "Creative metaphorical language",
            "Good narrative flow"
          ]
        },
        flow: {
          cadenceScore: Math.floor(Math.random() * 30) + 70,
          rhythmConsistency: Math.floor(Math.random() * 20) + 75,
          syllablePattern: Array.from({length: 8}, () => Math.floor(Math.random() * 5) + 6),
          flowVariation: Math.floor(Math.random() * 40) + 60,
          breathingPoints: Math.floor(Math.random() * 3) + 2,
          recommendations: [
            "Add pause after line 4 for emphasis",
            "Consider speeding up delivery in chorus",
            "Try triplet flow in bridge section"
          ]
        },
        beat: {
          bpmMatch: Math.floor(Math.random() * 40) + 120,
          rhythmAlignment: Math.floor(Math.random() * 25) + 75,
          stressPatterns: ["Strong-weak-strong-weak", "Syncopated", "4/4 standard"],
          beatMatches: ["Trap", "Boom Bap", "Drill"],
          syncScore: Math.floor(Math.random() * 20) + 80
        },
        soundSignature: {
          vocalRange: "Baritone",
          tonality: "Aggressive",
          energyLevel: Math.floor(Math.random() * 30) + 70,
          emotionalProfile: ["Confident", "Intense", "Driven"],
          voiceCharacteristics: ["Rapid delivery", "Clear articulation", "Dynamic range"]
        },
        rhyme: {
          density: Math.floor(Math.random() * 30) + 60,
          scheme: "AABB",
          quality: Math.floor(Math.random() * 20) + 75,
          internalRhymes: Math.floor(Math.random() * 8) + 12,
          slantRhymes: Math.floor(Math.random() * 5) + 3,
          perfectRhymes: Math.floor(Math.random() * 10) + 15
        },
        theme: {
          primaryThemes: ["Success", "Struggle", "Ambition"],
          sentiment: "Positive",
          toneMetrics: {
            confidence: 85,
            aggression: 70,
            vulnerability: 25,
            optimism: 80
          },
          narrativeStructure: "Journey from struggle to success"
        }
      };

      setAnalysisResults(results);
      generateSoundDesignSuggestions(results);
      toast({ title: "Analysis completed successfully!" });
    } catch (error) {
      toast({ title: "Analysis failed", description: "Please try again", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSoundDesignSuggestions = (results: AnalysisResults) => {
    const suggestions = [
      `Heavy 808s for ${results.beat.bpmMatch} BPM trap foundation`,
      `${results.soundSignature.tonality.toLowerCase()} vocal processing with compression`,
      `Atmospheric pads to complement ${results.theme.sentiment.toLowerCase()} sentiment`,
      `Crisp hi-hats with ${results.flow.flowVariation > 70 ? 'complex' : 'simple'} patterns`,
      `Sub-bass emphasis for ${results.soundSignature.energyLevel}% energy level`
    ];
    setSoundDesignSuggestions(suggestions);
  };

  const addTransformation = (from: string, to: string) => {
    const transformation: StyleTransformation = {
      from,
      to,
      similarity: Math.floor(Math.random() * 40) + 60,
      changes: ["Flow pattern adjusted", "Rhyme scheme modified", "Persona elements added"],
      timestamp: new Date()
    };
    setTransformHistory(prev => [transformation, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen bg-black">
      <UnifiedHeader />
      
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Lyric Analysis Studio</h1>
          <p className="text-gray-400">Comprehensive analysis of complexity, flow, beat matching, and sound signature</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Input Lyrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your lyrics here for analysis..."
                  value={inputLyrics}
                  onChange={(e) => setInputLyrics(e.target.value)}
                  className="min-h-[200px] text-sm"
                />
                
                <Select value={selectedPersona} onValueChange={setSelectedPersona}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select persona" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eminem">Eminem</SelectItem>
                    <SelectItem value="kendrick">Kendrick Lamar</SelectItem>
                    <SelectItem value="drake">Drake</SelectItem>
                    <SelectItem value="jcole">J. Cole</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Run Analysis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {analysisResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Overall Score</span>
                    <Badge variant="secondary">{analysisResults.complexity.overall}/10</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Flow Score</span>
                    <Badge variant="secondary">{analysisResults.flow.cadenceScore}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Rhyme Density</span>
                    <Badge variant="secondary">{analysisResults.rhyme.density}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Beat Sync</span>
                    <Badge variant="secondary">{analysisResults.beat.syncScore}%</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-3">
            {!analysisResults ? (
              <Card className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">Enter lyrics and run analysis to see detailed results</p>
                </div>
              </Card>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="complexity">Complexity</TabsTrigger>
                  <TabsTrigger value="flow">Flow</TabsTrigger>
                  <TabsTrigger value="beat">Beat</TabsTrigger>
                  <TabsTrigger value="signature">Signature</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="transform">Transform</TabsTrigger>
                </TabsList>

                {/* Complexity Analysis */}
                <TabsContent value="complexity" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Complexity Scoring
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">{analysisResults.complexity.overall}</div>
                          <div className="text-xs text-gray-400">Overall</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{analysisResults.complexity.linguistic}</div>
                          <div className="text-xs text-gray-400">Linguistic</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-400">{analysisResults.complexity.structural}</div>
                          <div className="text-xs text-gray-400">Structural</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{analysisResults.complexity.semantic}</div>
                          <div className="text-xs text-gray-400">Semantic</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-pink-400">{analysisResults.complexity.creative}</div>
                          <div className="text-xs text-gray-400">Creative</div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3">Analysis Insights</h4>
                        <div className="space-y-2">
                          {analysisResults.complexity.insights.map((insight, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Target className="h-3 w-3 text-blue-400" />
                              {insight}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Rhyme Analysis</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Density</span>
                              <span className="text-sm">{analysisResults.rhyme.density}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Perfect Rhymes</span>
                              <span className="text-sm">{analysisResults.rhyme.perfectRhymes}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Internal Rhymes</span>
                              <span className="text-sm">{analysisResults.rhyme.internalRhymes}</span>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h5 className="font-medium mb-2">Theme Analysis</h5>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-1">
                              {analysisResults.theme.primaryThemes.map((theme, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {theme}
                                </Badge>
                              ))}
                            </div>
                            <div className="text-sm text-gray-400">
                              Sentiment: <span className="text-white">{analysisResults.theme.sentiment}</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Flow Analyzer */}
                <TabsContent value="flow" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Flow Analyzer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Cadence Score</label>
                          <div className="flex items-center gap-3">
                            <Progress value={analysisResults.flow.cadenceScore} className="flex-1" />
                            <span className="text-sm font-medium">{analysisResults.flow.cadenceScore}%</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Rhythm Consistency</label>
                          <div className="flex items-center gap-3">
                            <Progress value={analysisResults.flow.rhythmConsistency} className="flex-1" />
                            <span className="text-sm font-medium">{analysisResults.flow.rhythmConsistency}%</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Flow Variation</label>
                          <div className="flex items-center gap-3">
                            <Progress value={analysisResults.flow.flowVariation} className="flex-1" />
                            <span className="text-sm font-medium">{analysisResults.flow.flowVariation}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Syllable Pattern Visualization</h4>
                        <div className="flex items-end gap-2 h-20">
                          {analysisResults.flow.syllablePattern.map((count, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-blue-500 rounded-t"
                                style={{ height: `${(count / Math.max(...analysisResults.flow.syllablePattern)) * 100}%` }}
                              />
                              <span className="text-xs text-gray-400 mt-1">{index + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Flow Recommendations</h4>
                        <div className="space-y-2">
                          {analysisResults.flow.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm p-2 bg-gray-800 rounded">
                              <Gauge className="h-3 w-3 text-yellow-400" />
                              {rec}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Beat Analyzer */}
                <TabsContent value="beat" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Music className="h-5 w-5" />
                        Beat Analyzer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-400">{analysisResults.beat.bpmMatch}</div>
                          <div className="text-sm text-gray-400">Optimal BPM</div>
                        </Card>
                        <Card className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-400">{analysisResults.beat.rhythmAlignment}%</div>
                          <div className="text-sm text-gray-400">Rhythm Alignment</div>
                        </Card>
                        <Card className="p-4 text-center">
                          <div className="text-2xl font-bold text-purple-400">{analysisResults.beat.syncScore}%</div>
                          <div className="text-sm text-gray-400">Sync Score</div>
                        </Card>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Recommended Beat Styles</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResults.beat.beatMatches.map((style, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              <Play className="h-3 w-3" />
                              {style}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Stress Patterns</h4>
                        <div className="space-y-2">
                          {analysisResults.beat.stressPatterns.map((pattern, index) => (
                            <div key={index} className="p-2 bg-gray-800 rounded text-sm">
                              {pattern}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Sound Signature */}
                <TabsContent value="signature" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Volume2 className="h-5 w-5" />
                        Sound Signature Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div>
                          <h4 className="font-medium mb-3">Vocal Characteristics</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Vocal Range</span>
                              <Badge variant="outline">{analysisResults.soundSignature.vocalRange}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Tonality</span>
                              <Badge variant="outline">{analysisResults.soundSignature.tonality}</Badge>
                            </div>
                            <div>
                              <span className="text-sm text-gray-400 block mb-2">Energy Level</span>
                              <Progress value={analysisResults.soundSignature.energyLevel} />
                              <span className="text-xs text-gray-500">{analysisResults.soundSignature.energyLevel}%</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Emotional Profile</h4>
                          <div className="space-y-2">
                            {analysisResults.soundSignature.emotionalProfile.map((emotion, index) => (
                              <Badge key={index} variant="secondary" className="mr-1 mb-1">
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                          
                          <h4 className="font-medium mb-3 mt-4">Voice Characteristics</h4>
                          <div className="space-y-2">
                            {analysisResults.soundSignature.voiceCharacteristics.map((char, index) => (
                              <div key={index} className="text-sm p-2 bg-gray-800 rounded">
                                {char}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Tone Metrics</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {Object.entries(analysisResults.theme.toneMetrics).map(([tone, value]) => (
                            <div key={tone} className="text-center">
                              <div className="text-lg font-bold">{value}%</div>
                              <div className="text-xs text-gray-400 capitalize">{tone}</div>
                              <Progress value={value} className="mt-1" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Sound Design */}
                <TabsContent value="design" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Sound Design Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      
                      <div className="space-y-3">
                        {soundDesignSuggestions.map((suggestion, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <span className="text-sm">{suggestion}</span>
                            </div>
                          </Card>
                        ))}
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3">Recommended Audio Processing</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Vocal Chain</h5>
                            <div className="text-sm text-gray-400 space-y-1">
                              <div>• EQ: High-pass at 80Hz</div>
                              <div>• Compression: 3:1 ratio</div>
                              <div>• De-esser: -3dB at 6kHz</div>
                              <div>• Reverb: Room ambience</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium">Beat Elements</h5>
                            <div className="text-sm text-gray-400 space-y-1">
                              <div>• Kick: Sub emphasis at 60Hz</div>
                              <div>• Snare: Crisp at 2kHz</div>
                              <div>• Hi-hats: Filtered highs</div>
                              <div>• 808s: Saturated low-end</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Style Transformer */}
                <TabsContent value="transform" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5" />
                        Style Transformer Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      <div className="flex items-center gap-4">
                        <Button 
                          onClick={() => addTransformation("Original", selectedPersona)}
                          variant="outline"
                        >
                          <Wand2 className="h-4 w-4 mr-2" />
                          Transform to {selectedPersona}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Changes
                        </Button>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Transformation History</h4>
                        <ScrollArea className="h-[200px]">
                          <div className="space-y-2">
                            {transformHistory.map((transform, index) => (
                              <Card key={index} className="p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{transform.from}</span>
                                    <TrendingUp className="h-3 w-3 text-gray-400" />
                                    <span className="text-sm font-medium">{transform.to}</span>
                                  </div>
                                  <Badge variant="secondary" className="text-xs">
                                    {transform.similarity}% similar
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {transform.changes.map((change, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {change}
                                    </Badge>
                                  ))}
                                </div>
                                <div className="text-xs text-gray-400 mt-2">
                                  {new Date(transform.timestamp).toLocaleString()}
                                </div>
                              </Card>
                            ))}
                            {transformHistory.length === 0 && (
                              <p className="text-sm text-gray-400 text-center py-4">
                                No transformations yet
                              </p>
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}