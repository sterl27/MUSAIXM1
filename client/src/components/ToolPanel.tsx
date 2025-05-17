import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { EnhancementOptions } from "@/lib/types";
import { 
  Settings, 
  Tags, 
  Sparkles, 
  Drum, 
  Music2, 
  Bell, 
  Speaker, 
  Waves,
  Activity
} from "lucide-react";

interface ToolPanelProps {
  options: EnhancementOptions;
  onUpdateOptions: (options: Partial<EnhancementOptions>) => void;
}

export default function ToolPanel({ options, onUpdateOptions }: ToolPanelProps) {
  return (
    <div className="bg-card rounded-xl shadow-lg p-5 border border-muted">
      <h2 className="font-semibold text-xl mb-4 flex items-center">
        <Settings className="text-accent mr-2" size={20} />
        Enhancement Tools
      </h2>
      
      <div className="space-y-5">
        {/* Suno Tags */}
        <div className="border-b border-muted pb-4">
          <div className="flex justify-between items-center mb-3">
            <Label className="font-medium flex items-center cursor-pointer">
              <Tags className="text-accent mr-2" size={16} />
              Suno Tags
            </Label>
            <Switch 
              checked={options.includeSunoTags} 
              onCheckedChange={(checked) => onUpdateOptions({ includeSunoTags: checked })}
              id="suno-tags"
            />
          </div>
          <p className="text-muted-foreground text-sm mb-3">
            Include production style tags for AI music generation
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="suno-tag">
              <Drum className="text-xs mr-1" size={12} /> trap drums
            </span>
            <span className="suno-tag">
              <Music2 className="text-xs mr-1" size={12} /> 808 bass
            </span>
            <span className="suno-tag">
              <Bell className="text-xs mr-1" size={12} /> dirty south
            </span>
          </div>
        </div>
        
        {/* FX Cues */}
        <div className="border-b border-muted pb-4">
          <div className="flex justify-between items-center mb-3">
            <Label className="font-medium flex items-center cursor-pointer">
              <Sparkles className="text-accent mr-2" size={16} />
              FX Cues
            </Label>
            <Switch 
              checked={options.includeFxCues} 
              onCheckedChange={(checked) => onUpdateOptions({ includeFxCues: checked })}
              id="fx-cues"
            />
          </div>
          <p className="text-muted-foreground text-sm mb-3">
            Add vocal effect suggestions throughout lyrics
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="fx-tag">
              <Speaker className="text-xs mr-1" size={12} /> echo
            </span>
            <span className="fx-tag">
              <Waves className="text-xs mr-1" size={12} /> reverb
            </span>
            <span className="fx-tag">
              <Activity className="text-xs mr-1" size={12} /> distortion
            </span>
          </div>
        </div>
        
        {/* Flow Style */}
        <div>
          <Label className="font-medium flex items-center mb-3">
            <Activity className="text-accent mr-2" size={16} />
            Flow Style Strength
          </Label>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">Subtle</span>
            <Slider 
              min={1} 
              max={5} 
              step={1}
              value={[options.flowStrength]} 
              onValueChange={(values) => onUpdateOptions({ flowStrength: values[0] })}
              className="flex-grow"
            />
            <span className="text-sm text-muted-foreground">Strong</span>
          </div>
        </div>
      </div>
    </div>
  );
}
