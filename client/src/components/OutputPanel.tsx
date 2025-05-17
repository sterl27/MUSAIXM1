import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Persona } from "@/lib/types";
import { Sparkles, ToggleLeft, ToggleRight, Copy, AlertCircle, FileText, Download } from "lucide-react";

interface OutputPanelProps {
  enhancedLyrics: string | null;
  isEnhancing: boolean;
  persona: Persona;
  error: string | null;
}

export default function OutputPanel({ 
  enhancedLyrics, 
  isEnhancing, 
  persona,
  error
}: OutputPanelProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  
  const copyToClipboard = () => {
    if (enhancedLyrics) {
      navigator.clipboard.writeText(enhancedLyrics);
    }
  };
  
  const saveLyricsToFile = () => {
    if (enhancedLyrics) {
      // Create a blob with the enhanced lyrics
      const blob = new Blob([enhancedLyrics], { type: "text/plain" });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a download link
      const a = document.createElement("a");
      a.href = url;
      a.download = `enhanced_lyrics_${new Date().getTime()}.txt`;
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };
  
  // Function to parse and format the enhanced lyrics with proper styling
  const formatLyrics = (lyrics: string) => {
    if (!lyrics) return null;
    
    // Split by lines
    const lines = lyrics.split('\n');
    
    return lines.map((line, index) => {
      // Style Suno tags
      let styledLine = line;
      
      // Match [SUNO: something]
      const sunoMatch = line.match(/\[SUNO:(.*?)\]/);
      if (sunoMatch) {
        return (
          <p key={index} className="mb-2">
            <span className="suno-annotation">{line}</span>
          </p>
        );
      }
      
      // Match [ECHO], [REVERB], etc.
      const fxMatch = line.match(/(\[.*?\])/g);
      if (fxMatch) {
        const parts = line.split(/(\[.*?\])/g);
        return (
          <p key={index} className="mb-1 leading-relaxed">
            {parts.map((part, partIndex) => {
              if (part.match(/\[.*?\]/)) {
                return <span key={partIndex} className="fx-annotation">{part}</span>;
              }
              return <span key={partIndex}>{part}</span>;
            })}
          </p>
        );
      }
      
      return <p key={index} className="mb-1 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-5 border border-muted h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl flex items-center">
          <Sparkles className="text-secondary mr-2" size={20} />
          Enhanced Lyrics
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowOriginal(!showOriginal)}
            className={`text-muted-foreground hover:text-foreground ${showOriginal ? 'text-secondary' : ''}`} 
            title="Toggle original/enhanced view"
            disabled={!enhancedLyrics}
          >
            {showOriginal ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={copyToClipboard} 
            className="text-muted-foreground hover:text-foreground" 
            title="Copy to clipboard"
            disabled={!enhancedLyrics}
          >
            <Copy size={16} />
          </Button>
        </div>
      </div>
      
      <div className="relative flex-grow overflow-auto">
        <div className="bg-muted p-4 rounded-md h-full overflow-auto">
          {isEnhancing ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin mb-4"></div>
              <p className="text-foreground">Enhancing your lyrics...</p>
              <p className="text-muted-foreground text-sm mt-2">
                Applying {persona.name} style persona
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-center">{error}</p>
            </div>
          ) : enhancedLyrics ? (
            formatLyrics(enhancedLyrics)
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FileText className="h-8 w-8 mb-2" />
              <p>Enhanced lyrics will appear here</p>
            </div>
          )}
        </div>
      </div>
      
      {enhancedLyrics && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Enhanced by <span className="text-primary">{persona.name}</span> persona
          </div>
          <Button 
            className="px-4 py-2 bg-secondary hover:bg-secondary/90 transition-colors rounded-md font-medium text-secondary-foreground flex items-center space-x-2"
            onClick={saveLyricsToFile}
          >
            <Download className="mr-2 h-4 w-4" />
            <span>Save Lyrics</span>
          </Button>
        </div>
      )}
    </div>
  );
}
