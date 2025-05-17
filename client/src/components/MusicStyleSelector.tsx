import { MusicStyle, getMusicStyles, getMusicStyleById } from "@/lib/types";
import { 
  Music2, 
  Drum, 
  Radio, 
  TrendingUp, 
  Coffee, 
  CheckCircle, 
  Disc,
  Music,
  Guitar,
  FileText
} from "lucide-react";
import { useState, useEffect } from "react";

interface MusicStyleSelectorProps {
  selectedMusicStyle: string | null;
  onSelectMusicStyle: (styleId: string | null) => void;
  onDescriptionChange?: (description: string) => void;
}

export default function MusicStyleSelector({ 
  selectedMusicStyle, 
  onSelectMusicStyle,
  onDescriptionChange 
}: MusicStyleSelectorProps) {
  const musicStyles = getMusicStyles();
  const [styleDescription, setStyleDescription] = useState<string>("");
  
  // Update the style description when the selected style changes
  useEffect(() => {
    if (selectedMusicStyle) {
      const style = getMusicStyleById(selectedMusicStyle);
      if (style) {
        setStyleDescription(style.sunoDescription);
        // Notify parent component of description change
        if (onDescriptionChange) {
          onDescriptionChange(style.sunoDescription);
        }
      }
    } else {
      setStyleDescription("");
      // Clear description when no style is selected
      if (onDescriptionChange) {
        onDescriptionChange("");
      }
    }
  }, [selectedMusicStyle, onDescriptionChange]);

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
      
      <div className="grid grid-cols-3 gap-3 mb-4">
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

      {/* Suno Description Text Box - Always visible */}
      <div className="mt-4">
        <div className="flex items-center mb-2">
          <FileText className="text-secondary mr-2" size={16} />
          <h3 className="font-medium text-sm">Suno Description</h3>
        </div>
        <textarea
          value={styleDescription}
          onChange={(e) => {
            const newDescription = e.target.value;
            setStyleDescription(newDescription);
            if (onDescriptionChange) {
              onDescriptionChange(newDescription);
            }
          }}
          className="w-full min-h-[150px] p-3 bg-background border border-muted rounded-lg resize-none text-sm focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder={selectedMusicStyle ? "Edit the Suno description" : "Select a music style to see its description"}
        />
      </div>
    </div>
  );
}