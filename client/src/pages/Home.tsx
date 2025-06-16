import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UnifiedHeader from "@/components/layout/UnifiedHeader";
import AnimatedSoundWaveBackground from "@/components/AnimatedSoundWaveBackground";
import { Music, Bot, PenTool, BookOpen, Activity, Video, SlidersHorizontal, User, Grid3X3, Palette, FileText, Target, Volume2, Wand2, TrendingUp, Brain, Sparkles, BarChart3 } from "lucide-react";

export default function Home() {
  const drumPads = [
    // Top Row - Core Studios
    { title: "Songwriter Studio", href: "/songwriter-studio", icon: PenTool, color: "#FF4081", description: "Complete songwriting workspace", position: "A1" },
    { title: "Analysis Studio", href: "/analysis-studio", icon: BarChart3, color: "#AB47BC", description: "Advanced lyric analysis tools", position: "A2" },
    { title: "Beat Studio", href: "/beat-studio", icon: Music, color: "#3F51B5", description: "Professional beat creation", position: "A3" },
    { title: "Song Writer", href: "/songwriter", icon: PenTool, color: "#FF6B35", description: "AI-powered lyric generation", position: "A4" },
    
    // Middle Row - Creative Tools
    { title: "Song Notebook", href: "/notebook", icon: BookOpen, color: "#8E24AA", description: "Write and save lyrics", position: "B1" },
    { title: "Sound Design", href: "/sounddesign", icon: SlidersHorizontal, color: "#00ACC1", description: "Audio production tools", position: "B2" },
    { title: "Genre Engine", href: "/genre-recommendation", icon: Target, color: "#FB8C00", description: "AI genre recommendations", position: "B3" },
    { title: "Energy Meter", href: "/energy-meter", icon: Activity, color: "#E53935", description: "Visualize creative intensity", position: "B4" },
    
    // Bottom Row - Analysis & Tools
    { title: "Flow Analyzer", href: "/flow-analyzer", icon: Brain, color: "#5E35B1", description: "Analyze flow and cadence", position: "C1" },
    { title: "Complexity Scoring", href: "/complexity-scoring", icon: Bot, color: "#00897B", description: "AI complexity analysis", position: "C2" },
    { title: "Artist Profile", href: "/artist-profile", icon: User, color: "#F4511E", description: "Manage your identity", position: "C3" },
  ];

  return (
    <div className="min-h-screen bg-black">
      <UnifiedHeader />
      
      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative">
        {/* Animated Sound Wave Background */}
        <AnimatedSoundWaveBackground
          isPlaying={false}
          tempo={100}
          intensity={0.4}
          audioElement={null}
          className="opacity-20"
        />
        
        {/* Main Pages Grid */}
        <div className="p-6 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold musaix-gradient-text mb-4">
                Musaix Pro Studio
              </h1>
              <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto">
                AI-powered music production platform with professional creative tools
              </p>
            </div>
            
            {/* MIDI Drum Pad Grid - 4x3 Layout */}
            <div className="grid grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {drumPads.map((pad, index) => (
                <Link key={index} href={pad.href}>
                  <div className="relative group">
                    {/* MIDI Pad */}
                    <div 
                      className="aspect-square bg-gray-900 border-2 border-gray-700 rounded-lg relative overflow-hidden cursor-pointer transition-all duration-200 hover:border-gray-500 active:scale-95 shadow-lg"
                      style={{
                        background: `linear-gradient(145deg, #2a2a2a, #1a1a1a)`,
                        boxShadow: `inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.4)`
                      }}
                    >
                      {/* LED Indicator */}
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 opacity-30 group-hover:opacity-100 transition-opacity duration-200"></div>
                      
                      {/* Pad Number */}
                      <div className="absolute top-2 left-2 text-xs text-gray-500 font-mono">{pad.position}</div>
                      
                      {/* Center Content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                        <div 
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200 group-hover:scale-110"
                          style={{ backgroundColor: pad.color, boxShadow: `0 0 10px ${pad.color}40` }}
                        >
                          <pad.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                        </div>
                        <h3 className="text-white font-bold text-xs md:text-sm text-center leading-tight group-hover:text-gray-300 transition-colors duration-200">
                          {pad.title}
                        </h3>
                      </div>
                      
                      {/* Bottom Label */}
                      <div className="absolute bottom-1 left-1 right-1 text-center">
                        <div className="text-xs text-gray-600 font-mono truncate">{pad.description.split(' ').slice(0, 2).join(' ')}</div>
                      </div>
                      
                      {/* Hover Glow Effect */}
                      <div 
                        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"
                        style={{ backgroundColor: pad.color }}
                      ></div>
                    </div>
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      {pad.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4081]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#AB47BC]/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}