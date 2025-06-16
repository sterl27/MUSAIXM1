import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import UnifiedHeader from "@/components/layout/UnifiedHeader";
import AnimatedSoundWaveBackground from "@/components/AnimatedSoundWaveBackground";
import {
  Music, Bot, PenTool, BookOpen, Activity, SlidersHorizontal,
  User, Target, Brain, BarChart3
} from "lucide-react";

export default function Home() {
  const drumPads = [
    { title: "Songwriter Studio", href: "/songwriter-studio", icon: PenTool, color: "#FF4081", description: "Complete songwriting workspace", position: "A1" },
    { title: "Analysis Studio", href: "/analysis-studio", icon: BarChart3, color: "#AB47BC", description: "Advanced lyric analysis tools", position: "A2" },
    { title: "Beat Studio", href: "/beat-studio", icon: Music, color: "#3F51B5", description: "Professional beat creation", position: "A3" },
    { title: "Song Writer", href: "/songwriter", icon: PenTool, color: "#FF6B35", description: "AI-powered lyric generation", position: "B1" },
    { title: "Song Notebook", href: "/notebook", icon: BookOpen, color: "#8E24AA", description: "Write and save lyrics", position: "B2" },
    { title: "Sound Design", href: "/sounddesign", icon: SlidersHorizontal, color: "#00ACC1", description: "Audio production tools", position: "B3" },
    { title: "Genre Engine", href: "/genre-recommendation", icon: Target, color: "#FB8C00", description: "AI genre recommendations", position: "C1" },
    { title: "Energy Meter", href: "/energy-meter", icon: Activity, color: "#E53935", description: "Visualize creative intensity", position: "C2" },
    { title: "Flow Analyzer", href: "/flow-analyzer", icon: Brain, color: "#5E35B1", description: "Analyze flow and cadence", position: "C3" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />

      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-hidden">
        <AnimatedSoundWaveBackground
          isPlaying={false}
          tempo={100}
          intensity={0.4}
          audioElement={null}
          className="opacity-20"
        />

        <div className="p-6 lg:p-12 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-5xl font-extrabold musaix-gradient-text mb-4">
              Musaix Pro Studio
            </h1>
            <p className="text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto">
              AI-powered music production platform with professional creative tools
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {drumPads.map((pad, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href={pad.href}>
                  <div
                    className="relative group bg-gradient-to-br from-gray-800 to-black rounded-2xl p-4 shadow-md border border-gray-700 hover:shadow-xl hover:border-gray-500 transition-all duration-300 cursor-pointer"
                    title={pad.description}
                    aria-label={pad.title}
                  >
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 opacity-40 group-hover:opacity-90" />
                    <div className="absolute top-3 left-3 text-xs text-gray-500 font-mono">{pad.position}</div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: pad.color, boxShadow: `0 0 10px ${pad.color}40` }}
                    >
                      <pad.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-center text-sm font-bold group-hover:text-gray-300">
                      {pad.title}
                    </h3>
                    <p className="mt-1 text-xs text-center text-gray-500 truncate">{pad.description}</p>
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-200"
                      style={{ backgroundColor: pad.color }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4081]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#AB47BC]/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
