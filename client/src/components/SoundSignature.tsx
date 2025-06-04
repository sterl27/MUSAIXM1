import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  Radar, 
  Volume2, 
  Mic, 
  Music,
  Waves,
  Activity,
  Info
} from "lucide-react";

interface VocalCharacteristics {
  pitch: number;      // Scale of 1-10, lower to higher
  richness: number;   // Scale of 1-10, thin to rich/full
  intensity: number;  // Scale of 1-10, soft to powerful
  clarity: number;    // Scale of 1-10, raspy to clear
  pace: number;       // Scale of 1-10, slow to fast
}

interface SoundSignatureProps {
  artistProfile?: {
    artistName?: string;
    genre?: string;
    influences?: string;
    style?: string;
  };
  lyrics?: string; // Optional lyrics that might influence the signature
  className?: string;
  showLabels?: boolean; // Whether to show labels below each bar
  compact?: boolean; // Whether to show a compact version of the visualization
  darkMode?: boolean; // Whether to use dark mode colors
  showViewToggle?: boolean; // Whether to show the view toggle option (bar chart vs radar)
}

const characteristicLabels = {
  pitch: { name: "Pitch Range", low: "Deep/Low", high: "High/Bright", icon: <Volume2 className="h-4 w-4" /> },
  richness: { name: "Vocal Richness", low: "Thin/Sharp", high: "Full/Warm", icon: <Music className="h-4 w-4" /> },
  intensity: { name: "Vocal Power", low: "Soft/Gentle", high: "Intense/Strong", icon: <Activity className="h-4 w-4" /> },
  clarity: { name: "Voice Clarity", low: "Raspy/Rough", high: "Clear/Crisp", icon: <Mic className="h-4 w-4" /> },
  pace: { name: "Delivery Speed", low: "Slow/Deliberate", high: "Fast/Rapid", icon: <Waves className="h-4 w-4" /> },
};

