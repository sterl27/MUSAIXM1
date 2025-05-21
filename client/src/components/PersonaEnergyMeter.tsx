import React from 'react';
import { Progress } from './ui/progress';
import { Persona } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PersonaEnergyMeterProps {
  persona: Persona | null;
  lyrics: string;
  className?: string;
}

export default function PersonaEnergyMeter({ persona, lyrics, className }: PersonaEnergyMeterProps) {
  // Calculate energy level based on persona and lyrics content
  const energyLevel = React.useMemo(() => {
    if (!persona || !lyrics) return 50; // Default level
    
    // Base energy levels per persona type
    const baseEnergyMap: Record<string, number> = {
      'kendrick': 75,
      'drake': 60,
      'future': 80,
      'jcole': 65,
      'travis': 85,
      'nicki': 90,
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
    
    // Base energy for this persona
    let energy = baseEnergyMap[persona.id] || 50;
    
    // Analyze lyrics content for energy indicators
    const words = lyrics.toLowerCase().split(/\s+/);
    
    // High energy words
    const highEnergyWords = [
      'fire', 'lit', 'hype', 'bang', 'hit', 'jump', 'rage', 'wild', 'crazy',
      'hard', 'fast', 'loud', 'beast', 'smash', 'crash', 'blast', 'power',
      'fight', 'drop', 'beat', 'burn', 'intense', 'extreme', 'savage'
    ];
    
    // Low energy words
    const lowEnergyWords = [
      'slow', 'calm', 'peace', 'chill', 'relax', 'quiet', 'soft', 'gentle',
      'flow', 'dream', 'sleep', 'float', 'smooth', 'easy', 'light', 'mellow',
      'subtle', 'tender', 'mild', 'serene'
    ];
    
    // Calculate adjustment based on words
    let energyAdjustment = 0;
    
    words.forEach(word => {
      if (highEnergyWords.includes(word)) energyAdjustment += 2;
      if (lowEnergyWords.includes(word)) energyAdjustment -= 2;
    });
    
    // Count exclamation marks
    const exclamationCount = (lyrics.match(/!/g) || []).length;
    energyAdjustment += exclamationCount * 3;
    
    // Cap the final energy between 0-100
    return Math.max(0, Math.min(100, energy + energyAdjustment));
  }, [persona, lyrics]);
  
  // Determine color based on energy level
  const meterColor = React.useMemo(() => {
    if (energyLevel < 30) return 'bg-blue-500'; // Calm, low energy
    if (energyLevel < 60) return 'bg-green-500'; // Moderate energy
    if (energyLevel < 85) return 'bg-amber-500'; // High energy
    return 'bg-red-500'; // Extreme energy
  }, [energyLevel]);
  
  const energyLabel = React.useMemo(() => {
    if (energyLevel < 30) return 'Calm';
    if (energyLevel < 60) return 'Balanced';
    if (energyLevel < 85) return 'Energetic';
    return 'Intense';
  }, [energyLevel]);
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Persona Energy</span>
        <span className="text-sm text-muted-foreground">{energyLabel}</span>
      </div>
      <Progress
        value={energyLevel}
        className="h-2"
        indicatorClassName={meterColor}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Calm</span>
        <span>Balanced</span>
        <span>Energetic</span>
        <span>Intense</span>
      </div>
    </div>
  );
}