import { useState, useEffect } from "react";
import { Persona } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Play, Volume2, Square, VolumeX } from "lucide-react";

interface VoicePreviewProps {
  persona: Persona;
  sampleText?: string;
}

export default function VoicePreview({ persona, sampleText }: VoicePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [voiceOptions, setVoiceOptions] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  // Default sample text if none provided
  const defaultText = "Welcome to Musaix. Let's enhance these lyrics with some Southern flow.";
  const textToSpeak = sampleText || defaultText;
  
  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
      
      // Get voices and set up event listener for voices changed
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoiceOptions(availableVoices);
        
        // Select a voice based on persona
        const voiceMap: Record<string, string> = {
          "outkast": "en-US", // Deep Southern accent
          "goodiemob": "en-US", // Soulful voice
          "liljon": "en-US", // Energetic voice
          "ti": "en-US" // Smooth flow
        };
        
        // Try to find a voice that matches the preferred locale
        const preferredLocale = voiceMap[persona.id] || "en-US";
        const matchingVoice = availableVoices.find(voice => 
          voice.lang.includes(preferredLocale)
        );
        
        if (matchingVoice) {
          setSelectedVoice(matchingVoice);
        } else if (availableVoices.length > 0) {
          // Fallback to the first available voice
          setSelectedVoice(availableVoices[0]);
        }
      };
      
      // Load voices initially
      loadVoices();
      
      // Set up event listener for when voices change
      window.speechSynthesis.onvoiceschanged = loadVoices;
      
      // Clean up event listener
      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, [persona.id]);
  
  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis]);
  
  const speak = () => {
    if (!speechSynthesis || !selectedVoice) return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.voice = selectedVoice;
    
    // Adjust rate and pitch based on persona
    switch (persona.id) {
      case "outkast":
        utterance.rate = 0.9; // Slightly slower
        utterance.pitch = 0.9; // Slightly deeper
        break;
      case "goodiemob":
        utterance.rate = 0.85; // Slower, more deliberate
        utterance.pitch = 0.95; // Slightly deeper
        break;
      case "liljon":
        utterance.rate = 1.1; // Faster
        utterance.pitch = 1.1; // Higher
        break;
      case "ti":
        utterance.rate = 1.0; // Normal speed
        utterance.pitch = 0.85; // Deeper
        break;
      default:
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
    }
    
    // Set volume based on mute state
    utterance.volume = isMuted ? 0 : 1;
    
    // Add event listeners
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    // Speak
    speechSynthesis.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // If currently playing, stop and restart with new volume
    if (isPlaying && speechSynthesis) {
      speechSynthesis.cancel();
      setTimeout(speak, 100); // Small delay to ensure cancel completes
    }
  };
  
  return (
    <div className="flex items-center space-x-2 mt-2">
      {isPlaying ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={stopSpeaking}
          className="bg-card hover:bg-muted"
        >
          <Square className="h-4 w-4 mr-1" />
          Stop
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={speak}
          className="bg-card hover:bg-muted"
        >
          <Play className="h-4 w-4 mr-1" />
          Preview Voice
        </Button>
      )}
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleMute}
        className={isMuted ? "text-muted-foreground" : "text-primary"}
      >
        {isMuted ? 
          <VolumeX className="h-4 w-4" /> : 
          <Volume2 className="h-4 w-4" />
        }
      </Button>
      
      <span className="text-xs text-muted-foreground">
        {selectedVoice ? `Using ${selectedVoice.name}` : "No voices available"}
      </span>
    </div>
  );
}