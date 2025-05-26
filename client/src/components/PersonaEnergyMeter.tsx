import React, { useState, useEffect } from 'react';
import { Progress } from './ui/progress';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Persona } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Zap, TrendingUp, Activity, Flame } from 'lucide-react';

interface PersonaEnergyMeterProps {
  persona: Persona | null;
  lyrics: string;
  className?: string;
  showDetails?: boolean;
  animateOnChange?: boolean;
}

export default function PersonaEnergyMeter({ 
  persona, 
  lyrics, 
  className, 
  showDetails = true,
  animateOnChange = true 
}: PersonaEnergyMeterProps) {
  const [displayedEnergy, setDisplayedEnergy] = useState(0);
  
  // Enhanced energy calculation with more sophisticated analysis
  const energyAnalysis = React.useMemo(() => {
    if (!persona || !lyrics) return { 
      level: 50, 
      factors: [], 
      intensity: 'Balanced',
      rhymeComplexity: 0,
      wordDiversity: 0,
      emotionalIntensity: 0
    };
    
    // Base energy levels per persona type (expanded)
    const baseEnergyMap: Record<string, number> = {
      'kendrick': 85,
      'drake': 65,
      'future': 80,
      'jcole': 70,
      'travis': 85,
      'nicki': 90,
      'outkast': 80,
      'eminem': 95,
      'jayz': 75,
      'kanye': 80,
      'nas': 75,
      'biggie': 70,
      'tupac': 85,
      'rock-classic': 75,
      'rock-punk': 95,
      'rock-indie': 65,
      'electronic-edm': 85,
      'electronic-ambient': 40,
      'electronic-techno': 90,
      'pop-mainstream': 70,
      'pop-indie': 60,
      'rnb-classic': 55,
      'rnb-modern': 65,
      'country': 45,
      'jazz': 50,
      'folk': 35,
      'metal': 100,
    };
    
    let energy = baseEnergyMap[persona.id] || 50;
    const factors: string[] = [];
    
    // Analyze lyrics content
    const words = lyrics.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const uniqueWords = new Set(words);
    
    // High energy indicators
    const highEnergyWords = [
      'fire', 'lit', 'hype', 'bang', 'hit', 'jump', 'rage', 'wild', 'crazy',
      'hard', 'fast', 'loud', 'beast', 'smash', 'crash', 'blast', 'power',
      'fight', 'drop', 'beat', 'burn', 'intense', 'extreme', 'savage', 'kill',
      'murder', 'destroy', 'explode', 'bomb', 'sick', 'insane', 'mad', 'fierce'
    ];
    
    // Low energy indicators
    const lowEnergyWords = [
      'slow', 'calm', 'peace', 'chill', 'relax', 'quiet', 'soft', 'gentle',
      'flow', 'dream', 'sleep', 'float', 'smooth', 'easy', 'light', 'mellow',
      'subtle', 'tender', 'mild', 'serene', 'whisper', 'breath', 'silence'
    ];
    
    // Emotional intensity words
    const emotionalWords = [
      'love', 'hate', 'pain', 'joy', 'anger', 'passion', 'heart', 'soul',
      'cry', 'laugh', 'scream', 'feel', 'emotion', 'deep', 'real', 'truth'
    ];
    
    // Calculate various metrics
    let energyAdjustment = 0;
    let highEnergyCount = 0;
    let lowEnergyCount = 0;
    let emotionalCount = 0;
    
    words.forEach(word => {
      if (highEnergyWords.includes(word)) {
        energyAdjustment += 3;
        highEnergyCount++;
      }
      if (lowEnergyWords.includes(word)) {
        energyAdjustment -= 2;
        lowEnergyCount++;
      }
      if (emotionalWords.includes(word)) {
        emotionalCount++;
      }
    });
    
    // Count special characters and patterns
    const exclamationCount = (lyrics.match(/!/g) || []).length;
    const questionCount = (lyrics.match(/\?/g) || []).length;
    const capsCount = (lyrics.match(/[A-Z]{2,}/g) || []).length;
    const repeatCount = (lyrics.match(/(.)\1{2,}/g) || []).length;
    
    // Rhyme complexity estimation
    const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
    const rhymeComplexity = Math.min(100, lines.length * 10 + repeatCount * 5);
    
    // Word diversity
    const wordDiversity = Math.min(100, (uniqueWords.size / Math.max(words.length, 1)) * 100);
    
    // Emotional intensity
    const emotionalIntensity = Math.min(100, (emotionalCount / Math.max(words.length, 1)) * 500);
    
    // Apply adjustments
    energyAdjustment += exclamationCount * 4;
    energyAdjustment += questionCount * 2;
    energyAdjustment += capsCount * 3;
    energyAdjustment += repeatCount * 2;
    
    // Factor analysis
    if (highEnergyCount > 0) factors.push(`High-energy words: ${highEnergyCount}`);
    if (lowEnergyCount > 0) factors.push(`Calming words: ${lowEnergyCount}`);
    if (exclamationCount > 0) factors.push(`Exclamations: ${exclamationCount}`);
    if (capsCount > 0) factors.push(`Emphasis: ${capsCount}`);
    if (emotionalCount > 0) factors.push(`Emotional words: ${emotionalCount}`);
    
    const finalEnergy = Math.max(0, Math.min(100, energy + energyAdjustment));
    
    // Determine intensity label
    let intensity: string;
    if (finalEnergy < 25) intensity = 'Calm';
    else if (finalEnergy < 50) intensity = 'Mellow';
    else if (finalEnergy < 70) intensity = 'Balanced';
    else if (finalEnergy < 85) intensity = 'Energetic';
    else if (finalEnergy < 95) intensity = 'Intense';
    else intensity = 'Explosive';
    
    return {
      level: finalEnergy,
      factors,
      intensity,
      rhymeComplexity,
      wordDiversity,
      emotionalIntensity
    };
  }, [persona, lyrics]);
  
  // Animate energy level changes
  useEffect(() => {
    if (animateOnChange) {
      const timer = setTimeout(() => {
        setDisplayedEnergy(energyAnalysis.level);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayedEnergy(energyAnalysis.level);
    }
  }, [energyAnalysis.level, animateOnChange]);
  
  // Get energy color and icon based on level
  const getEnergyStyle = (level: number) => {
    if (level < 25) return { 
      color: 'from-[#3F51B5] to-[#AB47BC]', 
      icon: Activity, 
      bg: 'bg-[#3F51B5]/10',
      text: 'text-[#3F51B5]'
    };
    if (level < 50) return { 
      color: 'from-[#AB47BC] to-[#FF4081]', 
      icon: TrendingUp, 
      bg: 'bg-[#AB47BC]/10',
      text: 'text-[#AB47BC]'
    };
    if (level < 70) return { 
      color: 'from-[#FF4081] to-[#FFC107]', 
      icon: Zap, 
      bg: 'bg-[#FF4081]/10',
      text: 'text-[#FF4081]'
    };
    if (level < 85) return { 
      color: 'from-[#FFC107] to-[#FF4081]', 
      icon: Zap, 
      bg: 'bg-[#FFC107]/10',
      text: 'text-[#FFC107]'
    };
    return { 
      color: 'from-[#FF4081] via-[#FFC107] to-[#FF4081]', 
      icon: Flame, 
      bg: 'bg-gradient-to-r from-[#FF4081]/10 to-[#FFC107]/10',
      text: 'text-[#FF4081]'
    };
  };
  
  const energyStyle = getEnergyStyle(displayedEnergy);
  const IconComponent = energyStyle.icon;
  
  return (
    <Card className={cn("musaix-card-border bg-black/50", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconComponent className={`h-5 w-5 ${energyStyle.text}`} />
              <span className="font-semibold text-white">Energy Meter</span>
            </div>
            <Badge className={`${energyStyle.bg} ${energyStyle.text} border-current`}>
              {energyAnalysis.intensity}
            </Badge>
          </div>
          
          {/* Main Energy Display */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-2xl font-bold musaix-gradient-text">
                {Math.round(displayedEnergy)}%
              </span>
              <span className="text-sm text-gray-400">
                {persona?.name || 'No Persona'}
              </span>
            </div>
            
            {/* Energy Bar with Musaix Gradient */}
            <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${energyStyle.color} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: `${displayedEnergy}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30" />
            </div>
            
            {/* Energy Scale */}
            <div className="flex justify-between text-xs text-gray-400">
              <span>Calm</span>
              <span>Mellow</span>
              <span>Balanced</span>
              <span>Energetic</span>
              <span>Intense</span>
            </div>
          </div>
          
          {/* Detailed Analysis */}
          {showDetails && (
            <div className="space-y-3 pt-4 border-t border-gray-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm font-medium text-[#FF4081]">
                    {Math.round(energyAnalysis.rhymeComplexity)}%
                  </div>
                  <div className="text-xs text-gray-400">Complexity</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-[#AB47BC]">
                    {Math.round(energyAnalysis.wordDiversity)}%
                  </div>
                  <div className="text-xs text-gray-400">Diversity</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-[#FFC107]">
                    {Math.round(energyAnalysis.emotionalIntensity)}%
                  </div>
                  <div className="text-xs text-gray-400">Emotion</div>
                </div>
              </div>
              
              {/* Energy Factors */}
              {energyAnalysis.factors.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-gray-300">Energy Factors:</div>
                  <div className="flex flex-wrap gap-1">
                    {energyAnalysis.factors.slice(0, 3).map((factor, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-gray-800 text-gray-300 rounded">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}