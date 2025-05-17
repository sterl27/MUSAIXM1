import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PersonaSelector from "@/components/PersonaSelector";
import MusicStyleSelector from "@/components/MusicStyleSelector";
import ToolPanel from "@/components/ToolPanel";
import LyricsInput from "@/components/LyricsInput";
import OutputPanel from "@/components/OutputPanel";
import { useLyricsEnhancer } from "@/hooks/useLyricsEnhancer";
import { Persona, EnhancementOptions, getMusicStyleById } from "@/lib/types";

export default function Home() {
  const [lyrics, setLyrics] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<Persona>({
    id: "outkast",
    name: "OutKast",
    description: "Southern flow",
    icon: "crown"
  });
  
  const [options, setOptions] = useState<EnhancementOptions>({
    includeSunoTags: true,
    includeFxCues: true,
    flowStrength: 3,
    musicStyle: null
  });
  
  const { 
    enhancedLyrics, 
    isEnhancing, 
    enhance, 
    error 
  } = useLyricsEnhancer();

  const handleEnhance = () => {
    enhance({ lyrics, persona: selectedPersona, options });
  };

  const handleClearLyrics = () => {
    setLyrics("");
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLyrics(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleUpdateOptions = (newOptions: Partial<EnhancementOptions>) => {
    setOptions(prev => ({ ...prev, ...newOptions }));
  };
  
  const handleSelectMusicStyle = (styleId: string | null) => {
    setOptions(prev => ({ ...prev, musicStyle: styleId }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 h-full">
          {/* Left Panel - Tools */}
          <div className="md:col-span-1 space-y-6">
            <PersonaSelector 
              selectedPersona={selectedPersona} 
              onSelectPersona={setSelectedPersona} 
            />
            <MusicStyleSelector
              selectedMusicStyle={options.musicStyle}
              onSelectMusicStyle={handleSelectMusicStyle}
            />
            <ToolPanel 
              options={options} 
              onUpdateOptions={handleUpdateOptions} 
            />
          </div>
          
          {/* Middle Panel - Lyrics Input */}
          <div className="md:col-span-1 flex flex-col">
            <LyricsInput 
              lyrics={lyrics} 
              onLyricsChange={setLyrics} 
              onEnhance={handleEnhance}
              onClear={handleClearLyrics}
              onPaste={handlePasteFromClipboard}
              isEnhancing={isEnhancing}
            />
          </div>
          
          {/* Right Panel - Output/Results */}
          <div className="md:col-span-1 flex flex-col">
            <OutputPanel 
              enhancedLyrics={enhancedLyrics} 
              isEnhancing={isEnhancing} 
              persona={selectedPersona}
              error={error}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
