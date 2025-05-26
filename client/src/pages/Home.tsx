import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UnifiedHeader from "@/components/layout/UnifiedHeader";
import { ArrowRight, Sparkles, Mic, Music, Wand2, Bot, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <UnifiedHeader />
      
      {/* Hero section */}
      <section className="flex-1 musaix-hero-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-black"></div>
        <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="px-4 py-2 bg-gradient-to-r from-[#FF4081]/20 to-[#AB47BC]/20 text-[#FF4081] border border-[#FF4081]/30 musaix-glow">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Lyrics Enhancement
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="musaix-gradient-text musaix-text-glow">Elevate</span>{" "}
                <span className="text-white">Your Rap Lyrics with AI</span>
              </h1>
              
              <p className="text-xl text-gray-300 leading-relaxed">
                Transform your lyrics with artist-specific styles, professional enhancements, and creative production tools powered by cutting-edge AI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button size="lg" className="musaix-gradient-button gap-2 text-white font-semibold py-3 px-6" asChild>
                  <Link href="/notebook">
                    Start Writing
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2 border-[#FF4081]/50 text-[#FF4081] hover:bg-[#FF4081]/10 hover:border-[#FF4081] transition-all duration-300" asChild>
                  <Link href="/openai">
                    Try AI Enhancer
                    <Bot className="h-5 w-5" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-4 pt-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FFC107] to-[#FF4081] flex items-center justify-center text-white text-sm font-bold border-2 border-black">JD</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF4081] to-[#AB47BC] flex items-center justify-center text-white text-sm font-bold border-2 border-black">TW</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#AB47BC] to-[#3F51B5] flex items-center justify-center text-white text-sm font-bold border-2 border-black">MK</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3F51B5] to-[#FFC107] flex items-center justify-center text-white text-sm font-bold border-2 border-black">+</div>
                </div>
                <p className="text-sm text-gray-400">Join 2,000+ artists already using <span className="musaix-gradient-text font-semibold">Musaix</span></p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 musaix-animated-bg rounded-lg blur-sm opacity-60"></div>
              <Card className="relative musaix-glass rounded-lg overflow-hidden border-0 musaix-glow">
                <div className="absolute top-3 right-3 z-10 flex gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-[#FFC107] rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <CardContent className="p-0">
                  <div className="bg-black text-white p-8 font-mono space-y-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[#FF4081]" />
                      <p className="font-semibold musaix-gradient-text">Musaix AI Enhancement</p>
                    </div>
                    <p className="text-gray-400 italic">Transform these lyrics in the style of OutKast with Southern flow, complex rhyme schemes, and vibrant storytelling</p>
                    <div className="h-px bg-gradient-to-r from-[#FF4081] to-[#AB47BC] my-4"></div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-300 font-semibold mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                          Original:
                        </p>
                        <p className="text-sm text-gray-400 leading-relaxed pl-4 border-l-2 border-gray-700">
                          I walk through the city streets at night<br/>
                          Looking for a place where I belong<br/>
                          Every face I see tells a different story<br/>
                          But none of them feel like my own
                        </p>
                      </div>
                      <div className="h-px bg-gradient-to-r from-[#AB47BC] to-[#3F51B5] my-4"></div>
                      <div>
                        <p className="text-gray-300 font-semibold mb-2 flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#FF4081] rounded-full"></span>
                          Enhanced:
                        </p>
                        <p className="text-sm text-[#FFC107] leading-relaxed pl-4 border-l-2 border-[#FF4081] musaix-text-glow">
                          I stroll through them ATL streets when the moon is right (yeah)<br/>
                          Searchin' for a spot where a player might belong (c'mon)<br/>
                          Every face I pass got a different Southern tale to tell (tell it)<br/>
                          But ain't none of them narratives soundin' like my own (Outkast!)
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="bg-black py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF4081]/5 to-transparent"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-white">Powerful Features for </span>
              <span className="musaix-gradient-text">Rap Artists</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">Everything you need to create professional-quality lyrics with cutting-edge AI technology</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="musaix-card-border bg-black/50 hover:bg-black/70 transition-all duration-300 group hover:musaix-glow">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-[#FF4081] to-[#AB47BC] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">AI-Powered Enhancement</h3>
                <p className="text-gray-300 leading-relaxed">Transform your lyrics with OpenAI's advanced language models for professional-quality results that match industry standards.</p>
              </CardContent>
            </Card>
            
            <Card className="musaix-card-border bg-black/50 hover:bg-black/70 transition-all duration-300 group hover:musaix-glow">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-[#FFC107] to-[#FF4081] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mic className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Artist Personas</h3>
                <p className="text-gray-300 leading-relaxed">Apply the style and flow of legendary artists to your lyrics with our persona-based enhancement engine.</p>
              </CardContent>
            </Card>
            
            <Card className="musaix-card-border bg-black/50 hover:bg-black/70 transition-all duration-300 group hover:musaix-glow">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-r from-[#AB47BC] to-[#3F51B5] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wand2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Style Transformer</h3>
                <p className="text-gray-300 leading-relaxed">Switch between musical styles and genres with our advanced style transformation technology.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="bg-black py-20 relative overflow-hidden">
        <div className="absolute inset-0 musaix-animated-bg opacity-10"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Ready to </span>
            <span className="musaix-gradient-text musaix-text-glow">Elevate</span>
            <span className="text-white"> Your Music?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of artists using <span className="musaix-gradient-text font-semibold">Musaix Rap Pro</span> to create better lyrics faster with AI-powered enhancements that transform your creative process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="musaix-gradient-button gap-3 text-white font-semibold py-4 px-8 text-lg">
              <Link href="/signup">Sign Up Free</Link>
              <Zap className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="gap-3 border-[#FF4081]/50 text-[#FF4081] hover:bg-[#FF4081]/10 hover:border-[#FF4081] py-4 px-8 text-lg">
              <Link href="/openai">Try Demo</Link>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-400">No credit card required • Free forever plan available</p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <Music className="h-8 w-8 text-[#FF4081]" />
              <p className="font-bold text-xl musaix-gradient-text">Musaix Rap Pro</p>
            </div>
            <div className="flex gap-8 mb-6 md:mb-0">
              <Link href="/">
                <span className="text-gray-400 hover:text-[#FF4081] transition-colors duration-300">Terms</span>
              </Link>
              <Link href="/">
                <span className="text-gray-400 hover:text-[#FF4081] transition-colors duration-300">Privacy</span>
              </Link>
              <Link href="/">
                <span className="text-gray-400 hover:text-[#FF4081] transition-colors duration-300">Contact</span>
              </Link>
              <Link href="/admin">
                <span className="text-gray-400 hover:text-[#FF4081] transition-colors duration-300">Admin</span>
              </Link>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">© 2025 <span className="musaix-gradient-text">Musaix</span>. All rights reserved.</p>
              <p className="text-xs text-gray-500 mt-1">Powered by AI • Built for Artists</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
