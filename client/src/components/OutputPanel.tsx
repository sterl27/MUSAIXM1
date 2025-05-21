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
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-xl flex items-center">
          <Sparkles className="text-secondary mr-2" size={20} />
          Enhanced Output
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowOriginal(!showOriginal)}
            className={`flex items-center ${showOriginal ? 'bg-secondary/10' : ''}`} 
            title="Toggle original/enhanced view"
            disabled={!enhancedLyrics}
          >
            {showOriginal ? <ToggleRight size={14} className="mr-1" /> : <ToggleLeft size={14} className="mr-1" />}
            <span>{showOriginal ? 'Original' : 'Enhanced'}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard} 
            className="flex items-center" 
            title="Copy to clipboard"
            disabled={!enhancedLyrics}
          >
            <Copy size={14} className="mr-1" />
            <span>Copy</span>
          </Button>
        </div>
      </div>
      
      {/* Output Explanation */}
      <div className="bg-muted/50 rounded-md p-3 mb-3 text-sm">
        <h3 className="font-medium mb-1 text-foreground/80">Output Legend:</h3>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <span className="suno-annotation py-1 px-2 mr-1">[SUNO: tag]</span>
            <span>Music production tags</span>
          </div>
          <div className="flex items-center">
            <span className="fx-annotation py-1 px-2 mr-1">[ECHO]</span>
            <span>Vocal effect suggestions</span>
          </div>
        </div>
      </div>
      
      <div className="relative flex-grow overflow-auto">
        <div className="bg-muted p-4 rounded-md h-full overflow-auto">
          {isEnhancing ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 border-t-2 border-b-2 border-primary rounded-full animate-spin mb-4"></div>
              <p className="text-foreground">Enhancing your lyrics...</p>
              <p className="text-muted-foreground text-sm mt-2">
                Applying <span className="font-medium">{persona.name}</span> style persona
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-destructive">
              <AlertCircle className="h-8 w-8 mb-2" />
              <p className="text-center">{error}</p>
            </div>
          ) : enhancedLyrics ? (
            <div className="text-base">
              {formatLyrics(enhancedLyrics)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
              <FileText className="h-8 w-8 mb-2" />
              <p className="text-center">Your enhanced lyrics will appear here</p>
              <p className="text-center text-sm mt-2">Enter lyrics and click "Enhance Lyrics" to begin</p>
            </div>
          )}
        </div>
      </div>
      
      {enhancedLyrics && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm font-medium">
            Enhanced with <span className="text-primary">{persona.name}</span> style
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
