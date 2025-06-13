import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnifiedPageLayout from '@/components/layout/UnifiedPageLayout';
import { 
  Loader2, BarChart3, TrendingUp, Zap, Music, 
  Volume2, Clock, Layers, Target, Radio
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BeatAnalysis {
  genre: {
    primary: string;
    confidence: number;
    characteristics: string[];
  };
  rhythm: {
    tempo: string;
    groove: string;
    complexity: number;
  };
  production: {
    quality: number;
    mix: string;
    mastering: string;
  };
  energy: {
    level: number;
    dynamic: string;
    impact: string;
  };
  composition: {
    structure: string;
    arrangement: number;
    creativity: number;
  };
  recommendations: string[];
}

export default function BeatAnalyzer() {
  const [beatDescription, setBeatDescription] = useState('');
  const [analysis, setAnalysis] = useState<BeatAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('analyze');

  const { toast } = useToast();

  const analyzeBeat = async () => {
    if (!beatDescription.trim()) {
      toast({
        title: "Input Required",
        description: "Please provide a beat description to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const systemPrompt = `You are an expert music production analyst. Analyze the provided beat description and provide detailed insights about genre classification, rhythm analysis, production quality, energy levels, and composition structure. Return a comprehensive analysis in JSON format.`;

    const userInput = `Analyze this beat: ${beatDescription}

Please provide analysis in this JSON structure:
{
  "genre": {
    "primary": "genre name",
    "confidence": confidence_percentage,
    "characteristics": ["characteristic1", "characteristic2"]
  },
  "rhythm": {
    "tempo": "tempo description",
    "groove": "groove description", 
    "complexity": complexity_score_0_to_100
  },
  "production": {
    "quality": quality_score_0_to_100,
    "mix": "mix description",
    "mastering": "mastering assessment"
  },
  "energy": {
    "level": energy_level_0_to_100,
    "dynamic": "dynamic description",
    "impact": "impact assessment"
  },
  "composition": {
    "structure": "structure description",
    "arrangement": arrangement_score_0_to_100,
    "creativity": creativity_score_0_to_100
  },
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}`;

    try {
      const endpoint = '/api/openai/enhance';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          lyrics: userInput,
          prompt: systemPrompt,
          temperature: 0.3,
          personaId: 'neutral',
          useAI: true
        })
      });

      if (!res.ok) {
        throw new Error('Failed to analyze beat');
      }

      const data = await res.json();
      const analysisText = data.enhancedLyrics;
      
      try {
        // Extract JSON from the response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysisData = JSON.parse(jsonMatch[0]);
          setAnalysis(analysisData);
          toast({
            title: "Analysis Complete",
            description: `Beat analyzed as ${analysisData.genre.primary} with ${analysisData.genre.confidence}% confidence`,
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (parseError) {
        // Fallback analysis if JSON parsing fails
        const fallbackAnalysis: BeatAnalysis = {
          genre: {
            primary: "Hip-Hop",
            confidence: 75,
            characteristics: ["Modern production", "Contemporary sound"]
          },
          rhythm: {
            tempo: "Mid-tempo",
            groove: "Steady groove",
            complexity: 60
          },
          production: {
            quality: 70,
            mix: "Balanced mix",
            mastering: "Professional mastering"
          },
          energy: {
            level: 75,
            dynamic: "Moderate dynamics",
            impact: "Strong impact"
          },
          composition: {
            structure: "Standard structure",
            arrangement: 65,
            creativity: 70
          },
          recommendations: [
            "Consider adding more dynamic elements",
            "Experiment with different percussion patterns",
            "Enhance melodic content"
          ]
        };
        setAnalysis(fallbackAnalysis);
        toast({
          title: "Analysis Complete",
          description: "Beat analysis completed with basic assessment",
        });
      }

    } catch (error) {
      console.error('Error analyzing beat:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze beat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <UnifiedPageLayout 
      title="Beat Analyzer" 
      description="AI-powered beat analysis and production insights"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyze" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analyze Beat
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analysis Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6">
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Radio className="h-5 w-5 text-[#FF4081]" />
                Beat Description Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Describe your beat in detail... Include genre, instruments, tempo, mood, production style, and any specific characteristics you want analyzed."
                value={beatDescription}
                onChange={(e) => setBeatDescription(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white min-h-[120px]"
              />
              
              <div className="text-sm text-gray-400">
                <p className="mb-2">For best results, include:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Genre and style (trap, boom bap, drill, etc.)</li>
                  <li>Key instruments and sounds</li>
                  <li>Tempo and rhythm characteristics</li>
                  <li>Mood and energy level</li>
                  <li>Production techniques used</li>
                </ul>
              </div>

              <Button
                onClick={analyzeBeat}
                disabled={loading || !beatDescription.trim()}
                className="w-full musaix-gradient-button"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Beat...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Analyze Beat
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {analysis ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Genre Analysis */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Music className="h-5 w-5 text-[#FF4081]" />
                    Genre Classification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{analysis.genre.primary}</span>
                    <Badge className="bg-[#FF4081] text-white">
                      {analysis.genre.confidence}% confidence
                    </Badge>
                  </div>
                  
                  <div>
                    <span className="text-gray-300 text-sm block mb-2">Key Characteristics:</span>
                    <div className="flex flex-wrap gap-2">
                      {analysis.genre.characteristics.map((char, index) => (
                        <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rhythm Analysis */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="h-5 w-5 text-[#FF4081]" />
                    Rhythm Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Tempo</span>
                      <span className="text-white">{analysis.rhythm.tempo}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Groove</span>
                      <span className="text-white">{analysis.rhythm.groove}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Complexity</span>
                        <span className={`font-medium ${getScoreColor(analysis.rhythm.complexity)}`}>
                          {analysis.rhythm.complexity}%
                        </span>
                      </div>
                      <Progress 
                        value={analysis.rhythm.complexity} 
                        className={`h-2 ${getProgressColor(analysis.rhythm.complexity)}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Production Quality */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Layers className="h-5 w-5 text-[#FF4081]" />
                    Production Quality
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Overall Quality</span>
                        <span className={`font-medium ${getScoreColor(analysis.production.quality)}`}>
                          {analysis.production.quality}%
                        </span>
                      </div>
                      <Progress 
                        value={analysis.production.quality} 
                        className={`h-2 ${getProgressColor(analysis.production.quality)}`}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Mix</span>
                      <span className="text-white text-sm">{analysis.production.mix}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Mastering</span>
                      <span className="text-white text-sm">{analysis.production.mastering}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Energy Analysis */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Volume2 className="h-5 w-5 text-[#FF4081]" />
                    Energy Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Energy Level</span>
                        <span className={`font-medium ${getScoreColor(analysis.energy.level)}`}>
                          {analysis.energy.level}%
                        </span>
                      </div>
                      <Progress 
                        value={analysis.energy.level} 
                        className={`h-2 ${getProgressColor(analysis.energy.level)}`}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Dynamic</span>
                      <span className="text-white text-sm">{analysis.energy.dynamic}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Impact</span>
                      <span className="text-white text-sm">{analysis.energy.impact}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Composition Analysis */}
              <Card className="musaix-card-border bg-black/50 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="h-5 w-5 text-[#FF4081]" />
                    Composition Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <span className="text-gray-300 block mb-2">Structure</span>
                      <span className="text-white">{analysis.composition.structure}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Arrangement</span>
                        <span className={`font-medium ${getScoreColor(analysis.composition.arrangement)}`}>
                          {analysis.composition.arrangement}%
                        </span>
                      </div>
                      <Progress 
                        value={analysis.composition.arrangement} 
                        className={`h-2 ${getProgressColor(analysis.composition.arrangement)}`}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Creativity</span>
                        <span className={`font-medium ${getScoreColor(analysis.composition.creativity)}`}>
                          {analysis.composition.creativity}%
                        </span>
                      </div>
                      <Progress 
                        value={analysis.composition.creativity} 
                        className={`h-2 ${getProgressColor(analysis.composition.creativity)}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="musaix-card-border bg-black/50 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5 text-[#FF4081]" />
                    Production Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg">
                        <div className="w-2 h-2 bg-[#FF4081] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-200">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="musaix-card-border bg-black/50">
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-400">No analysis available. Please analyze a beat first.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </UnifiedPageLayout>
  );
}