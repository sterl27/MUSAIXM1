import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  Radar, 
  Info, 
  Volume2, 
  Mic, 
  Music,
  Waves,
  Activity
} from "lucide-react";

interface VocalCharacteristics {
  pitch: number;           // 1-10: Low to High vocal register
  timbre: number;          // 1-10: Dark/Warm to Bright/Sharp tonal quality
  dynamics: number;        // 1-10: Soft/Controlled to Powerful/Intense
  texture: number;         // 1-10: Smooth/Clean to Rough/Raspy
  resonance: number;       // 1-10: Thin/Nasal to Full/Rich
  articulation: number;    // 1-10: Mumbled/Slurred to Crisp/Clear
  flow: number;           // 1-10: Choppy/Stilted to Smooth/Fluid
  pace: number;           // 1-10: Slow/Deliberate to Fast/Rapid
}

interface SoundSignatureProps {
  artistProfile?: {
    artistName?: string;
    genre?: string;
    influences?: string;
    style?: string;
  };
  lyrics?: string;
  className?: string;
  showControls?: boolean;
  interactive?: boolean;
}

const defaultCharacteristics: VocalCharacteristics = {
  pitch: 5,
  timbre: 5,
  dynamics: 5,
  texture: 5,
  resonance: 5,
  articulation: 5,
  flow: 5,
  pace: 5,
};

const characteristicLabels = {
  pitch: { name: "Pitch Range", low: "Low/Bass", high: "High/Soprano", icon: <Volume2 className="h-4 w-4" /> },
  timbre: { name: "Tonal Quality", low: "Warm/Dark", high: "Bright/Sharp", icon: <Waves className="h-4 w-4" /> },
  dynamics: { name: "Vocal Power", low: "Soft/Gentle", high: "Powerful/Intense", icon: <Activity className="h-4 w-4" /> },
  texture: { name: "Voice Texture", low: "Smooth/Clean", high: "Rough/Raspy", icon: <Mic className="h-4 w-4" /> },
  resonance: { name: "Vocal Fullness", low: "Thin/Nasal", high: "Full/Rich", icon: <Music className="h-4 w-4" /> },
  articulation: { name: "Clarity", low: "Slurred/Mumbled", high: "Crisp/Clear", icon: <Info className="h-4 w-4" /> },
  flow: { name: "Delivery Flow", low: "Choppy/Stilted", high: "Smooth/Fluid", icon: <Waves className="h-4 w-4" /> },
  pace: { name: "Delivery Speed", low: "Slow/Deliberate", high: "Fast/Rapid", icon: <Activity className="h-4 w-4" /> },
};

