import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import UnifiedPageLayout from "@/components/layout/UnifiedPageLayout";
import { 
  Play, 
  Pause, 
  Square, 
  Download, 
  Upload, 
  Settings, 
  Palette, 
  Type,
  Sparkles,
  Video,
  Music,
  Timer,
  Layers,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnimationStyle {
  id: string;
  name: string;
  description: string;
  effects: string[];
}

interface TimingPoint {
  time: number;
  lineIndex: number;
  wordIndex?: number;
}

export default function LyricAnimator() {
  const [lyrics, setLyrics] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const [animationStyle, setAnimationStyle] = useState("fade-in");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState([48]);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [animationSpeed, setAnimationSpeed] = useState([1]);
  const [lineSpacing, setLineSpacing] = useState([1.5]);
  const [glowEffect, setGlowEffect] = useState(false);
  const [gradientText, setGradientText] = useState(false);
  const [backgroundVideo, setBackgroundVideo] = useState<string | null>(null);
  const [timingPoints, setTimingPoints] = useState<TimingPoint[]>([]);
  const [autoTiming, setAutoTiming] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const { toast } = useToast();

  const animationStyles: AnimationStyle[] = [
    {
      id: "fade-in",
      name: "Fade In",
      description: "Words appear with smooth fade effect",
      effects: ["opacity", "scale"]
    },
    {
      id: "slide-up",
      name: "Slide Up",
      description: "Words slide up from bottom",
      effects: ["translateY", "opacity"]
    },
    {
      id: "bounce",
      name: "Bounce",
      description: "Words bounce into view",
      effects: ["scale", "translateY", "elasticity"]
    },
    {
      id: "typewriter",
      name: "Typewriter",
      description: "Characters appear one by one",
      effects: ["character-reveal", "cursor"]
    },
    {
      id: "wave",
      name: "Wave",
      description: "Words appear in a wave motion",
      effects: ["translateY", "delay-offset", "sine-wave"]
    },
    {
      id: "glow-pulse",
      name: "Glow Pulse",
      description: "Words pulse with glowing effect",
      effects: ["glow", "scale", "pulse"]
    },
    {
      id: "split-reveal",
      name: "Split Reveal",
      description: "Words split and reveal from center",
      effects: ["clip-path", "scale", "rotation"]
    },
    {
      id: "particle-burst",
      name: "Particle Burst",
      description: "Words appear with particle explosion",
      effects: ["particles", "scale", "opacity"]
    }
  ];

  const fontFamilies = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Impact", "Comic Sans MS", "Trebuchet MS", "Courier New", "Lucida Console"
  ];

  const backgroundOptions = [
    { value: "solid", label: "Solid Color" },
    { value: "gradient", label: "Gradient" },
    { value: "video", label: "Video Background" },
    { value: "image", label: "Image Background" }
  ];

  const lyricsLines = lyrics.split('\n').filter(line => line.trim());

  // Auto-generate timing points based on duration
  useEffect(() => {
    if (autoTiming && lyricsLines.length > 0) {
      const timePerLine = duration / lyricsLines.length;
      const newTimingPoints: TimingPoint[] = lyricsLines.map((_, index) => ({
        time: index * timePerLine,
        lineIndex: index
      }));
      setTimingPoints(newTimingPoints);
    }
  }, [autoTiming, duration, lyricsLines.length]);

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }
        
        const elapsed = (timestamp - startTimeRef.current) / 1000;
        setCurrentTime(elapsed);
        
        if (elapsed < duration) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsPlaying(false);
          setCurrentTime(0);
          startTimeRef.current = undefined;
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
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
  }, [isPlaying, duration]);

  const handlePlay = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
      startTimeRef.current = undefined;
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    startTimeRef.current = undefined;
  };

  const handleReset = () => {
    handleStop();
    setLyrics("");
    setTimingPoints([]);
  };

  const getCurrentLine = () => {
    const currentPoint = timingPoints.findLast(point => point.time <= currentTime);
    return currentPoint ? currentPoint.lineIndex : -1;
  };

  const getAnimationClass = (lineIndex: number, isActive: boolean) => {
    const baseClass = "lyric-line";
    if (!isActive) return `${baseClass} lyric-hidden`;
    
    switch (animationStyle) {
      case "fade-in":
        return `${baseClass} lyric-fade-in`;
      case "slide-up":
        return `${baseClass} lyric-slide-up`;
      case "bounce":
        return `${baseClass} lyric-bounce`;
      case "typewriter":
        return `${baseClass} lyric-typewriter`;
      case "wave":
        return `${baseClass} lyric-wave`;
      case "glow-pulse":
        return `${baseClass} lyric-glow-pulse`;
      case "split-reveal":
        return `${baseClass} lyric-split-reveal`;
      case "particle-burst":
        return `${baseClass} lyric-particle-burst`;
      default:
        return `${baseClass} lyric-fade-in`;
    }
  };

  const exportAnimation = () => {
    // In a real implementation, this would render the animation to video
    toast({
      title: "Export Started",
      description: "Your lyric animation is being rendered...",
    });
  };

  const importAudio = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Handle audio file upload
        toast({
          title: "Audio Imported",
          description: `${file.name} has been loaded for timing sync.`,
        });
      }
    };
    input.click();
  };

  return (
    <UnifiedPageLayout 
      title="Lyric Animation Generator" 
      description="Create stunning animated lyric videos with professional effects"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Lyrics Input */}
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Type className="h-5 w-5 text-[#FF4081]" />
                Lyrics Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your lyrics here... Each line will be animated separately."
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="min-h-[200px] bg-gray-800 border-gray-600 text-white resize-none"
              />
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={importAudio}
                  className="flex-1"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import Audio
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleReset}
                  className="flex-1"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Animation Settings */}
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#FF4081]" />
                Animation Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="style" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                  <TabsTrigger value="style" className="text-white">Style</TabsTrigger>
                  <TabsTrigger value="timing" className="text-white">Timing</TabsTrigger>
                  <TabsTrigger value="visual" className="text-white">Visual</TabsTrigger>
                </TabsList>
                
                <TabsContent value="style" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-white mb-2 block">Animation Style</Label>
                    <Select value={animationStyle} onValueChange={setAnimationStyle}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {animationStyles.map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            <div className="flex flex-col">
                              <span className="text-white font-medium">{style.name}</span>
                              <span className="text-gray-400 text-xs">{style.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2 block">Animation Speed</Label>
                    <Slider
                      value={animationSpeed}
                      onValueChange={setAnimationSpeed}
                      max={3}
                      min={0.1}
                      step={0.1}
                      className="musaix-slider"
                    />
                    <span className="text-gray-400 text-sm">{animationSpeed[0]}x</span>
                  </div>
                </TabsContent>
                
                <TabsContent value="timing" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-white mb-2 block">Duration (seconds)</Label>
                    <Input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-timing"
                      checked={autoTiming}
                      onCheckedChange={setAutoTiming}
                    />
                    <Label htmlFor="auto-timing" className="text-white">
                      Auto Timing
                    </Label>
                  </div>
                  
                  {!autoTiming && (
                    <div>
                      <Label className="text-white mb-2 block">Manual Timing Points</Label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {timingPoints.map((point, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400 w-12">{point.time.toFixed(1)}s</span>
                            <span className="text-white flex-1 truncate">
                              {lyricsLines[point.lineIndex] || ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="visual" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-white mb-2 block">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {fontFamilies.map((font) => (
                          <SelectItem key={font} value={font}>
                            <span className="text-white" style={{ fontFamily: font }}>
                              {font}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2 block">Font Size</Label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={120}
                      min={16}
                      step={2}
                      className="musaix-slider"
                    />
                    <span className="text-gray-400 text-sm">{fontSize[0]}px</span>
                  </div>
                  
                  <div>
                    <Label className="text-white mb-2 block">Line Spacing</Label>
                    <Slider
                      value={lineSpacing}
                      onValueChange={setLineSpacing}
                      max={3}
                      min={1}
                      step={0.1}
                      className="musaix-slider"
                    />
                    <span className="text-gray-400 text-sm">{lineSpacing[0]}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white mb-2 block">Text Color</Label>
                      <Input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full h-10 border-gray-600"
                      />
                    </div>
                    <div>
                      <Label className="text-white mb-2 block">Background</Label>
                      <Input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-full h-10 border-gray-600"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="glow-effect"
                        checked={glowEffect}
                        onCheckedChange={setGlowEffect}
                      />
                      <Label htmlFor="glow-effect" className="text-white">
                        Glow Effect
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="gradient-text"
                        checked={gradientText}
                        onCheckedChange={setGradientText}
                      />
                      <Label htmlFor="gradient-text" className="text-white">
                        Gradient Text
                      </Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Controls */}
          <Card className="musaix-card-border bg-black/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handlePlay}
                    disabled={isPlaying || !lyrics.trim()}
                    className="musaix-gradient-button"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                  <Button
                    onClick={handlePause}
                    disabled={!isPlaying}
                    variant="outline"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button
                    onClick={handleStop}
                    variant="outline"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-gray-800 text-white">
                    <Timer className="h-3 w-3 mr-1" />
                    {currentTime.toFixed(1)}s / {duration}s
                  </Badge>
                  <Button
                    onClick={exportAnimation}
                    variant="outline"
                    disabled={!lyrics.trim()}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#FF4081] to-[#AB47BC] h-2 rounded-full transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Animation Preview */}
          <Card className="musaix-card-border bg-black/50 min-h-[400px]">
            <CardContent className="p-0">
              <div 
                className="relative w-full h-96 flex items-center justify-center overflow-hidden rounded-lg"
                style={{ 
                  backgroundColor,
                  fontFamily,
                  fontSize: `${fontSize[0]}px`,
                  lineHeight: lineSpacing[0]
                }}
              >
                {/* Background Video/Image would go here */}
                
                {/* Lyrics Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  {lyricsLines.map((line, index) => {
                    const currentLine = getCurrentLine();
                    const isActive = index <= currentLine;
                    const isPast = index < currentLine;
                    
                    return (
                      <div
                        key={index}
                        className={getAnimationClass(index, isActive)}
                        style={{
                          color: textColor,
                          textShadow: glowEffect ? `0 0 20px ${textColor}` : 'none',
                          background: gradientText ? 'linear-gradient(45deg, #FF4081, #AB47BC)' : 'none',
                          WebkitBackgroundClip: gradientText ? 'text' : 'unset',
                          WebkitTextFillColor: gradientText ? 'transparent' : textColor,
                          opacity: isPast ? 0.6 : isActive ? 1 : 0,
                          transform: isActive ? 'scale(1)' : 'scale(0.9)',
                          transition: 'all 0.5s ease-in-out',
                          marginBottom: '0.5em'
                        }}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>
                
                {/* Overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          {timingPoints.length > 0 && (
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[#FF4081]" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timingPoints.map((point, index) => (
                    <div 
                      key={index}
                      className={`flex items-center gap-3 p-2 rounded transition-colors ${
                        getCurrentLine() === point.lineIndex 
                          ? 'bg-[#FF4081]/20 border border-[#FF4081]/30' 
                          : 'bg-gray-800/50'
                      }`}
                    >
                      <Badge variant="outline" className="min-w-[60px] text-center">
                        {point.time.toFixed(1)}s
                      </Badge>
                      <span className="text-white flex-1 truncate">
                        {lyricsLines[point.lineIndex] || ""}
                      </span>
                      {getCurrentLine() === point.lineIndex && (
                        <Badge className="bg-[#FF4081] text-white">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>


    </UnifiedPageLayout>
  );
}