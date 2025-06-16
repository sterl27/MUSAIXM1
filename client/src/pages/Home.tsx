import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UnifiedHeader from "@/components/layout/UnifiedHeader";
import AnimatedSoundWaveBackground from "@/components/AnimatedSoundWaveBackground";
import { Music, Bot, PenTool, BookOpen, Activity, Video, SlidersHorizontal, User, Grid3X3, Palette, FileText, Target, Volume2, Wand2, TrendingUp, Brain, Sparkles, BarChart3 } from "lucide-react";

export default function Home() {
  const mainPages = [
    { title: "Songwriter Studio", href: "/songwriter-studio", icon: PenTool, color: "from-[#FF4081] to-[#AB47BC]", description: "Complete songwriting workspace" },
    { title: "Analysis Studio", href: "/analysis-studio", icon: BarChart3, color: "from-[#AB47BC] to-[#3F51B5]", description: "Advanced lyric analysis tools" },
    { title: "Music Player", href: "/music-player", icon: Volume2, color: "from-[#FFC107] to-[#FF4081]", description: "SoundCloud streaming" },
    { title: "Beat Studio", href: "/beat-studio", icon: Music, color: "from-[#FF4081] to-[#AB47BC]", description: "Professional beat creation" },
    { title: "Genre Engine", href: "/genre-recommendation", icon: Target, color: "from-[#AB47BC] to-[#3F51B5]", description: "AI genre recommendations" },
    { title: "Song Notebook", href: "/notebook", icon: BookOpen, color: "from-[#FFC107] to-[#FF4081]", description: "Write and save lyrics" },
    { title: "Sound Design", href: "/sounddesign", icon: SlidersHorizontal, color: "from-[#FF4081] to-[#AB47BC]", description: "Audio production tools" },
    { title: "Trends Dashboard", href: "/trends-dashboard", icon: TrendingUp, color: "from-[#AB47BC] to-[#3F51B5]", description: "Industry insights" },
    { title: "Artist Profile", href: "/artist-profile", icon: User, color: "from-[#FFC107] to-[#FF4081]", description: "Manage your identity" },
  ];

  return (
    <div className="min-h-screen bg-black">
      <UnifiedHeader />
      
      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
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
            
            {/* 3x3 Grid */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {mainPages.map((page, index) => (
                <Link key={index} href={page.href}>
                  <Card className="aspect-square bg-gray-800/60 hover:bg-gray-700/60 border-2 border-gray-600 hover:border-gray-400 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl musaix-card-border hover:musaix-glow rounded-xl md:rounded-2xl">
                    <CardContent className="p-3 md:p-4 lg:p-6 h-full flex flex-col justify-between items-center text-center">
                      <div className={`w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-lg md:rounded-xl bg-gradient-to-r ${page.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                        <page.icon className="h-4 w-4 md:h-6 md:w-6 lg:h-8 lg:w-8 text-white" />
                      </div>
                      <div className="space-y-1 md:space-y-2">
                        <h3 className="text-white font-bold text-xs md:text-sm lg:text-base group-hover:text-[#FF4081] transition-colors duration-300 leading-tight">
                          {page.title}
                        </h3>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
                          {page.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
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