export default function SoundSignatureVisualizer({ 
  artistProfile, 
  lyrics, 
  className = "",
  showControls = true,
  interactive = true 
}: SoundSignatureProps) {
  const [viewMode, setViewMode] = useState<'bar' | 'radar'>('bar');
  const [characteristics, setCharacteristics] = useState<VocalCharacteristics>(defaultCharacteristics);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate vocal characteristics based on artist profile
  useEffect(() => {
    if (artistProfile) {
      const generated = generateVocalCharacteristics(artistProfile, lyrics);
      setCharacteristics(generated);
    }
  }, [artistProfile, lyrics]);

  // Draw radar chart
  useEffect(() => {
    if (viewMode === 'radar' && canvasRef.current) {
      drawRadarChart();
    }
  }, [viewMode, characteristics]);

  const generateVocalCharacteristics = (profile: any, lyrics?: string): VocalCharacteristics => {
    const genre = profile.genre?.toLowerCase() || '';
    const influences = profile.influences?.toLowerCase() || '';
    const style = profile.style?.toLowerCase() || '';
    
    // Base characteristics on genre
    let baseCharacteristics = { ...defaultCharacteristics };
    
    // Genre-based adjustments
    if (genre.includes('rap') || genre.includes('hip-hop')) {
      baseCharacteristics.articulation = 7;
      baseCharacteristics.pace = 7;
      baseCharacteristics.flow = 8;
      baseCharacteristics.dynamics = 6;
    } else if (genre.includes('jazz') || genre.includes('soul')) {
      baseCharacteristics.resonance = 8;
      baseCharacteristics.timbre = 6;
      baseCharacteristics.texture = 3;
      baseCharacteristics.dynamics = 7;
    } else if (genre.includes('rock') || genre.includes('metal')) {
      baseCharacteristics.dynamics = 9;
      baseCharacteristics.texture = 7;
      baseCharacteristics.pitch = 7;
      baseCharacteristics.timbre = 8;
    } else if (genre.includes('folk') || genre.includes('acoustic')) {
      baseCharacteristics.resonance = 7;
      baseCharacteristics.texture = 2;
      baseCharacteristics.dynamics = 4;
      baseCharacteristics.articulation = 8;
    }
    
    // Influence-based adjustments
    if (influences.includes('kendrick') || influences.includes('cole')) {
      baseCharacteristics.articulation += 1;
      baseCharacteristics.flow += 1;
    }
    if (influences.includes('drake') || influences.includes('future')) {
      baseCharacteristics.texture += 2;
      baseCharacteristics.resonance += 1;
    }
    if (influences.includes('eminem') || influences.includes('tech')) {
      baseCharacteristics.pace += 2;
      baseCharacteristics.articulation += 2;
    }
    
    // Style-based adjustments
    if (style.includes('melodic') || style.includes('smooth')) {
      baseCharacteristics.flow += 1;
      baseCharacteristics.texture -= 1;
    }
    if (style.includes('aggressive') || style.includes('hard')) {
      baseCharacteristics.dynamics += 1;
      baseCharacteristics.texture += 1;
    }
    if (style.includes('emotional') || style.includes('deep')) {
      baseCharacteristics.resonance += 1;
      baseCharacteristics.dynamics += 1;
    }
    
    // Lyrics-based adjustments
    if (lyrics) {
      const wordCount = lyrics.split(' ').length;
      const avgWordsPerLine = wordCount / Math.max(lyrics.split('\n').length, 1);
      
      if (avgWordsPerLine > 10) {
        baseCharacteristics.pace += 1;
        baseCharacteristics.articulation += 1;
      }
      
      // Check for emotional content
      const emotionalWords = ['pain', 'love', 'heart', 'soul', 'deep', 'feel'];
      const emotionalCount = emotionalWords.reduce((count, word) => 
        count + (lyrics.toLowerCase().split(word).length - 1), 0);
      
      if (emotionalCount > 2) {
        baseCharacteristics.resonance += 1;
        baseCharacteristics.dynamics += 1;
      }
    }
    
    // Normalize values between 1-10
    Object.keys(baseCharacteristics).forEach(key => {
      const typedKey = key as keyof VocalCharacteristics;
      baseCharacteristics[typedKey] = Math.min(10, Math.max(1, baseCharacteristics[typedKey]));
    });
    
    return baseCharacteristics;
  };

  const drawRadarChart = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 1;
    
    // Draw concentric circles
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Draw axes
    const characteristics = Object.keys(characteristicLabels);
    const angleStep = (2 * Math.PI) / characteristics.length;
    
    characteristics.forEach((_, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    });
    
    // Draw characteristic values
    ctx.fillStyle = '#FF4081';
    ctx.strokeStyle = '#FF4081';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.3;
    
    ctx.beginPath();
    Object.entries(characteristics).forEach(([char, value], index) => {
      const angle = index * angleStep - Math.PI / 2;
      const normalizedValue = (value as number) / 10;
      const x = centerX + radius * normalizedValue * Math.cos(angle);
      const y = centerY + radius * normalizedValue * Math.sin(angle);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
    
    ctx.globalAlpha = 1;
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = '#FF4081';
    Object.entries(characteristics).forEach(([char, value], index) => {
      const angle = index * angleStep - Math.PI / 2;
      const normalizedValue = (value as number) / 10;
      const x = centerX + radius * normalizedValue * Math.cos(angle);
      const y = centerY + radius * normalizedValue * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw labels
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    
    characteristics.forEach((char, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const labelRadius = radius + 20;
      const x = centerX + labelRadius * Math.cos(angle);
      const y = centerY + labelRadius * Math.sin(angle);
      
      const label = characteristicLabels[char as keyof typeof characteristicLabels];
      ctx.fillText(label.name, x, y);
    });
  };

  const updateCharacteristic = (key: keyof VocalCharacteristics, value: number) => {
    if (interactive) {
      setCharacteristics(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
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
            {showControls && (
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'bar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('bar')}
                  className="musaix-gradient-button"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'radar' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('radar')}
                  className="musaix-gradient-button"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(characteristics).map(([key, value]) => {
                  const label = characteristicLabels[key as keyof typeof characteristicLabels];
                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {label.icon}
                          <Label className="text-white">{label.name}</Label>
                        </div>
                        <Badge variant="secondary" className="bg-gray-800 text-white">
                          {value}/10
                        </Badge>
                      </div>
                      
                      {interactive ? (
                        <Slider
                          value={[value]}
                          onValueChange={(values) => updateCharacteristic(key as keyof VocalCharacteristics, values[0])}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      ) : (
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-[#FF4081] to-[#AB47BC]"
                            style={{ width: `${(value / 10) * 100}%` }}
                          />
                        </div>
                      )}
                      
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{label.low}</span>
                        <span>{label.high}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="radar" className="space-y-4">
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="border border-gray-600 rounded-lg bg-gray-900"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
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
            </TabsContent>
          </Tabs>
          
          {artistProfile && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-white font-medium mb-2">Analysis Based On:</h4>
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