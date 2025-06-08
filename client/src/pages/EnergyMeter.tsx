import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedPageLayout from "@/components/layout/UnifiedPageLayout";
import PersonaEnergyMeter from "@/components/PersonaEnergyMeter";
import { getPersonas, Persona } from "@/lib/types";
import { Activity, BarChart3, Zap, TrendingUp, Flame, Brain, Target, Waves } from "lucide-react";

export default function EnergyMeter() {
  const [lyrics, setLyrics] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<Array<{
    timestamp: Date;
    energy: number;
    intensity: string;
    lyricsSample: string;
  }>>([]);

  const personas = getPersonas();

  // Sample lyrics for demonstration
  const sampleLyrics = {
    high: `Started from the bottom now we here
Grinding every day, vision crystal clear
Fire in my soul, can't nobody stop
Racing to the top, never gonna flop
BLAZING through the night like a meteor
Energy electric, crowd's screaming more!`,
    
    medium: `Walking down the street with my head held high
Music in my ears, watching clouds go by
Life's a journey, taking it step by step
Learning from mistakes, no time for regret
Finding my rhythm in this crazy world
Dancing to the beat as stories unfold`,
    
    low: `Quiet moments in the morning light
Gentle whispers of the coming night
Peaceful thoughts drift through my mind
Leaving all the chaos far behind
Soft melodies carry me away
To a place where I can simply stay`
  };

  // Real-time energy analysis as user types
  const energyAnalysis = React.useMemo(() => {
    if (!lyrics) return { 
      level: 0, 
      factors: [], 
      intensity: 'Silent',
      breakdown: {
        wordEnergy: 0,
        emotionalIntensity: 0,
        punctuationEnergy: 0,
        rhymeComplexity: 0,
        flowDensity: 0
      }
    };
    
    const words = lyrics.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
    
    // Energy word analysis
    const highEnergyWords = ['fire', 'blazing', 'explosive', 'intense', 'wild', 'crazy', 'mad', 'insane', 'savage', 'beast', 'rage', 'storm', 'thunder', 'lightning', 'power', 'strong', 'hard', 'fast', 'loud', 'bang', 'crash', 'smash', 'hit', 'strike', 'attack', 'fight', 'battle', 'war', 'kill', 'destroy', 'burn', 'flame', 'heat', 'hot', 'boiling', 'explosive'];
    const lowEnergyWords = ['calm', 'peaceful', 'quiet', 'gentle', 'soft', 'light', 'mild', 'subtle', 'whisper', 'breathe', 'float', 'drift', 'slow', 'easy', 'smooth', 'mellow', 'chill', 'relax', 'rest', 'sleep', 'dream', 'silence', 'still'];
    const emotionalWords = ['love', 'hate', 'pain', 'joy', 'anger', 'passion', 'heart', 'soul', 'feel', 'emotion', 'deep', 'real', 'truth', 'cry', 'laugh', 'scream', 'shout'];
    
    let wordEnergy = 0;
    let emotionalIntensity = 0;
    
    words.forEach(word => {
      if (highEnergyWords.some(hw => word.includes(hw))) wordEnergy += 10;
      if (lowEnergyWords.some(lw => word.includes(lw))) wordEnergy -= 5;
      if (emotionalWords.some(ew => word.includes(ew))) emotionalIntensity += 8;
    });
    
    // Punctuation energy
    const exclamations = (lyrics.match(/!/g) || []).length;
    const caps = (lyrics.match(/[A-Z]{2,}/g) || []).length;
    const punctuationEnergy = exclamations * 15 + caps * 10;
    
    // Rhyme complexity
    const rhymeComplexity = Math.min(100, lines.length * 8);
    
    // Flow density (syllables per line)
    const avgSyllables = words.reduce((acc, word) => {
      return acc + Math.max(1, word.replace(/[^aeiouAEIOU]/g, '').length);
    }, 0) / Math.max(lines.length, 1);
    const flowDensity = Math.min(100, avgSyllables * 10);
    
    const totalEnergy = Math.max(0, Math.min(100, 
      (wordEnergy + emotionalIntensity + punctuationEnergy + rhymeComplexity + flowDensity) / 5
    ));
    
    let intensity: string;
    if (totalEnergy < 20) intensity = 'Calm';
    else if (totalEnergy < 40) intensity = 'Mellow';
    else if (totalEnergy < 60) intensity = 'Balanced';
    else if (totalEnergy < 80) intensity = 'Energetic';
    else intensity = 'Explosive';
    
    return {
      level: totalEnergy,
      intensity,
      breakdown: {
        wordEnergy: Math.max(0, Math.min(100, wordEnergy)),
        emotionalIntensity: Math.min(100, emotionalIntensity),
        punctuationEnergy: Math.min(100, punctuationEnergy),
        rhymeComplexity,
        flowDensity
      }
    };
  }, [lyrics]);

  // Add to analysis history when energy changes significantly
  useEffect(() => {
    if (lyrics && energyAnalysis.level > 0) {
      const lastAnalysis = analysisHistory[analysisHistory.length - 1];
      if (!lastAnalysis || Math.abs(lastAnalysis.energy - energyAnalysis.level) > 10) {
        setAnalysisHistory(prev => [...prev.slice(-9), {
          timestamp: new Date(),
          energy: energyAnalysis.level,
          intensity: energyAnalysis.intensity,
          lyricsSample: lyrics.slice(0, 50) + (lyrics.length > 50 ? '...' : '')
        }]);
      }
    }
  }, [energyAnalysis.level, lyrics]);

  const loadSample = (type: keyof typeof sampleLyrics) => {
    setLyrics(sampleLyrics[type]);
  };

  const clearLyrics = () => {
    setLyrics("");
    setAnalysisHistory([]);
  };

  return (
    <UnifiedPageLayout 
      title="Persona Energy Meter"
      description="Visualize the creative intensity and energy of your lyrics in real-time"
    >
      <div className="space-y-6">
        
        {/* Main Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Lyrics Input */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-[#FF4081]" />
                  Lyrics Analysis
                </CardTitle>
                <CardDescription>
                  Type or paste lyrics to see real-time energy analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-white">Your Lyrics</label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => loadSample('high')}>
                        High Energy
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => loadSample('medium')}>
                        Medium Energy
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => loadSample('low')}>
                        Low Energy
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Enter your lyrics here to analyze their energy and intensity..."
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    className="min-h-[300px] bg-gray-900 border-gray-700 text-white"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    {lyrics.split(/\s+/).filter(w => w.length > 0).length} words, {lyrics.split('\n').filter(l => l.trim().length > 0).length} lines
                  </div>
                  <Button variant="outline" size="sm" onClick={clearLyrics}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Energy Breakdown */}
            {lyrics && (
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#AB47BC]" />
                    Energy Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Word Energy</span>
                          <span className="text-[#FF4081]">{Math.round(energyAnalysis.breakdown.wordEnergy)}%</span>
                        </div>
                        <Progress value={energyAnalysis.breakdown.wordEnergy} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Emotional Intensity</span>
                          <span className="text-[#AB47BC]">{Math.round(energyAnalysis.breakdown.emotionalIntensity)}%</span>
                        </div>
                        <Progress value={energyAnalysis.breakdown.emotionalIntensity} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Punctuation Energy</span>
                          <span className="text-[#FFC107]">{Math.round(energyAnalysis.breakdown.punctuationEnergy)}%</span>
                        </div>
                        <Progress value={energyAnalysis.breakdown.punctuationEnergy} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Rhyme Complexity</span>
                          <span className="text-[#3F51B5]">{Math.round(energyAnalysis.breakdown.rhymeComplexity)}%</span>
                        </div>
                        <Progress value={energyAnalysis.breakdown.rhymeComplexity} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Flow Density</span>
                          <span className="text-[#00BCD4]">{Math.round(energyAnalysis.breakdown.flowDensity)}%</span>
                        </div>
                        <Progress value={energyAnalysis.breakdown.flowDensity} className="h-2" />
                      </div>
                      
                      <div className="pt-2 border-t border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Overall Energy</span>
                          <Badge className="bg-gradient-to-r from-[#FF4081] to-[#AB47BC] text-white">
                            {Math.round(energyAnalysis.level)}% {energyAnalysis.intensity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Energy Meter Sidebar */}
          <div className="space-y-4">
            {/* Persona Selection */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#FFC107]" />
                  Persona Context
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={selectedPersona?.id || ""} 
                  onValueChange={(value) => {
                    const persona = personas.find(p => p.id === value);
                    setSelectedPersona(persona || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a persona (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Persona</SelectItem>
                    {personas.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.icon} {persona.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Energy Meter */}
            <PersonaEnergyMeter 
              persona={selectedPersona}
              lyrics={lyrics}
              className="w-full"
              showDetails={true}
              animateOnChange={true}
            />

            {/* Analysis History */}
            {analysisHistory.length > 0 && (
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="h-5 w-5 text-[#00BCD4]" />
                    Energy History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {analysisHistory.slice(-5).reverse().map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded text-sm">
                        <div className="flex-1">
                          <div className="text-gray-300">{entry.lyricsSample}</div>
                          <div className="text-xs text-gray-500">
                            {entry.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {entry.energy}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Tips and Information */}
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#FFC107]" />
              Energy Analysis Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-[#FF4081] mb-2">High Energy Indicators</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Power words (fire, explosive, intense)</li>
                  <li>• Exclamation marks (!)</li>
                  <li>• ALL CAPS text</li>
                  <li>• Fast-paced rhythm</li>
                  <li>• Action verbs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-[#AB47BC] mb-2">Emotional Factors</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Emotional vocabulary</li>
                  <li>• Personal expressions</li>
                  <li>• Storytelling elements</li>
                  <li>• Metaphors and imagery</li>
                  <li>• Repetitive patterns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-[#3F51B5] mb-2">Technical Elements</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Rhyme complexity</li>
                  <li>• Syllable density</li>
                  <li>• Word diversity</li>
                  <li>• Flow patterns</li>
                  <li>• Structure variety</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedPageLayout>
  );
}