import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Play, 
  Pause, 
  Volume2, 
  Settings, 
  Shuffle,
  RotateCcw,
  Download,
  Share
} from "lucide-react";

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  description: string;
}

interface SoundWaveConfig {
  barCount: number;
  sensitivity: number;
  smoothing: number;
  colorMode: 'palette' | 'frequency' | 'amplitude' | 'rainbow';
  animationSpeed: number;
  glowEffect: boolean;
  mirrorEffect: boolean;
}

const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "neon",
    name: "Neon Nights",
    colors: ["#FF0080", "#8000FF", "#0080FF", "#00FF80", "#FF8000"],
    description: "Vibrant neon colors for high-energy tracks"
  },
  {
    id: "sunset",
    name: "Sunset Vibes",
    colors: ["#FF6B35", "#F7931E", "#FFD700", "#FF69B4", "#FF1493"],
    description: "Warm sunset gradients for chill music"
  },
  {
    id: "ocean",
    name: "Ocean Depths",
    colors: ["#003366", "#0066CC", "#3399FF", "#66CCFF", "#99DDFF"],
    description: "Cool blues for ambient and electronic"
  },
  {
    id: "fire",
    name: "Fire Energy",
    colors: ["#800000", "#CC0000", "#FF3300", "#FF6600", "#FFCC00"],
    description: "Intense reds and oranges for rap and rock"
  },
  {
    id: "forest",
    name: "Forest Calm",
    colors: ["#2D5016", "#4F7942", "#6B8E23", "#8FBC8F", "#98FB98"],
    description: "Natural greens for acoustic and folk"
  },
  {
    id: "cosmic",
    name: "Cosmic Purple",
    colors: ["#301934", "#663399", "#9966CC", "#CC99FF", "#E6CCFF"],
    description: "Deep purples for mysterious and ambient"
  },
  {
    id: "retro",
    name: "Retro Wave",
    colors: ["#FF00FF", "#00FFFF", "#FFFF00", "#FF0080", "#8000FF"],
    description: "80s synthwave aesthetic"
  },
  {
    id: "monochrome",
    name: "Monochrome",
    colors: ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"],
    description: "Classic black and white with grays"
  }
];

interface SoundWaveVisualizerProps {
  isPlaying: boolean;
  audioElement?: HTMLAudioElement | null;
  className?: string;
}

