import { Music, User, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-card border-b border-muted shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-primary text-2xl">
            <Music size={24} />
          </div>
          <h1 className="font-bold text-2xl text-foreground">
            Musaix <span className="text-primary">Lyrics</span> Enhancer
          </h1>
        </div>
        <nav className="flex items-center space-x-4">
          <div className="font-medium hover:text-primary transition-colors">
            <Link href="/">Home</Link>
          </div>
          <div className="flex items-center space-x-1 font-medium hover:text-primary transition-colors">
            <Sparkles size={16} />
            <Link href="/openai">OpenAI</Link>
          </div>
          <div className="flex items-center space-x-1 font-medium hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mic-2"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
            <Link href="/songwriter">Song Writer</Link>
          </div>
          <div className="flex items-center space-x-1 font-medium hover:text-primary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-waveform"><path d="M21 12h1"/><path d="M2 12h1"/><path d="M16.672 12h2.656"/><path d="M4.672 12h2.656"/><path d="M12 12a4 4 0 0 1-4-4V6a4 4 0 0 1 8 0v2a4 4 0 0 1-4 4Z"/><path d="M9 16v-1a3 3 0 0 1 6 0v1"/></svg>
            <Link href="/sounddesign">Sound Design</Link>
          </div>
          <button className="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 transition-colors text-primary-foreground font-medium">
            <User className="inline mr-2" size={16} />Sign In
          </button>
        </nav>
      </div>
    </header>
  );
}
