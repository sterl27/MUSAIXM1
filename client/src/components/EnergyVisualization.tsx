import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Activity, Zap, TrendingUp, Flame } from 'lucide-react';

interface EnergyVisualizationProps {
  energy: number;
  intensity: string;
  breakdown: {
    wordEnergy: number;
    emotionalIntensity: number;
    punctuationEnergy: number;
    rhymeComplexity: number;
    flowDensity: number;
  };
  className?: string;
  animated?: boolean;
}

export default function EnergyVisualization({ 
  energy, 
  intensity, 
  breakdown, 
  className,
  animated = true 
}: EnergyVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Dynamic energy visualization with wave patterns
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !animated) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Create gradient based on energy level
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      if (energy < 25) {
        gradient.addColorStop(0, 'rgba(63, 81, 181, 0.3)');
        gradient.addColorStop(1, 'rgba(171, 71, 188, 0.1)');
      } else if (energy < 50) {
        gradient.addColorStop(0, 'rgba(171, 71, 188, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 64, 129, 0.1)');
      } else if (energy < 70) {
        gradient.addColorStop(0, 'rgba(255, 64, 129, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 193, 7, 0.1)');
      } else {
        gradient.addColorStop(0, 'rgba(255, 64, 129, 0.4)');
        gradient.addColorStop(0.5, 'rgba(255, 193, 7, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 64, 129, 0.1)');
      }
      
      // Draw energy waves
      const frequency = Math.max(0.5, energy / 50);
      const amplitude = Math.max(10, energy / 2);
      
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      
      for (let x = 0; x <= width; x += 2) {
        const wave1 = Math.sin((x / 50 + elapsed * frequency)) * amplitude;
        const wave2 = Math.sin((x / 30 + elapsed * frequency * 1.5)) * (amplitude * 0.5);
        const wave3 = Math.sin((x / 80 + elapsed * frequency * 0.8)) * (amplitude * 0.3);
        const y = height / 2 + wave1 + wave2 + wave3;
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add particle effects for high energy
      if (energy > 70) {
        const particleCount = Math.floor(energy / 10);
        for (let i = 0; i < particleCount; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 3 + 1;
          const alpha = Math.random() * 0.6 + 0.2;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 193, 7, ${alpha})`;
          ctx.fill();
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [energy, animated]);

  const getEnergyIcon = () => {
    if (energy < 25) return Activity;
    if (energy < 50) return TrendingUp;
    if (energy < 85) return Zap;
    return Flame;
  };

  const EnergyIcon = getEnergyIcon();

  const getEnergyColor = () => {
    if (energy < 25) return 'text-[#3F51B5]';
    if (energy < 50) return 'text-[#AB47BC]';
    if (energy < 70) return 'text-[#FF4081]';
    return 'text-[#FFC107]';
  };

  return (
    <Card className={cn("musaix-card-border bg-black/50 overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EnergyIcon className={`h-5 w-5 ${getEnergyColor()}`} />
            <span className="text-white">Energy Visualization</span>
          </div>
          <Badge className="bg-gradient-to-r from-[#FF4081] to-[#AB47BC] text-white">
            {intensity}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {/* Energy Level Display */}
        <div className="text-center mb-4">
          <div className="text-4xl font-bold musaix-gradient-text mb-2">
            {Math.round(energy)}%
          </div>
          <div className="text-sm text-gray-400">Creative Intensity</div>
        </div>

        {/* Canvas Visualization */}
        <div className="relative mb-4">
          <canvas 
            ref={canvasRef}
            className="w-full h-24 rounded-lg"
            style={{ display: animated ? 'block' : 'none' }}
          />
          {!animated && (
            <div className="h-24 bg-gradient-to-r from-[#3F51B5]/20 via-[#AB47BC]/20 to-[#FF4081]/20 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Static Mode</span>
            </div>
          )}
        </div>

        {/* Energy Breakdown Bars */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">Word Energy</span>
            <span className={getEnergyColor()}>{Math.round(breakdown.wordEnergy)}%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#FF4081] to-[#FFC107] rounded-full transition-all duration-1000"
              style={{ width: `${breakdown.wordEnergy}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">Emotional Intensity</span>
            <span className="text-[#AB47BC]">{Math.round(breakdown.emotionalIntensity)}%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#AB47BC] to-[#FF4081] rounded-full transition-all duration-1000"
              style={{ width: `${breakdown.emotionalIntensity}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-gray-300">Flow Density</span>
            <span className="text-[#3F51B5]">{Math.round(breakdown.flowDensity)}%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#3F51B5] to-[#AB47BC] rounded-full transition-all duration-1000"
              style={{ width: `${breakdown.flowDensity}%` }}
            />
          </div>
        </div>

        {/* Energy Pulse Ring */}
        <div className="flex justify-center mt-4">
          <div className="relative">
            <div 
              className={`w-16 h-16 rounded-full border-4 ${
                energy > 70 ? 'border-[#FFC107]' : 
                energy > 50 ? 'border-[#FF4081]' : 
                energy > 25 ? 'border-[#AB47BC]' : 'border-[#3F51B5]'
              } animate-pulse`}
              style={{ 
                animationDuration: `${Math.max(0.5, 2 - energy / 50)}s`,
                opacity: 0.7 + (energy / 100) * 0.3 
              }}
            />
            <div className="absolute inset-2 bg-gradient-to-br from-[#FF4081]/20 to-[#AB47BC]/20 rounded-full flex items-center justify-center">
              <EnergyIcon className={`h-6 w-6 ${getEnergyColor()}`} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}