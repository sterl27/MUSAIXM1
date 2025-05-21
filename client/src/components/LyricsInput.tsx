import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenSquare, Eraser, ClipboardCopy, Loader2, Zap } from "lucide-react";

interface LyricsInputProps {
  lyrics: string;
  onLyricsChange: (lyrics: string) => void;
  onEnhance: () => void;
  onClear: () => void;
  onPaste: () => void;
  isEnhancing: boolean;
}

export default function LyricsInput({ 
  lyrics, 
  onLyricsChange, 
  onEnhance, 
  onClear, 
  onPaste,
  isEnhancing 
}: LyricsInputProps) {
  return (
    <div className="bg-card rounded-xl shadow-lg p-5 border border-muted h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-xl flex items-center">
          <PenSquare className="text-primary mr-2" size={20} />
          Lyric Editor
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPaste} 
            className="flex items-center" 
            title="Paste from clipboard"
          >
            <ClipboardCopy size={14} className="mr-1" />
            <span>Paste</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClear} 
            className="flex items-center" 
            title="Clear text"
          >
            <Eraser size={14} className="mr-1" />
            <span>Clear</span>
          </Button>
        </div>
      </div>
      
      {/* Prompt suggestions */}
      <div className="bg-muted/50 rounded-md p-3 mb-3 text-sm">
        <h3 className="font-medium mb-1 text-foreground/80">Prompt Suggestions:</h3>
        <ul className="list-disc list-inside text-muted-foreground space-y-1">
          <li>Enter original lyrics you want to enhance</li>
          <li>Choose a persona to define the style and genre</li>
          <li>Adjust enhancement tools for different results</li>
        </ul>
      </div>
      
      <div className="line-numbers flex-grow relative">
        <Textarea
          className="bg-muted w-full h-full p-4 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary text-base"
          placeholder="Write or paste your lyrics here..."
          value={lyrics}
          onChange={(e) => onLyricsChange(e.target.value)}
        />
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          <span>{lyrics.length}</span> characters
        </div>
        <Button 
          className="px-5 py-6 bg-primary hover:bg-primary/90 transition-colors rounded-md font-medium flex items-center space-x-2"
          onClick={onEnhance}
          disabled={isEnhancing || !lyrics.trim()}
          size="lg"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span className="text-lg">Enhancing...</span>
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              <span className="text-lg">Enhance Lyrics</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
