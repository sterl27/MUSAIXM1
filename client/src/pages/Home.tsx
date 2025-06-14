import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UnifiedHeader from "@/components/layout/UnifiedHeader";
import { Music, Bot, PenTool, BookOpen, Activity, Video, SlidersHorizontal, User, Grid3X3, Palette, FileText, Target, Volume2, Wand2, TrendingUp, Brain, Sparkles } from "lucide-react";

export default function Home() {
  const tools = [
    { title: "Music Player", href: "/music-player", icon: Grid3X3, color: "from-[#FF4081] to-[#AB47BC]" },
    { title: "Beat Generator", href: "/beat-generator", icon: Music, color: "from-[#AB47BC] to-[#3F51B5]" },
    { title: "Beat Studio", href: "/beat-studio", icon: Palette, color: "from-[#FFC107] to-[#FF4081]" },
    { title: "Trends Dashboard", href: "/trends-dashboard", icon: TrendingUp, color: "from-[#FF4081] to-[#AB47BC]" },
    
    { title: "Song Writer", href: "/songwriter", icon: PenTool, color: "from-[#AB47BC] to-[#3F51B5]" },
    { title: "Song Notebook", href: "/notebook", icon: BookOpen, color: "from-[#FFC107] to-[#FF4081]" },
    { title: "Complexity Scoring", href: "/complexity-scoring", icon: Bot, color: "from-[#FF4081] to-[#AB47BC]" },
    { title: "Energy Meter", href: "/energy-meter", icon: Activity, color: "from-[#AB47BC] to-[#3F51B5]" },
    
    { title: "Flow Analyzer", href: "/flow-analyzer", icon: Brain, color: "from-[#FFC107] to-[#FF4081]" },
    { title: "Sound Design", href: "/sounddesign", icon: SlidersHorizontal, color: "from-[#FF4081] to-[#AB47BC]" },
    { title: "Style Transformer", href: "/style-transformer", icon: Wand2, color: "from-[#AB47BC] to-[#3F51B5]" },
    { title: "Genre Engine", href: "/genre-recommendation", icon: Target, color: "from-[#FFC107] to-[#FF4081]" },
    
    { title: "Beat Analyzer", href: "/beat-analyzer", icon: TrendingUp, color: "from-[#FF4081] to-[#AB47BC]" },
    { title: "Sound Signature", href: "/sound-signature", icon: Volume2, color: "from-[#AB47BC] to-[#3F51B5]" },
    { title: "Artist Profile", href: "/artist-profile", icon: User, color: "from-[#FFC107] to-[#FF4081]" },
    { title: "Structure Format", href: "/structure-formatter", icon: FileText, color: "from-[#FF4081] to-[#AB47BC]" },
  ];

  return (
    <div className="min-h-screen bg-black">
      <UnifiedHeader />
      
      {/* Main Content */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Branding and Auth */}
        <div className="lg:w-1/3 flex flex-col justify-center items-center p-6 lg:p-8 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="text-center space-y-6 lg:space-y-8">
            {/* Logo */}
            <div className="space-y-3 lg:space-y-4">
              <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto rounded-2xl lg:rounded-3xl bg-gradient-to-br from-[#FF4081] to-[#AB47BC] flex items-center justify-center shadow-2xl musaix-glow">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Music className="h-8 w-8 lg:h-10 lg:w-10 text-[#FF4081]" />
                </div>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold">
                <span className="musaix-gradient-text">MUSAIX</span>
              </h1>
              <p className="text-gray-400 text-sm lg:text-base">AI-Powered Music Creation Platform</p>
            </div>

            {/* Auth Buttons */}
            <div className="space-y-3 lg:space-y-4 w-full max-w-xs">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-[#FF4081] to-[#AB47BC] hover:from-[#FF4081]/90 hover:to-[#AB47BC]/90 text-white font-semibold py-3 px-6 rounded-xl shadow-lg musaix-glow" 
                asChild
              >
                <Link href="/register">Get Started</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full border-2 border-[#FF4081]/50 text-[#FF4081] hover:bg-[#FF4081]/10 font-semibold py-3 px-6 rounded-xl" 
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Tools Grid */}
        <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-900 to-black">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 h-full">
            {tools.map((tool, index) => (
              <Link key={index} href={tool.href}>
                <Card className="h-32 md:h-40 lg:h-48 bg-gray-800/60 hover:bg-gray-700/60 border-2 border-gray-600 hover:border-gray-400 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl musaix-card-border hover:musaix-glow rounded-2xl lg:rounded-3xl">
                  <CardContent className="p-4 lg:p-6 h-full flex flex-col justify-between items-center text-center">
                    <div className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-r ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                      <tool.icon className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xs md:text-sm lg:text-base group-hover:text-[#FF4081] transition-colors duration-300 leading-tight">
                        {tool.title}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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