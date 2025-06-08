import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Persona } from '@/lib/types';
import { Activity, BarChart3, Zap, TrendingUp, Flame, Eye, EyeOff, Settings } from 'lucide-react';

interface LiveEnergyDashboardProps {
  lyrics: string;
  persona?: Persona | null;
  className?: string;
  isVisible?: boolean;
  onToggleVisibility?: (visible: boolean) => void;
  compact?: boolean;
}

interface EnergyMetrics {
  overall: number;
  wordPower: number;
  emotional: number;
  rhythm: number;
  complexity: number;
  intensity: string;
  trend: 'rising' | 'falling' | 'stable';
}

export default function LiveEnergyDashboard({ 
  lyrics, 
  persona, 
  className,
  isVisible = true,
  onToggleVisibility,
  compact = false
}: LiveEnergyDashboardProps) {
  const [metrics, setMetrics] = useState<EnergyMetrics>({
    overall: 0,
    wordPower: 0,
    emotional: 0,
    rhythm: 0,
    complexity: 0,
    intensity: 'Silent',
    trend: 'stable'
  });
  const [previousEnergy, setPreviousEnergy] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(!compact);

  // Real-time energy calculation
  useEffect(() => {
    if (!lyrics) {
      setMetrics({
        overall: 0,
        wordPower: 0,
        emotional: 0,
        rhythm: 0,
        complexity: 0,
        intensity: 'Silent',
        trend: 'stable'
      });
      return;
    }

    const calculateMetrics = (): EnergyMetrics => {
      const words = lyrics.toLowerCase().split(/\s+/).filter(w => w.length > 0);
      const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
      const uniqueWords = new Set(words);

      // High-energy word detection
      const powerWords = [
        'fire', 'blazing', 'explosive', 'intense', 'wild', 'crazy', 'mad', 'insane', 
        'savage', 'beast', 'rage', 'storm', 'thunder', 'lightning', 'power', 'strong',
        'hard', 'fast', 'loud', 'bang', 'crash', 'smash', 'hit', 'strike', 'attack',
        'fight', 'battle', 'war', 'kill', 'destroy', 'burn', 'flame', 'heat', 'hot',
        'boiling', 'explosive', 'electric', 'dynamic', 'fierce', 'brutal', 'raw'
      ];

      const emotionalWords = [
        'love', 'hate', 'pain', 'joy', 'anger', 'passion', 'heart', 'soul',
        'feel', 'emotion', 'deep', 'real', 'truth', 'cry', 'laugh', 'scream',
        'shout', 'tears', 'blood', 'dreams', 'hope', 'fear', 'desire', 'need'
      ];

      const rhythmWords = [
        'beat', 'drop', 'flow', 'rhythm', 'bounce', 'swing', 'move', 'dance',
        'jump', 'skip', 'slide', 'glide', 'step', 'stomp', 'clap', 'snap'
      ];

      // Calculate word power
      let wordPowerScore = 0;
      words.forEach(word => {
        if (powerWords.some(pw => word.includes(pw))) wordPowerScore += 15;
        if (word.length > 6) wordPowerScore += 2; // Longer words add complexity
        if (/^[A-Z]+$/.test(word) && word.length > 1) wordPowerScore += 10; // ALL CAPS
      });

      // Calculate emotional intensity
      let emotionalScore = 0;
      words.forEach(word => {
        if (emotionalWords.some(ew => word.includes(ew))) emotionalScore += 12;
      });

      // Calculate rhythm score
      let rhythmScore = 0;
      words.forEach(word => {
        if (rhythmWords.some(rw => word.includes(rw))) rhythmScore += 8;
      });

      // Punctuation energy
      const exclamations = (lyrics.match(/!/g) || []).length;
      const questions = (lyrics.match(/\?/g) || []).length;
      const caps = (lyrics.match(/[A-Z]{2,}/g) || []).length;
      const punctuationBonus = exclamations * 20 + questions * 10 + caps * 15;

      // Complexity calculation
      const wordDiversity = uniqueWords.size / Math.max(words.length, 1);
      const avgLineLength = words.length / Math.max(lines.length, 1);
      const rhymePatterns = lines.length > 1 ? lines.length * 10 : 0;
      
      // Final scores (normalized to 0-100)
      const wordPower = Math.min(100, (wordPowerScore + punctuationBonus) / Math.max(words.length / 10, 1));
      const emotional = Math.min(100, emotionalScore / Math.max(words.length / 15, 1));
      const rhythm = Math.min(100, rhythmScore / Math.max(words.length / 20, 1));
      const complexity = Math.min(100, (wordDiversity * 100 + avgLineLength * 5 + rhymePatterns) / 3);

      // Overall energy (weighted average)
      const overall = (wordPower * 0.3 + emotional * 0.25 + rhythm * 0.25 + complexity * 0.2);

      // Determine intensity level
      let intensity: string;
      if (overall < 20) intensity = 'Calm';
      else if (overall < 40) intensity = 'Mellow';
      else if (overall < 60) intensity = 'Balanced';
      else if (overall < 80) intensity = 'Energetic';
      else intensity = 'Explosive';

      // Determine trend
      let trend: 'rising' | 'falling' | 'stable' = 'stable';
      if (overall > previousEnergy + 5) trend = 'rising';
      else if (overall < previousEnergy - 5) trend = 'falling';

      return {
        overall: Math.round(overall),
        wordPower: Math.round(wordPower),
        emotional: Math.round(emotional),
        rhythm: Math.round(rhythm),
        complexity: Math.round(complexity),
        intensity,
        trend
      };
    };

    const newMetrics = calculateMetrics();
    setMetrics(newMetrics);
    setPreviousEnergy(newMetrics.overall);
  }, [lyrics, previousEnergy]);

  const getEnergyColor = (value: number) => {
    if (value < 25) return 'text-[#3F51B5]';
    if (value < 50) return 'text-[#AB47BC]';
    if (value < 75) return 'text-[#FF4081]';
    return 'text-[#FFC107]';
  };

  const getEnergyIcon = () => {
    if (metrics.overall < 25) return Activity;
    if (metrics.overall < 50) return TrendingUp;
    if (metrics.overall < 85) return Zap;
    return Flame;
  };

  const EnergyIcon = getEnergyIcon();

  const getTrendIcon = () => {
    switch (metrics.trend) {
      case 'rising': return '↗️';
      case 'falling': return '↘️';
      default: return '→';
    }
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => onToggleVisibility?.(true)}
        className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur border-[#FF4081]/30"
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Show Energy
      </Button>
    );
  }

  return (
    <Card className={cn(
      "musaix-card-border bg-black/90 backdrop-blur border-[#FF4081]/30",
      compact ? "max-w-sm" : "w-full",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <EnergyIcon className={`h-5 w-5 ${getEnergyColor(metrics.overall)}`} />
            <span className="text-sm">Live Energy</span>
            <span className="text-xs">{getTrendIcon()}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-[#FF4081] to-[#AB47BC] text-white text-xs">
              {metrics.intensity}
            </Badge>
            {onToggleVisibility && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleVisibility(false)}
                className="h-6 w-6 p-0"
              >
                <EyeOff className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Main Energy Display */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${getEnergyColor(metrics.overall)}`}>
            {metrics.overall}%
          </div>
          <div className="text-xs text-gray-400">Overall Energy</div>
        </div>

        {/* Energy Bar */}
        <div className="relative">
          <Progress 
            value={metrics.overall} 
            className="h-3 bg-gray-800"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30 rounded-full" />
        </div>

        {/* Compact vs Detailed View */}
        {!compact && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">Advanced</span>
            <Switch
              checked={showAdvanced}
              onCheckedChange={setShowAdvanced}
              className="scale-75"
            />
          </div>
        )}

        {/* Advanced Metrics */}
        {showAdvanced && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">Word Power</span>
                <span className={getEnergyColor(metrics.wordPower)}>{metrics.wordPower}%</span>
              </div>
              <Progress value={metrics.wordPower} className="h-1" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">Emotional</span>
                <span className={getEnergyColor(metrics.emotional)}>{metrics.emotional}%</span>
              </div>
              <Progress value={metrics.emotional} className="h-1" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">Rhythm</span>
                <span className={getEnergyColor(metrics.rhythm)}>{metrics.rhythm}%</span>
              </div>
              <Progress value={metrics.rhythm} className="h-1" />
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">Complexity</span>
                <span className={getEnergyColor(metrics.complexity)}>{metrics.complexity}%</span>
              </div>
              <Progress value={metrics.complexity} className="h-1" />
            </div>
          </div>
        )}

        {/* Persona Context */}
        {persona && (
          <div className="pt-2 border-t border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{persona.icon}</span>
              <span>{persona.name} style</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}