import { useState, useEffect, useRef } from "react";
import { Persona } from "@/lib/types";
import { CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, BarChart3, Activity, Radio, RefreshCw } from "lucide-react";

// Vocal characteristics to visualize
interface VocalCharacteristics {
  pitch: number;      // Scale of 1-10, lower to higher
  richness: number;   // Scale of 1-10, thin to rich/full
  intensity: number;  // Scale of 1-10, soft to powerful
  clarity: number;    // Scale of 1-10, raspy to clear
  pace: number;       // Scale of 1-10, slow to fast
}

// Descriptions for each vocal characteristic
const characteristicDescriptions = {
  pitch: "The relative highness or lowness of a vocal tone. Lower values indicate deeper voices, higher values indicate higher-pitched voices.",
  richness: "The fullness and warmth of the vocal tone. Lower values sound thin or sparse, higher values have more depth and resonance.",
  intensity: "The perceived power and emotional force. Lower values sound gentle or reserved, higher values are more forceful and commanding.",
  clarity: "How clear and distinct the vocals sound. Lower values indicate more raspy or gritty vocals, higher values sound cleaner and more defined.",
  pace: "The tempo and rhythm of vocal delivery. Lower values indicate slower, more methodical delivery, higher values reflect faster flows or tempos."
}

interface SoundSignatureProps {
  persona: Persona;
  comparePersona?: Persona | null; // Optional persona to compare with
  lyrics?: string; // Optional lyrics that might influence the signature
  className?: string;
  showLabels?: boolean; // Whether to show labels below each bar
  compact?: boolean; // Whether to show a compact version of the visualization
  darkMode?: boolean; // Whether to use dark mode colors
  showViewToggle?: boolean; // Whether to show the view toggle option (bar chart vs radar)
}

