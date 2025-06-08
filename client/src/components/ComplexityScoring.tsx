import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { 
  Brain, 
  Target, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  BookOpen,
  Zap,
  Award,
  BarChart3,
  RefreshCw,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ComplexityImprovementTools from '@/components/ComplexityImprovementTools';
import { downloadComplexityReport } from '@/lib/pdfGenerator';

interface ComplexityScore {
  overall: number;
  linguistic: number;
  structural: number;
  semantic: number;
  creative: number;
  grade: string;
  insights: string[];
  suggestions: string[];
  timestamp: Date;
}

interface ComplexityScoringProps {
  lyrics?: string;
  className?: string;
  autoAnalyze?: boolean;
}

export default function ComplexityScoring({ 
  lyrics: externalLyrics, 
  className,
  autoAnalyze = false 
}: ComplexityScoringProps) {
  const [lyrics, setLyrics] = useState(externalLyrics || "");
  const [score, setScore] = useState<ComplexityScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<ComplexityScore[]>([]);
  
  const { toast } = useToast();

  // Update lyrics when external lyrics change
  useEffect(() => {
    if (externalLyrics !== undefined) {
      setLyrics(externalLyrics);
      if (autoAnalyze && externalLyrics.trim()) {
        analyzeComplexity(externalLyrics);
      }
    }
  }, [externalLyrics, autoAnalyze]);

  // AI-powered complexity analysis
  const analyzeComplexity = async (textToAnalyze?: string) => {
    const analysisText = textToAnalyze || lyrics;
    
    if (!analysisText.trim()) {
      toast({
        title: "No lyrics to analyze",
        description: "Please enter some lyrics before analyzing complexity.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/complexity/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lyrics: analysisText,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      const newScore: ComplexityScore = {
        ...data.score,
        timestamp: new Date()
      };
      
      setScore(newScore);
      setAnalysisHistory(prev => [...prev.slice(-9), newScore]);
      
      toast({
        title: "Analysis complete!",
        description: `Complexity score: ${newScore.overall}/100 (${newScore.grade})`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze complexity';
      setError(errorMessage);
      toast({
        title: "Analysis failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get color for score
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-[#FFC107]'; // Gold
    if (score >= 80) return 'text-[#FF4081]'; // Pink
    if (score >= 70) return 'text-[#AB47BC]'; // Purple
    if (score >= 60) return 'text-[#3F51B5]'; // Blue
    return 'text-gray-400'; // Gray
  };

  // Get grade badge color
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S': case 'A+': case 'A': return 'bg-gradient-to-r from-[#FFC107] to-[#FF4081]';
      case 'A-': case 'B+': case 'B': return 'bg-gradient-to-r from-[#FF4081] to-[#AB47BC]';
      case 'B-': case 'C+': case 'C': return 'bg-gradient-to-r from-[#AB47BC] to-[#3F51B5]';
      default: return 'bg-gray-600';
    }
  };

  // Sample lyrics for testing
  const loadSampleLyrics = () => {
    const sample = `Metaphysical thoughts cascade through neural pathways
While consciousness transcends the ordinary maze
Of societal constructs that bind our perception
Creating cognitive dissonance in our reception

The dichotomy between reality and dreams
Blurs the lines of what existence really means
Synaptic firing patterns dance in rhythm
As we navigate this existential prism

Introspective journeys through the labyrinth of mind
Reveal truths that rational thought cannot find
The paradox of being simultaneously free yet confined
In bodies that are temporary vessels, perfectly designed`;
    
    setLyrics(sample);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="musaix-card-border bg-black/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-5 w-5 text-[#FF4081]" />
            AI-Powered Lyric Complexity Scoring
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Lyrics Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white">Lyrics to Analyze</label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadSampleLyrics}
                className="text-xs"
              >
                Load Sample
              </Button>
            </div>
            <Textarea
              placeholder="Enter lyrics here for AI complexity analysis..."
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              className="min-h-[150px] bg-gray-900 border-gray-700 text-white"
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {lyrics.split(/\s+/).filter(w => w.length > 0).length} words, {lyrics.split('\n').filter(l => l.trim().length > 0).length} lines
              </div>
              <Button 
                onClick={() => analyzeComplexity()}
                disabled={isAnalyzing || !lyrics.trim()}
                className="musaix-gradient-button"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze Complexity
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert className="border-red-500 bg-red-500/10">
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {score && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="breakdown">Analysis</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="tools">Improve</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-4">
                    <div className={`text-4xl font-bold ${getScoreColor(score.overall)}`}>
                      {score.overall}
                    </div>
                    <Badge className={`${getGradeColor(score.grade)} text-white text-lg px-3 py-1`}>
                      Grade {score.grade}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400">Overall Complexity Score</div>
                </div>

                <div className="relative">
                  <Progress value={score.overall} className="h-4 bg-gray-800" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30 rounded-full" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getScoreColor(score.linguistic)}`}>
                      {score.linguistic}
                    </div>
                    <div className="text-xs text-gray-400">Linguistic</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getScoreColor(score.structural)}`}>
                      {score.structural}
                    </div>
                    <div className="text-xs text-gray-400">Structural</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getScoreColor(score.semantic)}`}>
                      {score.semantic}
                    </div>
                    <div className="text-xs text-gray-400">Semantic</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${getScoreColor(score.creative)}`}>
                      {score.creative}
                    </div>
                    <div className="text-xs text-gray-400">Creative</div>
                  </div>
                </div>
              </TabsContent>

              {/* Detailed Analysis Tab */}
              <TabsContent value="breakdown" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <BookOpen className="h-4 w-4 text-[#FF4081]" />
                        Linguistic Complexity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Vocabulary Sophistication</span>
                          <span className={`font-medium ${getScoreColor(score.linguistic)}`}>
                            {score.linguistic}/100
                          </span>
                        </div>
                        <Progress value={score.linguistic} className="h-2" />
                        <div className="text-xs text-gray-400">
                          Advanced vocabulary, word choice variety, and linguistic precision
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Layers className="h-4 w-4 text-[#AB47BC]" />
                        Structural Complexity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Form & Organization</span>
                          <span className={`font-medium ${getScoreColor(score.structural)}`}>
                            {score.structural}/100
                          </span>
                        </div>
                        <Progress value={score.structural} className="h-2" />
                        <div className="text-xs text-gray-400">
                          Rhyme schemes, meter, stanza structure, and compositional techniques
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Target className="h-4 w-4 text-[#FFC107]" />
                        Semantic Depth
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Meaning & Themes</span>
                          <span className={`font-medium ${getScoreColor(score.semantic)}`}>
                            {score.semantic}/100
                          </span>
                        </div>
                        <Progress value={score.semantic} className="h-2" />
                        <div className="text-xs text-gray-400">
                          Metaphorical depth, thematic complexity, and layered meanings
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <Sparkles className="h-4 w-4 text-[#3F51B5]" />
                        Creative Innovation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Originality & Style</span>
                          <span className={`font-medium ${getScoreColor(score.creative)}`}>
                            {score.creative}/100
                          </span>
                        </div>
                        <Progress value={score.creative} className="h-2" />
                        <div className="text-xs text-gray-400">
                          Unique expressions, innovative techniques, and artistic creativity
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* AI Insights Tab */}
              <TabsContent value="insights" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        Strengths Identified
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {score.insights.map((insight, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Award className="h-4 w-4 text-[#FFC107] mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-[#FF4081]" />
                        Improvement Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {score.suggestions.map((suggestion, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <Zap className="h-4 w-4 text-[#AB47BC] mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <BarChart3 className="h-4 w-4 text-[#3F51B5]" />
                      Analysis Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Analysis completed:</span>
                      <span className="text-white flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {score.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enhancement Tools Tab */}
              <TabsContent value="tools" className="space-y-4">
                <ComplexityImprovementTools
                  originalLyrics={lyrics}
                  complexityScore={score}
                  onLyricsImproved={(improvedLyrics) => {
                    setLyrics(improvedLyrics);
                    // Re-analyze the improved lyrics
                    analyzeComplexity(improvedLyrics);
                  }}
                  className="w-full"
                />
              </TabsContent>
            </Tabs>
          )}

          {/* Analysis History */}
          {analysisHistory.length > 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BarChart3 className="h-4 w-4 text-[#AB47BC]" />
                  Recent Analysis History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {analysisHistory.slice(-5).reverse().map((analysis, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-700/50 rounded text-sm">
                      <div className="flex items-center gap-2">
                        <Badge className={`${getGradeColor(analysis.grade)} text-white text-xs`}>
                          {analysis.grade}
                        </Badge>
                        <span className={`font-medium ${getScoreColor(analysis.overall)}`}>
                          {analysis.overall}/100
                        </span>
                      </div>
                      <span className="text-gray-400 text-xs">
                        {analysis.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}