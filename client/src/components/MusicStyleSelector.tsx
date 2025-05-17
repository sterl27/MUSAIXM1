import { MusicStyle } from "@/lib/types";
import { getMusicStyles } from "@/lib/types";
import { 
  Music2, 
  Drum, 
  Radio, 
  TrendingUp, 
  Coffee, 
  CheckCircle, 
  Disc,
  Music,
  Guitar
} from "lucide-react";

interface MusicStyleSelectorProps {
  selectedMusicStyle: string | null;
  onSelectMusicStyle: (styleId: string | null) => void;
}

export default function MusicStyleSelector({ 
  selectedMusicStyle, 
  onSelectMusicStyle 
}: MusicStyleSelectorProps) {
  const musicStyles = getMusicStyles();
  
  // Function to render the appropriate icon based on style.icon
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "bass":
        return <TrendingUp className="text-secondary" />;
      case "drum":
        return <Drum className="text-secondary" />;
      case "music":
        return <Music className="text-secondary" />;
      case "trending-up":
        return <TrendingUp className="text-secondary" />;
      case "radio":
        return <Radio className="text-secondary" />;
      case "coffee":
        return <Coffee className="text-secondary" />;
      case "guitar":
        return <Guitar className="text-secondary" />;
      case "disc":
        return <Disc className="text-secondary" />;
      default:
        return <Music2 className="text-secondary" />;
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-5 border border-muted mt-6">
      <h2 className="font-semibold text-xl mb-4 flex items-center">
        <Disc className="text-secondary mr-2" size={20} />
        Music Style
      </h2>
      <p className="text-muted-foreground text-sm mb-4">
        Select a music style to match your lyrics
      </p>
      
      <div className="grid grid-cols-3 gap-3">
        {musicStyles.map((style) => (
          <div className="relative" key={style.id}>
            <input 
              type="radio" 
              id={`style-${style.id}`}
              name="musicStyle" 
              value={style.id}
              className="peer sr-only" 
              checked={selectedMusicStyle === style.id}
              onChange={() => onSelectMusicStyle(style.id)}
            />
            <label 
              htmlFor={`style-${style.id}`} 
              className="flex flex-col items-center p-3 border-2 border-muted rounded-lg cursor-pointer hover:bg-muted transition-colors peer-checked:border-accent peer-checked:bg-muted"
            >
              <div className="text-2xl mb-1">
                {renderIcon(style.icon)}
              </div>
              <span className="font-medium text-sm">{style.name}</span>
              <span className="text-xs text-muted-foreground">{style.description}</span>
            </label>
            <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-accent">
              <CheckCircle size={16} />
            </div>
          </div>
        ))}
        <div className="relative">
          <input 
            type="radio" 
            id="style-none"
            name="musicStyle" 
            value=""
            className="peer sr-only" 
            checked={selectedMusicStyle === null}
            onChange={() => onSelectMusicStyle(null)}
          />
          <label 
            htmlFor="style-none" 
            className="flex flex-col items-center p-3 border-2 border-muted rounded-lg cursor-pointer hover:bg-muted transition-colors peer-checked:border-accent peer-checked:bg-muted"
          >
            <div className="text-2xl mb-1">
              <Music2 className="text-muted-foreground" />
            </div>
            <span className="font-medium text-sm">None</span>
            <span className="text-xs text-muted-foreground">No specific style</span>
          </label>
          <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-accent">
            <CheckCircle size={16} />
          </div>
        </div>
      </div>
    </div>
  );
}