export default function SoundSignature({ 
  persona, 
  comparePersona = null, 
  lyrics = "", 
  className = "",
  showLabels = true,
  compact = false,
  darkMode = false,
  showViewToggle = !compact
}: SoundSignatureProps) {
  const [characteristics, setCharacteristics] = useState<VocalCharacteristics>({
    pitch: 5,
    richness: 5,
    intensity: 5,
    clarity: 5,
    pace: 5
  });

  const [compareCharacteristics, setCompareCharacteristics] = useState<VocalCharacteristics | null>(null);
  const [viewMode, setViewMode] = useState<"bars" | "radar">("bars");
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Helper function to get base characteristics for a persona
  const getBaseCharacteristics = (personaId: string): VocalCharacteristics => {
    switch (personaId) {
      // Rap personas
      case "kendrick":
        return { pitch: 6, richness: 7, intensity: 8, clarity: 9, pace: 7 };
      case "drake":
        return { pitch: 5, richness: 6, intensity: 6, clarity: 8, pace: 6 };
      case "future":
        return { pitch: 4, richness: 8, intensity: 7, clarity: 4, pace: 6 };
      case "jcole":
        return { pitch: 5, richness: 7, intensity: 6, clarity: 8, pace: 5 };
      case "travis":
        return { pitch: 4, richness: 6, intensity: 7, clarity: 5, pace: 6 };
      case "nicki":
        return { pitch: 8, richness: 6, intensity: 9, clarity: 7, pace: 8 };
      case "outkast":
        return { pitch: 7, richness: 8, intensity: 8, clarity: 7, pace: 8 };
        
      // Rock personas
      case "rock-classic":
        return { pitch: 6, richness: 9, intensity: 9, clarity: 7, pace: 6 };
      case "rock-punk":
        return { pitch: 7, richness: 6, intensity: 10, clarity: 5, pace: 9 };
      case "rock-indie":
        return { pitch: 6, richness: 7, intensity: 6, clarity: 8, pace: 5 };
        
      // Electronic personas
      case "electronic-edm":
        return { pitch: 5, richness: 5, intensity: 8, clarity: 7, pace: 9 };
      case "electronic-ambient":
        return { pitch: 4, richness: 9, intensity: 4, clarity: 9, pace: 3 };
      case "electronic-techno":
        return { pitch: 5, richness: 6, intensity: 8, clarity: 6, pace: 10 };
        
      // Pop personas
      case "pop-mainstream":
        return { pitch: 7, richness: 7, intensity: 7, clarity: 9, pace: 7 };
      case "pop-indie":
        return { pitch: 6, richness: 6, intensity: 5, clarity: 8, pace: 5 };
        
      // R&B personas
      case "rnb-classic":
        return { pitch: 6, richness: 9, intensity: 6, clarity: 8, pace: 4 };
      case "rnb-modern":
        return { pitch: 7, richness: 8, intensity: 7, clarity: 8, pace: 6 };
        
      // Default/fallback
      default:
        return { pitch: 5, richness: 5, intensity: 5, clarity: 5, pace: 5 };
    }
  };
  
  // Calculate vocal characteristics based on persona
  useEffect(() => {
    // Get base characteristics
    const baseCharacteristics = getBaseCharacteristics(persona.id);
    
    // Adjust based on lyrics if provided
    if (lyrics) {
      // Create a copy of the base characteristics
      const adjustedCharacteristics = { ...baseCharacteristics };
      
      // Apply simple adjustments based on lyrics content
      const lowerCaseLyrics = lyrics.toLowerCase();

      // Intensity adjustment - check for exclamation marks or intensity words
      if (lyrics.includes("!") || 
          lowerCaseLyrics.includes("fire") || 
          lowerCaseLyrics.includes("strong") ||
          lowerCaseLyrics.includes("power")) {
        adjustedCharacteristics.intensity = Math.min(10, adjustedCharacteristics.intensity + 1);
      }
      
      // Pace adjustment - check for fast-paced indicators
      if (lowerCaseLyrics.includes("fast") || 
          lowerCaseLyrics.includes("quick") || 
          lowerCaseLyrics.includes("rush")) {
        adjustedCharacteristics.pace = Math.min(10, adjustedCharacteristics.pace + 1);
      } else if (lowerCaseLyrics.includes("slow") || 
                lowerCaseLyrics.includes("calm") || 
                lowerCaseLyrics.includes("peaceful")) {
        adjustedCharacteristics.pace = Math.max(1, adjustedCharacteristics.pace - 1);
      }
      
      // Set the adjusted characteristics
      setCharacteristics(adjustedCharacteristics);
    } else {
      // If no lyrics, just use the base characteristics
      setCharacteristics(baseCharacteristics);
    }
  }, [persona.id, lyrics]);
  
  // Calculate characteristics for comparison persona if provided
  useEffect(() => {
    if (comparePersona) {
      const compareCharacteristics = getBaseCharacteristics(comparePersona.id);
      setCompareCharacteristics(compareCharacteristics);
    } else {
      setCompareCharacteristics(null);
    }
  }, [comparePersona]);

  // Function to get color based on value
  const getColor = (value: number): string => {
    // Color gradient from blue (cool) to red (hot)
    const hue = Math.max(0, Math.min(240 - (value - 1) * 24, 240));
    return `hsl(${hue}, ${darkMode ? '80%' : '100%'}, ${darkMode ? '60%' : '50%'})`;
  };
  
  // Function to draw the radar chart
  const drawRadarChart = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    // Create the characteristic keys in the right order
    const orderedKeys: (keyof VocalCharacteristics)[] = ['pitch', 'richness', 'intensity', 'clarity', 'pace'];
    const angleStep = (Math.PI * 2) / orderedKeys.length;
    
    // Draw background shape - gray pentagon
    ctx.beginPath();
    orderedKeys.forEach((_, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start at top
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fillStyle = darkMode ? 'rgba(60, 60, 60, 0.1)' : 'rgba(240, 240, 240, 0.8)';
    ctx.fill();
    
    // Draw background circles
    [0.25, 0.5, 0.75, 1].forEach(factor => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * factor, 0, Math.PI * 2);
      ctx.strokeStyle = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      ctx.stroke();
    });
    
    // Draw axis lines
    orderedKeys.forEach((key, i) => {
      const angle = i * angleStep - Math.PI / 2; // Start at top
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
      ctx.stroke();
      
      // Draw axis labels
      const labelX = centerX + Math.cos(angle) * (radius + 15);
      const labelY = centerY + Math.sin(angle) * (radius + 15);
      
      ctx.fillStyle = darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(key.charAt(0).toUpperCase() + key.slice(1), labelX, labelY);
      
      // Draw small dots at each scale position
      [0.25, 0.5, 0.75].forEach(factor => {
        const dotX = centerX + Math.cos(angle) * radius * factor;
        const dotY = centerY + Math.sin(angle) * radius * factor;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 1, 0, Math.PI * 2);
        ctx.fillStyle = darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
        ctx.fill();
      });
    });
    
    // Draw comparison data if available
    if (compareCharacteristics) {
      drawDataPoints(ctx, compareCharacteristics, centerX, centerY, radius, angleStep, 'rgba(150, 150, 150, 0.75)', true);
    }
    
    // Draw main data for the persona
    drawDataPoints(ctx, characteristics, centerX, centerY, radius, angleStep, 'rgba(56, 189, 248, 0.9)', false);
  };
  
  // Function to draw data points on the radar chart
  const drawDataPoints = (
    ctx: CanvasRenderingContext2D, 
    data: VocalCharacteristics,
    centerX: number,
    centerY: number,
    radius: number,
    angleStep: number,
    color: string,
    isComparison = false
  ) => {
    // Get the characteristic keys in the correct order
    const characteristics: Array<keyof VocalCharacteristics> = ['pitch', 'richness', 'intensity', 'clarity', 'pace'];
    
    // Start the path
    ctx.beginPath();
    
    // Draw the shape connecting all data points
    characteristics.forEach((key, i) => {
      const value = data[key] / 10; // Normalize to 0-1
      const angle = i * angleStep - Math.PI / 2; // Start at top
      const x = centerX + Math.cos(angle) * radius * value;
      const y = centerY + Math.sin(angle) * radius * value;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    // Close the shape
    const firstKey = characteristics[0];
    const firstValue = data[firstKey] / 10;
    const firstAngle = -Math.PI / 2; // Start at top
    const firstX = centerX + Math.cos(firstAngle) * radius * firstValue;
    const firstY = centerY + Math.sin(firstAngle) * radius * firstValue;
    ctx.lineTo(firstX, firstY);
    
    // Fill the shape with semi-transparent color
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    
    // Outline the shape
    ctx.strokeStyle = color.replace('0.8', '1.0').replace('0.6', '0.8');
    ctx.lineWidth = isComparison ? 1 : 2;
    ctx.stroke();
    
    // Draw dots at each data point with glow effect
    characteristics.forEach((key, i) => {
      const value = data[key] / 10; // Normalize to 0-1
      const angle = i * angleStep - Math.PI / 2; // Start at top
      const x = centerX + Math.cos(angle) * radius * value;
      const y = centerY + Math.sin(angle) * radius * value;
      
      // Draw glow effect
      if (!isComparison) {
        const dotColor = getColor(data[key]);
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = dotColor.replace(')', ', 0.3)').replace('hsl', 'hsla');
        ctx.fill();
      }
      
      // Draw the dot
      ctx.beginPath();
      ctx.arc(x, y, isComparison ? 3 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isComparison 
        ? 'rgba(150, 150, 150, 0.9)' 
        : getColor(data[key]);
      ctx.fill();
      
      // Add white outline to make dots stand out
      ctx.strokeStyle = darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  // Effect to update radar chart when data changes
  useEffect(() => {
    if (viewMode === "radar" && !compact) {
      requestAnimationFrame(() => drawRadarChart());
    }
  }, [characteristics, compareCharacteristics, viewMode, darkMode, compact]);
  
  // Handle animation when switching personas or view modes
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <div className={`relative ${compact ? 'p-2' : 'p-4'} ${className} ${darkMode ? 'bg-gray-900 text-white' : ''}`}>
      {!compact && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium">Sound Signature</h3>
          
          {showViewToggle && (
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant={viewMode === "bars" ? "default" : "outline"} 
                className="h-8 px-2 py-1"
                onClick={() => {
                  setViewMode("bars");
                  setIsAnimating(true);
                }}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="text-xs">Bars</span>
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === "radar" ? "default" : "outline"} 
                className="h-8 px-2 py-1"
                onClick={() => {
                  setViewMode("radar");
                  setIsAnimating(true);
                  // Need to slightly delay drawing to ensure canvas is mounted
                  setTimeout(() => drawRadarChart(), 50);
                }}
              >
                <Activity className="h-4 w-4 mr-1" />
                <span className="text-xs">Radar</span>
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Bar Chart View */}
      {viewMode === "bars" && (
        <div className={`grid grid-cols-5 gap-${compact ? '1' : '2'} mb-${compact ? '2' : '4'} transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          {Object.entries(characteristics).map(([key, value]) => {
            const characteristicKey = key as keyof VocalCharacteristics;
            const compareValue = compareCharacteristics ? compareCharacteristics[characteristicKey] : null;
            
            return (
              <TooltipProvider key={key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center group">
                      <div className="flex items-end h-[65px] justify-center">
                        {/* Compare bar (if a comparison persona is provided) */}
                        {compareValue !== null && (
                          <div
                            className="w-2 rounded-full transition-all duration-300 mr-1 opacity-70"
                            style={{
                              height: `${compareValue * 6}px`,
                              backgroundColor: darkMode ? 'rgba(180, 180, 180, 0.6)' : 'rgba(100, 100, 100, 0.6)',
                              boxShadow: darkMode ? '0 0 4px rgba(180, 180, 180, 0.4)' : '0 0 4px rgba(100, 100, 100, 0.4)'
                            }}
                          ></div>
                        )}
                        
                        {/* Main persona bar */}
                        <div
                          className="w-4 rounded-full transition-all duration-300 group-hover:scale-110"
                          style={{
                            height: `${value * 6}px`,
                            backgroundColor: getColor(value),
                            boxShadow: `0 0 8px ${getColor(value)}80`
                          }}
                        ></div>
                      </div>
                      
                      {showLabels && (
                        <>
                          <span className="text-xs mt-2 capitalize">{key}</span>
                          <span className="text-xs text-muted-foreground">{value}/10</span>
                        </>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className={`max-w-[220px] p-3 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : ''}`}>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium capitalize">{key}</span>
                      <p className="text-xs">{characteristicDescriptions[key as keyof typeof characteristicDescriptions]}</p>
                      <div className="text-xs mt-1">
                        <strong>{persona.name}:</strong> {value}/10
                        {compareValue !== null && comparePersona && (
                          <div className="mt-1">
                            <strong>{comparePersona.name}:</strong> {compareValue}/10
                            <div className="text-xs mt-1">
                              {compareValue > value
                                ? `${comparePersona.name} has ${compareValue - value} points higher ${key} than ${persona.name}.`
                                : compareValue < value
                                ? `${comparePersona.name} has ${value - compareValue} points lower ${key} than ${persona.name}.`
                                : `Both personas have the same ${key} level.`
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      )}
      
      {/* Radar Chart View */}
      {viewMode === "radar" && !compact && (
        <div className={`w-full flex justify-center transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          <div className="relative w-full max-w-[300px] aspect-square">
            <canvas 
              ref={canvasRef} 
              width={300} 
              height={300} 
              className="w-full h-full"
            ></canvas>
            
            {/* Legend */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-4 mt-2">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: 'rgba(56, 189, 248, 0.8)' }}
                ></div>
                <span className="text-xs">{persona.name}</span>
              </div>
              
              {comparePersona && (
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-1" 
                    style={{ backgroundColor: 'rgba(150, 150, 150, 0.9)' }}
                  ></div>
                  <span className="text-xs">{comparePersona.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Info section */}
      {!compact && (
        <div className="flex items-center text-xs text-muted-foreground mt-4">
          <Info className="h-3 w-3 mr-1 inline" />
          {comparePersona 
            ? `Comparing vocal characteristics of ${persona.name} (primary) with ${comparePersona.name} (secondary).`
            : `This visualization represents the vocal characteristics that define ${persona.name}'s unique sound signature.`
          }
        </div>
      )}
      
      {/* Lyrics impact message if lyrics are provided */}
      {!compact && lyrics && (
        <div className="text-xs mt-2 text-primary italic">
          * The current lyrics have slightly modified the base sound signature based on content analysis.
        </div>
      )}
    </div>
  );
}