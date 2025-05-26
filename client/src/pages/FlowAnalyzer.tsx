import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import UnifiedPageLayout from "@/components/layout/UnifiedPageLayout";
import { BarChart, Activity, Zap, TrendingUp, FileText, Music } from "lucide-react";

export default function FlowAnalyzer() {
  const [lyrics, setLyrics] = useState("");

  const flowAnalysis = useMemo(() => {
    if (!lyrics.trim()) {
      return {
        syllablePattern: [],
        averageSyllables: 0,
        stressPoints: [],
        flowConsistency: 0,
        rhymeScheme: [],
        suggestions: []
      };
    }

    const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
    
    // Syllable counting function (simplified)
    const countSyllables = (word: string): number => {
      const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
      if (cleanWord.length <= 3) return 1;
      const vowelGroups = cleanWord.match(/[aeiouy]+/g);
      return vowelGroups ? Math.max(1, vowelGroups.length) : 1;
    };

    // Analyze syllable patterns
    const syllablePattern = lines.map(line => {
      const words = line.split(/\s+/).filter(w => w.length > 0);
      return words.reduce((sum, word) => sum + countSyllables(word), 0);
    });

    const averageSyllables = syllablePattern.length > 0 
      ? syllablePattern.reduce((sum, count) => sum + count, 0) / syllablePattern.length 
      : 0;

    // Detect stress points (words with emphasis)
    const stressPoints = lines.map(line => {
      const stressWords = line.match(/[A-Z]{2,}|!|\?/g) || [];
      return stressWords.length;
    });

    // Flow consistency (how consistent syllable counts are)
    const variance = syllablePattern.length > 1
      ? syllablePattern.reduce((sum, count) => sum + Math.pow(count - averageSyllables, 2), 0) / syllablePattern.length
      : 0;
    const flowConsistency = Math.max(0, 100 - (variance * 5));

    // Basic rhyme scheme detection
    const getLastSound = (line: string): string => {
      const words = line.trim().split(/\s+/);
      const lastWord = words[words.length - 1]?.replace(/[^a-zA-Z]/g, '').toLowerCase();
      return lastWord ? lastWord.slice(-2) : '';
    };

    const rhymeScheme = lines.map((line, index) => {
      const sound = getLastSound(line);
      const previousIndex = lines.slice(0, index).findIndex(prevLine => getLastSound(prevLine) === sound);
      return previousIndex !== -1 ? String.fromCharCode(65 + previousIndex % 26) : String.fromCharCode(65 + index % 26);
    });

    // Generate suggestions
    const suggestions = [];
    
    if (flowConsistency < 70) {
      suggestions.push("Consider making your syllable counts more consistent for better flow");
    }
    
    if (averageSyllables < 8) {
      suggestions.push("Your lines might benefit from more syllables to create a fuller sound");
    }
    
    if (averageSyllables > 16) {
      suggestions.push("Consider shorter lines for easier delivery and clearer enunciation");
    }
    
    const stressTotal = stressPoints.reduce((sum, count) => sum + count, 0);
    if (stressTotal === 0) {
      suggestions.push("Add some emphasis words or punctuation to create dynamic stress points");
    }
    
    if (rhymeScheme.filter((scheme, index, arr) => arr.indexOf(scheme) !== index).length === 0) {
      suggestions.push("Consider adding some rhyming words to improve the rhyme scheme");
    }

    return {
      syllablePattern,
      averageSyllables: Math.round(averageSyllables * 10) / 10,
      stressPoints,
      flowConsistency: Math.round(flowConsistency),
      rhymeScheme,
      suggestions
    };
  }, [lyrics]);

  const getFlowRating = (consistency: number): { label: string; color: string } => {
    if (consistency >= 80) return { label: "Excellent", color: "text-green-400" };
    if (consistency >= 60) return { label: "Good", color: "text-[#FFC107]" };
    if (consistency >= 40) return { label: "Fair", color: "text-orange-400" };
    return { label: "Needs Work", color: "text-red-400" };
  };

  const flowRating = getFlowRating(flowAnalysis.flowConsistency);

  return (
    <UnifiedPageLayout 
      title="Flow Analyzer"
      description="Analyze your flow and cadence to perfect your lyrical delivery"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#FF4081]" />
                Lyrics Input
              </CardTitle>
              <CardDescription className="text-gray-400">
                Paste your lyrics to analyze flow patterns and cadence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste your lyrics here...

Example:
I'm spitting fire with every single line I write
Making sure my flow is always tight
Syllables dancing through the night
Every word I say burns bright"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="min-h-[300px] bg-gray-900 border-gray-600 text-white text-lg leading-relaxed font-mono"
              />
              <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                <span>{lyrics.split('\n').filter(line => line.trim()).length} lines</span>
                <span>{lyrics.split(/\s+/).filter(w => w.length > 0).length} words</span>
              </div>
            </CardContent>
          </Card>

          {/* Syllable Pattern Visualization */}
          {lyrics && (
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-[#AB47BC]" />
                  Syllable Pattern
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Visual representation of syllables per line
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {flowAnalysis.syllablePattern.map((count, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm text-gray-400 w-8">L{index + 1}</span>
                      <div className="flex-1 bg-gray-800 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#AB47BC] to-[#FF4081] transition-all duration-500"
                          style={{ width: `${Math.min(100, (count / Math.max(...flowAnalysis.syllablePattern, 1)) * 100)}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
                          {count} syllables
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Analysis Results */}
        <div className="space-y-6">
          {/* Flow Metrics */}
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#FF4081]" />
                Flow Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Flow Consistency</span>
                  <span className={`text-sm font-medium ${flowRating.color}`}>
                    {flowRating.label}
                  </span>
                </div>
                <Progress 
                  value={flowAnalysis.flowConsistency} 
                  className="h-2"
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  {flowAnalysis.flowConsistency}% consistent
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-gray-800 rounded-md">
                  <div className="text-lg font-bold text-[#FFC107]">
                    {flowAnalysis.averageSyllables}
                  </div>
                  <div className="text-xs text-gray-400">Avg Syllables</div>
                </div>
                <div className="text-center p-3 bg-gray-800 rounded-md">
                  <div className="text-lg font-bold text-[#3F51B5]">
                    {flowAnalysis.stressPoints.reduce((sum, count) => sum + count, 0)}
                  </div>
                  <div className="text-xs text-gray-400">Stress Points</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rhyme Scheme */}
          {lyrics && flowAnalysis.rhymeScheme.length > 0 && (
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Music className="h-5 w-5 text-[#FFC107]" />
                  Rhyme Scheme
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Pattern of your rhymes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {flowAnalysis.rhymeScheme.map((scheme, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="bg-[#FFC107]/10 border-[#FFC107]/30 text-[#FFC107]"
                    >
                      L{index + 1}: {scheme}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {flowAnalysis.suggestions.length > 0 && (
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#3F51B5]" />
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {flowAnalysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-gray-800 rounded-md">
                      <Zap className="h-4 w-4 text-[#3F51B5] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Tips */}
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="text-white">Flow Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <h4 className="font-medium text-[#FF4081] mb-1">Syllable Consistency</h4>
                  <p>Keep similar syllable counts for smooth flow</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#AB47BC] mb-1">Stress Placement</h4>
                  <p>Use emphasis to create rhythm and impact</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#FFC107] mb-1">Rhyme Variety</h4>
                  <p>Mix perfect and slant rhymes for interest</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UnifiedPageLayout>
  );
}