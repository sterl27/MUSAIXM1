import { useState, useEffect, useRef } from "react";
import { Persona } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Play, Volume2, Square, VolumeX, Settings, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Voice {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  labels?: Record<string, string>;
}

interface VoicePreviewProps {
  persona: Persona;
  sampleText?: string;
}

export default function VoicePreview({ persona, sampleText }: VoicePreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [defaultVoiceId, setDefaultVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Default sample text if none provided
  const defaultText = `Hi, I'm ${persona.name}. Let me show you my unique style.`;
  const textToSpeak = sampleText || defaultText;

  // Fetch available voices
  const { data: voicesData, isLoading: voicesLoading, error: voicesError } = useQuery({
    queryKey: ['/api/voices'],
    queryFn: async () => {
      try {
        const response = await apiRequest('/api/voices');
        return response.voices as Voice[];
      } catch (error) {
        console.error('Error fetching voices:', error);
        throw error;
      }
    },
    retry: 1, // Only retry once
    enabled: showSettings, // Only fetch when settings are shown
  });

  // Fetch the default voice mapping for this persona
  const { data: voiceMappingData } = useQuery({
    queryKey: ['/api/voice/mapping', persona.id],
    queryFn: async () => {
      try {
        const response = await apiRequest(`/api/voice/mapping/${persona.id}`);
        return response.voiceId as string;
      } catch (error) {
        console.error('Error fetching voice mapping:', error);
        throw error;
      }
    },
    retry: 1,
    onSuccess: (data) => {
      if (!selectedVoiceId) {
        setSelectedVoiceId(data);
        setDefaultVoiceId(data);
      }
    }
  });

  // Function to play audio
  const speak = async () => {
    if (!selectedVoiceId) {
      toast({
        title: "Voice not selected",
        description: "Please select a voice first or wait for voices to load.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/voice/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToSpeak,
          voiceId: selectedVoiceId,
        }),
      });

      if (!response.ok) {
        let errorMsg = "Failed to generate voice preview";
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          // If we can't parse the error as JSON, use the default message
        }
        throw new Error(errorMsg);
      }

      // Get audio blob from response
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create or update audio element
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.volume = isMuted ? 0 : 1;
        
        audioRef.current.onplay = () => setIsPlaying(true);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onpause = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
          toast({
            title: "Playback Error",
            description: "There was an error playing the audio.",
            variant: "destructive"
          });
        };
      } else {
        audioRef.current.src = audioUrl;
        audioRef.current.volume = isMuted ? 0 : 1;
      }

      // Play the audio
      await audioRef.current.play();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error generating voice preview:', error);
      toast({
        title: "Voice Preview Failed",
        description: error instanceof Error ? error.message : "Failed to generate voice preview",
        variant: "destructive"
      });
    }
  };
  
  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    // Update audio volume if playing
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 1 : 0;
    }
  };

  // Clean up audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Handle voice selection
  const handleVoiceChange = (value: string) => {
    setSelectedVoiceId(value);
    // Stop any currently playing audio
    if (isPlaying) {
      stopSpeaking();
    }
  };

  // Display error if voices couldn't be fetched
  if (showSettings && voicesError) {
    return (
      <div className="flex flex-col space-y-2 p-3 border rounded-md border-destructive/50 bg-destructive/10">
        <div className="flex items-center text-destructive">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Voice service unavailable</span>
        </div>
        <p className="text-xs text-muted-foreground">
          There was an error connecting to the voice service. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2 mt-2">
      <div className="flex items-center space-x-2">
        {isPlaying ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={stopSpeaking}
            className="bg-card hover:bg-muted"
            disabled={isLoading}
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
            disabled={isLoading || !selectedVoiceId}
          >
            <Play className="h-4 w-4 mr-1" />
            {isLoading ? "Loading..." : "Preview Voice"}
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMute}
          className={isMuted ? "text-muted-foreground" : "text-primary"}
          disabled={isLoading}
        >
          {isMuted ? 
            <VolumeX className="h-4 w-4" /> : 
            <Volume2 className="h-4 w-4" />
          }
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
          title="Voice Settings"
          className={showSettings ? "text-primary" : "text-muted-foreground"}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      {showSettings && (
        <div className="bg-muted/30 rounded-md p-2 space-y-2">
          <div className="grid gap-2">
            <label htmlFor="voice-select" className="text-xs font-medium">
              Select Voice
            </label>
            <Select value={selectedVoiceId || ''} onValueChange={handleVoiceChange}>
              <SelectTrigger id="voice-select" className="text-xs h-8">
                <SelectValue placeholder={voicesLoading ? "Loading voices..." : "Select a voice"} />
              </SelectTrigger>
              <SelectContent>
                {defaultVoiceId && (
                  <SelectItem value={defaultVoiceId} className="text-xs">
                    {voicesData?.find(v => v.voice_id === defaultVoiceId)?.name || `${persona.name}'s Voice`} (Recommended)
                  </SelectItem>
                )}
                {voicesData?.map(voice => (
                  voice.voice_id !== defaultVoiceId && (
                    <SelectItem key={voice.voice_id} value={voice.voice_id} className="text-xs">
                      {voice.name}
                      {voice.category ? ` (${voice.category})` : ''}
                    </SelectItem>
                  )
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              The voice preview uses ElevenLabs for high-quality voice synthesis.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}