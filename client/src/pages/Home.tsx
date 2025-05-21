import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Mic, Music, Wand2, Bot, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Musaix Rap Pro</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="flex-1 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary border-primary/20">
                AI-Powered Lyrics Enhancement
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-primary">Elevate</span> Your Rap Lyrics with AI
              </h1>
              
              <p className="text-xl text-muted-foreground">
                Transform your lyrics with artist-specific styles, professional enhancements, and creative production tools.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2" asChild>
                  <Link href="/openai">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="gap-2" asChild>
                  <Link href="/personas">
                    Explore Personas
                    <Mic className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">JD</div>
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs">TW</div>
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">MK</div>
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs">+</div>
                </div>
                <p className="text-sm text-muted-foreground">Join 2,000+ artists already using Musaix</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur-sm opacity-75"></div>
              <Card className="relative shadow-xl rounded-lg overflow-hidden border-0">
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <CardContent className="p-0">
                  <div className="bg-zinc-950 text-white p-6 font-mono space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-5 w-5" />
                      <p className="font-medium">Musaix AI Prompt</p>
                    </div>
                    <p className="text-zinc-400">Transform these lyrics in the style of OutKast with Southern flow, complex rhyme schemes, and vibrant storytelling</p>
                    <div className="h-px bg-zinc-800 my-4"></div>
                    <div className="space-y-3">
                      <p className="text-zinc-300">Original:</p>
                      <p className="text-sm text-zinc-400">I walk through the city streets at night<br/>Looking for a place where I belong<br/>Every face I see tells a different story<br/>But none of them feel like my own</p>
                      <div className="h-px bg-zinc-800 my-4"></div>
                      <p className="text-zinc-300">Enhanced:</p>
                      <p className="text-sm text-green-400">I stroll through them ATL streets when the moon is right (yeah)<br/>Searchin' for a spot where a player might belong (c'mon)<br/>Every face I pass got a different Southern tale to tell (tell it)<br/>But ain't none of them narratives soundin' like my own (Outkast!)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Powerful Features for Rap Artists</h2>
            <p className="text-muted-foreground mt-2">Everything you need to create professional-quality lyrics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border hover:border-primary/50 transition-colors p-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Enhancement</h3>
                <p className="text-muted-foreground">Transform your lyrics with OpenAI's advanced language models for professional-quality results.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border hover:border-primary/50 transition-colors p-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Artist Personas</h3>
                <p className="text-muted-foreground">Apply the style and flow of legendary artists to your lyrics with our persona-based enhancements.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border hover:border-primary/50 transition-colors p-1">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Style Transformer</h3>
                <p className="text-muted-foreground">Switch between musical styles and genres with our advanced style transformation technology.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Music?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of artists using Musaix Rap Pro to create better lyrics faster with AI-powered enhancements.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
            <Link href="/signup">Sign Up Free</Link>
            <Zap className="h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">No credit card required</p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Music className="h-6 w-6 text-primary" />
              <p className="font-semibold">Musaix Rap Pro</p>
            </div>
            <div className="flex gap-6">
              <Link href="/">
                <span className="text-muted-foreground hover:text-foreground transition-colors">Terms</span>
              </Link>
              <Link href="/">
                <span className="text-muted-foreground hover:text-foreground transition-colors">Privacy</span>
              </Link>
              <Link href="/">
                <span className="text-muted-foreground hover:text-foreground transition-colors">Contact</span>
              </Link>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground">© 2025 Musaix. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
