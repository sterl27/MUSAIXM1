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
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl flex items-center">
          <PenSquare className="text-primary mr-2" size={20} />
          Your Lyrics
        </h2>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClear} 
            className="text-muted-foreground hover:text-foreground" 
            title="Clear text"
          >
            <Eraser size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onPaste} 
            className="text-muted-foreground hover:text-foreground" 
            title="Paste from clipboard"
          >
            <ClipboardCopy size={16} />
          </Button>
        </div>
      </div>
      
      <div className="line-numbers flex-grow relative">
        <Textarea
          className="bg-muted w-full h-full p-3 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary"
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
          className="px-5 py-2 bg-primary hover:bg-primary/90 transition-colors rounded-md font-medium flex items-center space-x-2"
          onClick={onEnhance}
          disabled={isEnhancing || !lyrics.trim()}
        >
          {isEnhancing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Enhancing...</span>
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              <span>Enhance Lyrics</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
