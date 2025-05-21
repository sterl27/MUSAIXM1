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
    
    // Draw background circles
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.75, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.25, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw axis lines
    const characteristics = Object.keys(characteristicDescriptions);
    const angleStep = (Math.PI * 2) / characteristics.length;
    
    characteristics.forEach((key, i) => {
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
      
      ctx.fillStyle = darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(key.charAt(0).toUpperCase() + key.slice(1), labelX, labelY);
    });
    
    // Draw comparison data if available
    if (compareCharacteristics) {
      drawDataPoints(ctx, compareCharacteristics, centerX, centerY, radius, angleStep, 'rgba(150, 150, 150, 0.6)', true);
    }
    
    // Draw main data
    drawDataPoints(ctx, characteristics, centerX, centerY, radius, angleStep, 'rgba(56, 189, 248, 0.8)', false);
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
    const characteristics = Object.keys(data) as Array<keyof VocalCharacteristics>;
    
    ctx.beginPath();
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
    
    // Close the path
    const firstKey = characteristics[0];
    const firstValue = data[firstKey] / 10;
    const firstAngle = -Math.PI / 2; // Start at top
    const firstX = centerX + Math.cos(firstAngle) * radius * firstValue;
    const firstY = centerY + Math.sin(firstAngle) * radius * firstValue;
    ctx.lineTo(firstX, firstY);
    
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.4;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = color.replace('0.8', '1.0');
    ctx.lineWidth = isComparison ? 1 : 2;
    ctx.stroke();
    
    // Draw dots at each data point
    characteristics.forEach((key, i) => {
      const value = data[key] / 10; // Normalize to 0-1
      const angle = i * angleStep - Math.PI / 2; // Start at top
      const x = centerX + Math.cos(angle) * radius * value;
      const y = centerY + Math.sin(angle) * radius * value;
      
      ctx.beginPath();
      ctx.arc(x, y, isComparison ? 3 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isComparison 
        ? 'rgba(150, 150, 150, 0.9)' 
        : getColor(data[key]);
      ctx.fill();
      ctx.strokeStyle = darkMode ? '#ffffff' : '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  };

  return (
    <div className={`relative ${compact ? 'p-2' : 'p-4'} ${className}`}>
      {!compact && <h3 className="text-sm font-medium mb-3">Sound Signature</h3>}
      
      <div className={`grid grid-cols-5 gap-${compact ? '1' : '2'} mb-${compact ? '2' : '4'}`}>
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
                            backgroundColor: 'rgba(100, 100, 100, 0.6)',
                            boxShadow: '0 0 4px rgba(100, 100, 100, 0.4)'
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
                <TooltipContent side="top" className="max-w-[220px] p-3">
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
      
      {!compact && (
        <div className="text-xs text-muted-foreground mt-2">
          {comparePersona 
            ? `Comparing vocal characteristics of ${persona.name} (primary) with ${comparePersona.name} (secondary).`
            : `This visualization represents the vocal characteristics of ${persona.name}'s sound signature.`
          }
        </div>
      )}
    </div>
  );
}