export default function SoundSignature({ 
  artistProfile,
  lyrics,
  className = "",
  showLabels = true,
  compact = false,
  darkMode = true,
  showViewToggle = true
}: SoundSignatureProps) {
  const [viewMode, setViewMode] = useState<'bar' | 'radar'>('bar');
  const [characteristics, setCharacteristics] = useState<VocalCharacteristics>({
    pitch: 5,
    richness: 5,
    intensity: 5,
    clarity: 5,
    pace: 5,
  });

  const getBaseCharacteristics = (profile: any): VocalCharacteristics => {
    const genre = profile?.genre?.toLowerCase() || '';
    const influences = profile?.influences?.toLowerCase() || '';
    const style = profile?.style?.toLowerCase() || '';
    
    // Start with baseline
    let baseChar: VocalCharacteristics = {
      pitch: 5,
      richness: 5,
      intensity: 5,
      clarity: 5,
      pace: 5,
    };
    
    // Genre-based adjustments
    if (genre.includes('rap') || genre.includes('hip-hop')) {
      baseChar.clarity = 8;
      baseChar.pace = 7;
      baseChar.intensity = 6;
    } else if (genre.includes('jazz') || genre.includes('soul')) {
      baseChar.richness = 8;
      baseChar.pitch = 6;
      baseChar.intensity = 7;
    } else if (genre.includes('rock') || genre.includes('metal')) {
      baseChar.intensity = 9;
      baseChar.pitch = 7;
      baseChar.clarity = 6;
    } else if (genre.includes('folk') || genre.includes('acoustic')) {
      baseChar.richness = 7;
      baseChar.clarity = 8;
      baseChar.intensity = 4;
    }
    
    // Influence-based adjustments
    if (influences.includes('kendrick') || influences.includes('cole')) {
      baseChar.clarity += 1;
      baseChar.pace += 1;
    }
    if (influences.includes('drake') || influences.includes('weeknd')) {
      baseChar.richness += 1;
      baseChar.pitch += 1;
    }
    if (influences.includes('eminem') || influences.includes('tech')) {
      baseChar.pace += 2;
      baseChar.clarity += 1;
    }
    
    // Style-based adjustments
    if (style.includes('melodic') || style.includes('smooth')) {
      baseChar.richness += 1;
      baseChar.clarity += 1;
    }
    if (style.includes('aggressive') || style.includes('hard')) {
      baseChar.intensity += 1;
      baseChar.pace += 1;
    }
    if (style.includes('emotional') || style.includes('deep')) {
      baseChar.richness += 1;
      baseChar.intensity += 1;
    }
    
    // Normalize values between 1-10
    Object.keys(baseChar).forEach(key => {
      const typedKey = key as keyof VocalCharacteristics;
      baseChar[typedKey] = Math.min(10, Math.max(1, baseChar[typedKey]));
    });
    
    return baseChar;
  };

  useEffect(() => {
    if (artistProfile) {
      const generated = getBaseCharacteristics(artistProfile);
      setCharacteristics(generated);
    }
  }, [artistProfile]);

  const RadarChart = ({ data }: { data: VocalCharacteristics }) => {
    const size = compact ? 200 : 300;
    const center = size / 2;
    const radius = center - 40;
    
    const characteristics = Object.entries(data);
    const angleStep = (2 * Math.PI) / characteristics.length;
    
    // Calculate points for the radar
    const points = characteristics.map(([_, value], index) => {
      const angle = index * angleStep - Math.PI / 2;
      const r = (value / 10) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
      };
    });
    
    const pathString = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';
    
    return (
      <div className="flex justify-center">
        <svg width={size} height={size} className="border border-gray-600 rounded-lg bg-gray-900">
          {/* Background grid */}
          {[1, 2, 3, 4, 5].map(level => (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={(level / 5) * radius}
              fill="none"
              stroke="#374151"
              strokeWidth="1"
            />
          ))}
          
          {/* Axes */}
          {characteristics.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={index}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#374151"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Data area */}
          <path
            d={pathString}
            fill="#FF4081"
            fillOpacity="0.3"
            stroke="#FF4081"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#FF4081"
            />
          ))}
          
          {/* Labels */}
          {characteristics.map(([char, _], index) => {
            const angle = index * angleStep - Math.PI / 2;
            const labelRadius = radius + 20;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);
            const label = characteristicLabels[char as keyof typeof characteristicLabels];
            
            return (
              <text
                key={index}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="10"
                className="font-medium"
              >
                {compact ? char.charAt(0).toUpperCase() + char.slice(1, 3) : label.name}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className={className}>
      <Card className="musaix-card-border bg-black/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Waves className="h-5 w-5 text-[#FF4081]" />
              Sound Signature
              {artistProfile?.artistName && (
                <Badge variant="secondary" className="bg-gray-800 text-white">
                  {artistProfile.artistName}
                </Badge>
              )}
            </CardTitle>
            {showViewToggle && (
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('bar')}
                  className={viewMode === 'bar' ? 'musaix-gradient-button' : ''}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'radar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('radar')}
                  className={viewMode === 'radar' ? 'musaix-gradient-button' : ''}
                >
                  <Radar className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'bar' | 'radar')}>
            <TabsContent value="bar" className="space-y-4">
              <div className={compact ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                {Object.entries(characteristics).map(([key, value]) => {
                  const label = characteristicLabels[key as keyof typeof characteristicLabels];
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {label.icon}
                          <Label className="text-white text-sm">{label.name}</Label>
                        </div>
                        <Badge variant="secondary" className="bg-gray-800 text-white text-xs">
                          {value}/10
                        </Badge>
                      </div>
                      
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-gradient-to-r from-[#FF4081] to-[#AB47BC] transition-all duration-500"
                          style={{ width: `${(value / 10) * 100}%` }}
                        />
                      </div>
                      
                      {showLabels && (
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{label.low}</span>
                          <span>{label.high}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="radar" className="space-y-4">
              <RadarChart data={characteristics} />
              
              {!compact && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  {Object.entries(characteristics).map(([key, value]) => {
                    const label = characteristicLabels[key as keyof typeof characteristicLabels];
                    return (
                      <div key={key} className="flex items-center gap-2 text-gray-300">
                        {label.icon}
                        <span>{label.name}: {value}/10</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {artistProfile && !compact && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Analysis Based On:
              </h4>
              <div className="space-y-1 text-sm text-gray-300">
                {artistProfile.genre && (
                  <div>Genre: <span className="text-[#FF4081]">{artistProfile.genre}</span></div>
                )}
                {artistProfile.influences && (
                  <div>Influences: <span className="text-[#AB47BC]">{artistProfile.influences}</span></div>
                )}
                {artistProfile.style && (
                  <div>Style: <span className="text-[#FF4081]">{artistProfile.style}</span></div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}