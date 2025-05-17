import { Music, User } from "lucide-react";

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
        <nav>
          <button className="px-4 py-2 rounded-md bg-primary hover:bg-primary/90 transition-colors text-primary-foreground font-medium">
            <User className="inline mr-2" size={16} />Sign In
          </button>
        </nav>
      </div>
    </header>
  );
}
