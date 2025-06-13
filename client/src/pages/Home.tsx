import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UnifiedHeader from "@/components/layout/UnifiedHeader";
import { Music, Bot, PenTool, BookOpen, Activity, Video, SlidersHorizontal, User, Grid3X3, Palette, FileText, Target, Volume2, Wand2, TrendingUp, Brain, Sparkles } from "lucide-react";

export default function Home() {
  const tools = [
    { title: "Musaix Explore", href: "/music-player", icon: Grid3X3, color: "from-[#FF4081] to-[#AB47BC]" },
    { title: "Production", href: "/beat-generator", icon: Music, color: "from-[#AB47BC] to-[#3F51B5]" },
    { title: "Style Prompt", href: "/style-transformer", icon: Palette, color: "from-[#FFC107] to-[#FF4081]" },
    { title: "Artist Profile", href: "/artist-profile", icon: User, color: "from-[#FF4081] to-[#AB47BC]" },
    
    { title: "Songwriter", href: "/songwriter", icon: PenTool, color: "from-[#AB47BC] to-[#3F51B5]" },
    { title: "Rap Lyrics", href: "/complexity-scoring", icon: Bot, color: "from-[#FFC107] to-[#FF4081]" },
    { title: "Sound Design", href: "/sounddesign", icon: SlidersHorizontal, color: "from-[#FF4081] to-[#AB47BC]" },
    { title: "Song Notebook", href: "/notebook", icon: BookOpen, color: "from-[#AB47BC] to-[#3F51B5]" },
    
    { title: "Lyric Animator", href: "/lyric-animator", icon: Video, color: "from-[#FFC107] to-[#FF4081]" },
    { title: "Meta Track", href: "/flow-analyzer", icon: Target, color: "from-[#FF4081] to-[#AB47BC]" },
    { title: "Sound Signature", href: "/sound-signature", icon: Volume2, color: "from-[#AB47BC] to-[#3F51B5]" },
    { title: "Style Transform", href: "/style-transformer", icon: Wand2, color: "from-[#FFC107] to-[#FF4081]" },
    
    { title: "Lyrics Score", href: "/complexity-scoring", icon: TrendingUp, color: "from-[#FF4081] to-[#AB47BC]" },
    { title: "Energy Meter", href: "/energy-meter", icon: Activity, color: "from-[#AB47BC] to-[#3F51B5]" },
    { title: "Flow Analysis", href: "/flow-analyzer", icon: Brain, color: "from-[#FFC107] to-[#FF4081]" },
    { title: "Genre Engine", href: "/genre-recommendation", icon: Target, color: "from-[#FF4081] to-[#AB47BC]" },
  ];

  return (
    <div className="min-h-screen bg-black">
      <UnifiedHeader />
      
      {/* Main Content */}
      <div className="flex min-h-screen">
        {/* Left Side - Branding and Auth */}
        <div className="w-1/3 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="space-y-4">
              <div className="w-32 h-32 mx-auto rounded-3xl bg-gradient-to-br from-[#FF4081] to-[#AB47BC] flex items-center justify-center shadow-2xl musaix-glow">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <Music className="h-10 w-10 text-[#FF4081]" />
                </div>
              </div>
              <h1 className="text-5xl font-bold">
                <span className="musaix-gradient-text">MUSAIX</span>
              </h1>
            </div>

            {/* Auth Buttons */}
            <div className="space-y-4 w-full max-w-xs">
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-[#FF4081] to-[#AB47BC] hover:from-[#FF4081]/90 hover:to-[#AB47BC]/90 text-white font-semibold py-3 px-6 rounded-xl shadow-lg musaix-glow" 
                asChild
              >
                <Link href="/register">Sign Up</Link>
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
        <div className="flex-1 p-8 bg-gradient-to-br from-gray-900 to-black">
          <div className="grid grid-cols-4 gap-8 h-full">
            {tools.map((tool, index) => (
              <Link key={index} href={tool.href}>
                <Card className="h-56 bg-gray-800/60 hover:bg-gray-700/60 border-2 border-gray-600 hover:border-gray-400 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl musaix-card-border hover:musaix-glow rounded-3xl">
                  <CardContent className="p-8 h-full flex flex-col justify-between items-center text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                      <tool.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base group-hover:text-[#FF4081] transition-colors duration-300 leading-tight">
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