export default function SoundWaveVisualizer({ 
  isPlaying, 
  audioElement, 
  className = "" 
}: SoundWaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();
  
  const [selectedPalette, setSelectedPalette] = useState<string>("neon");
  const [config, setConfig] = useState<SoundWaveConfig>({
    barCount: 64,
    sensitivity: 50,
    smoothing: 80,
    colorMode: 'palette',
    animationSpeed: 60,
    glowEffect: true,
    mirrorEffect: false
  });
  
  const [audioData, setAudioData] = useState<number[]>(new Array(64).fill(0));
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Initialize audio analysis
  const initializeAudio = useCallback(() => {
    if (!audioElement || audioContextRef.current) return;

    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioElement);
      
      analyser.fftSize = config.barCount * 4;
      analyser.smoothingTimeConstant = config.smoothing / 100;
      
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
    } catch (error) {
      console.log("Audio analysis not available, using simulation");
      // Fallback to simulated data
      simulateAudioData();
    }
  }, [audioElement, config.barCount, config.smoothing]);

  // Simulate audio data when real audio is not available
  const simulateAudioData = useCallback(() => {
    if (!isPlaying) return;
    
    const data = new Array(config.barCount).fill(0).map((_, i) => {
      const base = Math.sin(Date.now() * 0.01 + i * 0.1) * 50 + 50;
      const noise = Math.random() * 30;
      return Math.max(0, Math.min(255, base + noise));
    });
    
    setAudioData(data);
  }, [isPlaying, config.barCount]);

  // Get frequency data from audio
  const updateAudioData = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) {
      simulateAudioData();
      return;
    }

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const data = Array.from(dataArrayRef.current).slice(0, config.barCount);
    setAudioData(data);
  }, [config.barCount, simulateAudioData]);

  // Get color based on frequency and amplitude
  const getBarColor = useCallback((value: number, index: number, maxValue: number): string => {
    const palette = COLOR_PALETTES.find(p => p.id === selectedPalette);
    if (!palette) return "#FF4081";

    const normalizedValue = value / 255;
    const normalizedIndex = index / config.barCount;

    switch (config.colorMode) {
      case 'frequency':
        // Color based on frequency (index position)
        const colorIndex = Math.floor(normalizedIndex * (palette.colors.length - 1));
        return palette.colors[colorIndex];
        
      case 'amplitude':
        // Color based on amplitude (value)
        const amplitudeIndex = Math.floor(normalizedValue * (palette.colors.length - 1));
        return palette.colors[amplitudeIndex];
        
      case 'rainbow':
        // Rainbow effect
        const hue = (normalizedIndex * 360 + Date.now() * 0.1) % 360;
        const saturation = 70 + normalizedValue * 30;
        const lightness = 40 + normalizedValue * 30;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        
      default:
        // Palette mode - cycle through colors based on value
        const paletteIndex = Math.floor(normalizedValue * (palette.colors.length - 1));
        return palette.colors[paletteIndex];
    }
  }, [selectedPalette, config.colorMode, config.barCount]);

  // Render the visualization
  const renderVisualization = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / config.barCount;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find max value for normalization
    const maxValue = Math.max(...audioData, 1);

    // Draw bars
    audioData.forEach((value, index) => {
      const normalizedValue = (value / maxValue) * (config.sensitivity / 100);
      const barHeight = normalizedValue * height * 0.8;
      const x = index * barWidth;
      const y = height - barHeight;

      const color = getBarColor(value, index, maxValue);

      // Apply glow effect
      if (config.glowEffect && value > 10) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
      } else {
        ctx.shadowBlur = 0;
      }

      // Draw main bar
      ctx.fillStyle = color;
      ctx.fillRect(x, y, barWidth - 1, barHeight);

      // Draw mirror effect
      if (config.mirrorEffect) {
        const gradient = ctx.createLinearGradient(0, height, 0, height + barHeight * 0.5);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height, barWidth - 1, barHeight * 0.5);
      }
    });
  }, [audioData, config, getBarColor]);

  // Animation loop
  const animate = useCallback(() => {
    if (!isPlaying) return;

    updateAudioData();
    renderVisualization();

    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, updateAudioData, renderVisualization]);

  // Start/stop animation
  useEffect(() => {
    if (isPlaying) {
      initializeAudio();
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate, initializeAudio]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const randomizePalette = () => {
    const randomPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
    setSelectedPalette(randomPalette.id);
  };

  const resetConfig = () => {
    setConfig({
      barCount: 64,
      sensitivity: 50,
      smoothing: 80,
      colorMode: 'palette',
      animationSpeed: 60,
      glowEffect: true,
      mirrorEffect: false
    });
  };

  const exportVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `soundwave-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const currentPalette = COLOR_PALETTES.find(p => p.id === selectedPalette);

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Visualizer Canvas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Sound Wave Visualizer
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={randomizePalette}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportVisualization}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="w-full h-32 md:h-48 lg:h-64 bg-black rounded-lg"
              style={{ display: 'block' }}
            />
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                <div className="text-center">
                  <Play className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400">Play music to see visualization</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Current Palette Info */}
          {currentPalette && (
            <div className="mt-4 p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{currentPalette.name}</span>
                <Badge variant="secondary">{config.colorMode}</Badge>
              </div>
              <p className="text-xs text-gray-400 mb-3">{currentPalette.description}</p>
              <div className="flex gap-1">
                {currentPalette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border-2 border-gray-600"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Panel */}
      {isConfigOpen && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Visualization Settings</span>
              <Button variant="outline" size="sm" onClick={resetConfig}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Color Palette Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Color Palette</label>
              <Select value={selectedPalette} onValueChange={setSelectedPalette}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_PALETTES.map((palette) => (
                    <SelectItem key={palette.id} value={palette.id}>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {palette.colors.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        {palette.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Mode */}
            <div>
              <label className="text-sm font-medium mb-3 block">Color Mode</label>
              <Select 
                value={config.colorMode} 
                onValueChange={(value: any) => setConfig(prev => ({ ...prev, colorMode: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="palette">Palette Cycling</SelectItem>
                  <SelectItem value="frequency">Frequency Based</SelectItem>
                  <SelectItem value="amplitude">Amplitude Based</SelectItem>
                  <SelectItem value="rainbow">Rainbow Effect</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Visual Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Bar Count ({config.barCount})
                </label>
                <Slider
                  value={[config.barCount]}
                  onValueChange={([value]) => setConfig(prev => ({ ...prev, barCount: value }))}
                  min={16}
                  max={128}
                  step={8}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Sensitivity ({config.sensitivity}%)
                </label>
                <Slider
                  value={[config.sensitivity]}
                  onValueChange={([value]) => setConfig(prev => ({ ...prev, sensitivity: value }))}
                  min={10}
                  max={200}
                  step={5}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Smoothing ({config.smoothing}%)
                </label>
                <Slider
                  value={[config.smoothing]}
                  onValueChange={([value]) => setConfig(prev => ({ ...prev, smoothing: value }))}
                  min={0}
                  max={95}
                  step={5}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Animation Speed ({config.animationSpeed}fps)
                </label>
                <Slider
                  value={[config.animationSpeed]}
                  onValueChange={([value]) => setConfig(prev => ({ ...prev, animationSpeed: value }))}
                  min={15}
                  max={120}
                  step={15}
                />
              </div>
            </div>

            {/* Effects Toggles */}
            <div className="flex flex-wrap gap-4">
              <Button
                variant={config.glowEffect ? "default" : "outline"}
                size="sm"
                onClick={() => setConfig(prev => ({ ...prev, glowEffect: !prev.glowEffect }))}
              >
                Glow Effect
              </Button>
              <Button
                variant={config.mirrorEffect ? "default" : "outline"}
                size="sm"
                onClick={() => setConfig(prev => ({ ...prev, mirrorEffect: !prev.mirrorEffect }))}
              >
                Mirror Effect
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}