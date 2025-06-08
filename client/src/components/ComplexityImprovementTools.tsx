import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { 
  Lightbulb, 
  Wand2, 
  BookOpen, 
  Layers, 
  Target, 
  Sparkles,
  ArrowRight,
  RefreshCw,
  Copy,
  CheckCircle,
  TrendingUp,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PDFDownloadButton from '@/components/PDFDownloadButton';

interface ImprovementSuggestion {
  category: 'linguistic' | 'structural' | 'semantic' | 'creative';
  title: string;
  description: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  impact: number; // 1-5 scale
}

interface ComplexityImprovementToolsProps {
  originalLyrics: string;
  complexityScore?: {
    overall: number;
    linguistic: number;
    structural: number;
    semantic: number;
    creative: number;
    grade: string;
    insights: string[];
    suggestions: string[];
  };
  onLyricsImproved?: (improvedLyrics: string) => void;
  className?: string;
}

export default function ComplexityImprovementTools({
  originalLyrics,
  complexityScore,
  onLyricsImproved,
  className
}: ComplexityImprovementToolsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [improvedLyrics, setImprovedLyrics] = useState('');
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [improvementFocus, setImprovementFocus] = useState<string>('balanced');
  
  const { toast } = useToast();

  // Generate improvement suggestions based on complexity score
  const getImprovementSuggestions = (): ImprovementSuggestion[] => {
    const suggestions: ImprovementSuggestion[] = [];
    
    if (!complexityScore) return suggestions;

    // Linguistic improvements
    if (complexityScore.linguistic < 70) {
      suggestions.push({
        category: 'linguistic',
        title: 'Enhance Vocabulary Sophistication',
        description: 'Replace common words with more advanced synonyms and technical terms',
        example: 'Change "big problem" to "monumental predicament" or "existential crisis"',
        difficulty: 'easy',
        impact: 4
      });
      
      suggestions.push({
        category: 'linguistic',
        title: 'Add Multi-syllabic Words',
        description: 'Incorporate longer, more complex words to increase linguistic density',
        example: 'Use "metamorphosis" instead of "change", "introspective" instead of "thinking"',
        difficulty: 'medium',
        impact: 3
      });
    }

    // Structural improvements
    if (complexityScore.structural < 70) {
      suggestions.push({
        category: 'structural',
        title: 'Complex Rhyme Schemes',
        description: 'Implement internal rhymes, slant rhymes, and multi-syllabic rhyming patterns',
        example: 'Add internal rhymes: "Mind racing, thoughts chasing, heart pacing through the night"',
        difficulty: 'hard',
        impact: 5
      });
      
      suggestions.push({
        category: 'structural',
        title: 'Varied Meter and Flow',
        description: 'Alternate between different rhythmic patterns and syllable counts',
        example: 'Mix short punchy lines with longer flowing verses for dynamic contrast',
        difficulty: 'medium',
        impact: 4
      });
    }

    // Semantic improvements
    if (complexityScore.semantic < 70) {
      suggestions.push({
        category: 'semantic',
        title: 'Layered Metaphors',
        description: 'Create multi-level metaphorical meanings that work on several interpretive levels',
        example: 'Use "ocean of thoughts" to represent both mental depth and emotional turbulence',
        difficulty: 'hard',
        impact: 5
      });
      
      suggestions.push({
        category: 'semantic',
        title: 'Abstract Concepts',
        description: 'Introduce philosophical themes and abstract ideas into concrete imagery',
        example: 'Blend concepts like "time", "consciousness", "identity" with vivid descriptions',
        difficulty: 'medium',
        impact: 4
      });
    }

    // Creative improvements
    if (complexityScore.creative < 70) {
      suggestions.push({
        category: 'creative',
        title: 'Innovative Wordplay',
        description: 'Create unique word combinations and linguistic innovations',
        example: 'Coin new terms like "mind-scaping" or use portmanteau words',
        difficulty: 'hard',
        impact: 5
      });
      
      suggestions.push({
        category: 'creative',
        title: 'Unconventional Structure',
        description: 'Break traditional verse patterns with experimental formatting',
        example: 'Use varying line lengths, repetition patterns, or cyclical themes',
        difficulty: 'medium',
        impact: 3
      });
    }

    return suggestions.sort((a, b) => b.impact - a.impact);
  };

  // Apply AI-powered improvements
  const applyImprovements = async () => {
    if (!originalLyrics.trim()) {
      toast({
        title: "No lyrics to improve",
        description: "Please provide lyrics before applying improvements.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const focusAreas = selectedSuggestions.length > 0 ? selectedSuggestions : [improvementFocus];
      
      const response = await fetch('/api/complexity/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lyrics: originalLyrics,
          focusAreas,
          currentScore: complexityScore,
          improvementLevel: 'moderate'
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Improvement failed: ${response.statusText}`);
      }

      const data = await response.json();
      setImprovedLyrics(data.improvedLyrics);
      
      toast({
        title: "Lyrics improved!",
        description: "AI has enhanced your lyrics based on complexity analysis.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to improve lyrics';
      toast({
        title: "Improvement failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy improved lyrics
  const copyImprovedLyrics = () => {
    navigator.clipboard.writeText(improvedLyrics);
    toast({
      title: "Copied to clipboard",
      description: "Improved lyrics have been copied.",
    });
  };

  // Apply improved lyrics
  const applyImprovedLyrics = () => {
    if (onLyricsImproved) {
      onLyricsImproved(improvedLyrics);
      toast({
        title: "Lyrics applied",
        description: "Improved lyrics have been applied to your song.",
      });
    }
  };

  const suggestions = getImprovementSuggestions();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'linguistic': return <BookOpen className="h-4 w-4" />;
      case 'structural': return <Layers className="h-4 w-4" />;
      case 'semantic': return <Target className="h-4 w-4" />;
      case 'creative': return <Sparkles className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'linguistic': return 'text-[#FF4081]';
      case 'structural': return 'text-[#AB47BC]';
      case 'semantic': return 'text-[#FFC107]';
      case 'creative': return 'text-[#3F51B5]';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'hard': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="musaix-card-border bg-black/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-5 w-5 text-[#FF4081]" />
            AI Improvement Tools & Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
              <TabsTrigger value="improve">AI Enhancement</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            {/* Suggestions Tab */}
            <TabsContent value="suggestions" className="space-y-4">
              {complexityScore && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${complexityScore.linguistic >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                      {complexityScore.linguistic}/100
                    </div>
                    <div className="text-xs text-gray-400">Linguistic</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${complexityScore.structural >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                      {complexityScore.structural}/100
                    </div>
                    <div className="text-xs text-gray-400">Structural</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${complexityScore.semantic >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                      {complexityScore.semantic}/100
                    </div>
                    <div className="text-xs text-gray-400">Semantic</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${complexityScore.creative >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                      {complexityScore.creative}/100
                    </div>
                    <div className="text-xs text-gray-400">Creative</div>
                  </div>
                </div>
              )}

              {suggestions.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#FF4081]" />
                    Improvement Opportunities
                  </h4>
                  {suggestions.map((suggestion, index) => (
                    <Card key={index} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`${getCategoryColor(suggestion.category)} mt-1`}>
                            {getCategoryIcon(suggestion.category)}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h5 className="font-medium text-white">{suggestion.title}</h5>
                              <Badge className={`${getDifficultyColor(suggestion.difficulty)} text-white text-xs`}>
                                {suggestion.difficulty}
                              </Badge>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: suggestion.impact }).map((_, i) => (
                                  <div key={i} className="w-2 h-2 bg-[#FFC107] rounded-full" />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-300">{suggestion.description}</p>
                            <div className="bg-gray-700/50 p-2 rounded text-xs text-gray-400 italic">
                              Example: {suggestion.example}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert className="border-green-500 bg-green-500/10">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-400">
                    Your lyrics show excellent complexity across all dimensions! Consider exploring advanced experimental techniques.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* AI Enhancement Tab */}
            <TabsContent value="improve" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-[#AB47BC]" />
                    AI-Powered Enhancement
                  </h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Select focus areas for AI enhancement or use balanced improvement across all dimensions.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['linguistic', 'structural', 'semantic', 'creative'].map((area) => (
                    <Button
                      key={area}
                      variant={improvementFocus === area ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImprovementFocus(area)}
                      className="text-xs"
                    >
                      {area.charAt(0).toUpperCase() + area.slice(1)}
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={applyImprovements}
                  disabled={isGenerating || !originalLyrics.trim()}
                  className="w-full musaix-gradient-button"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Enhancing Lyrics...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Enhance with AI
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results" className="space-y-4">
              {improvedLyrics ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Enhanced Lyrics
                    </h4>
                    <div className="flex gap-2">
                      {complexityScore && (
                        <PDFDownloadButton
                          complexityScore={complexityScore}
                          originalLyrics={originalLyrics}
                          improvedLyrics={improvedLyrics}
                        />
                      )}
                      <Button size="sm" variant="outline" onClick={copyImprovedLyrics}>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      {onLyricsImproved && (
                        <Button size="sm" onClick={applyImprovedLyrics} className="musaix-gradient-button">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Apply
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Textarea
                    value={improvedLyrics}
                    onChange={(e) => setImprovedLyrics(e.target.value)}
                    className="min-h-[200px] bg-gray-900 border-gray-700 text-white"
                    placeholder="Enhanced lyrics will appear here..."
                  />
                  
                  <Alert className="border-blue-500 bg-blue-500/10">
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription className="text-blue-400">
                      Review the enhanced lyrics and make manual adjustments as needed. You can edit the text above before applying.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">Enhanced lyrics will appear here after AI processing</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}