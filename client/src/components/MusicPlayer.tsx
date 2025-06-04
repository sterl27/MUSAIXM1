import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Music,
  Clock,
  User
} from "lucide-react";

interface Song {
  id: string;
  title: string;
  fileUrl: string;
  uploadDate: string;
  duration?: number;
  artist?: string;
}

interface MusicPlayerProps {
  playlist: Song[];
  currentSongIndex: number;
  onSongChange: (index: number) => void;
  className?: string;
  showPlaylist?: boolean;
}

export default function MusicPlayer({ 
  playlist, 
  currentSongIndex, 
  onSongChange, 
  className,
  showPlaylist = true 
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  const currentSong = playlist[currentSongIndex];

  // Format time display
  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Update progress
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Play/Pause toggle
  const togglePlayPause = async () => {
    if (!audioRef.current || !currentSong) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Next song
  const nextSong = () => {
    if (playlist.length === 0) return;
    
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentSongIndex + 1) % playlist.length;
    }
    onSongChange(nextIndex);
  };

  // Previous song
  const previousSong = () => {
    if (playlist.length === 0) return;
    
    let prevIndex;
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * playlist.length);
    } else {
      prevIndex = currentSongIndex === 0 ? playlist.length - 1 : currentSongIndex - 1;
    }
    onSongChange(prevIndex);
  };

  // Seek to position
  const seekTo = (value: number[]) => {
    if (audioRef.current) {
      const newTime = (value[0] / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Volume control
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleTimeUpdate = updateProgress;
    const handleLoadedMetadata = updateProgress;
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextSong();
      }
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeat, currentSongIndex]);

  // Load current song
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.fileUrl;
      audioRef.current.volume = volume / 100;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [currentSong, volume]);

  if (!currentSong) {
    return (
      <Card className={cn("musaix-card-border bg-black/50", className)}>
        <CardContent className="p-6 text-center">
          <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">No songs in playlist</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Main Player */}
      <Card className="musaix-card-border bg-black/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-lg">{currentSong.title}</CardTitle>
              <p className="text-sm text-gray-400">
                {currentSong.artist || "Unknown Artist"}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsShuffle(!isShuffle)}
                className={cn(
                  "text-gray-400 hover:text-white",
                  isShuffle && "text-[#FF4081]"
                )}
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsRepeat(!isRepeat)}
                className={cn(
                  "text-gray-400 hover:text-white",
                  isRepeat && "text-[#FF4081]"
                )}
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={seekTo}
              max={100}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousSong}
              className="text-white hover:text-[#FF4081]"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              onClick={togglePlayPause}
              disabled={isLoading}
              className="musaix-gradient-button h-12 w-12 rounded-full p-0"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextSong}
              className="text-white hover:text-[#FF4081]"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-gray-400 hover:text-white"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={100}
              className="flex-1"
            />
            <span className="text-sm text-gray-400 w-8">{isMuted ? 0 : volume}</span>
          </div>
        </CardContent>
      </Card>

      {/* Playlist */}
      {showPlaylist && playlist.length > 0 && (
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Music className="h-5 w-5" />
              Playlist ({playlist.length} songs)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-64 overflow-y-auto">
            {playlist.map((song, index) => (
              <div
                key={song.id}
                onClick={() => onSongChange(index)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors",
                  index === currentSongIndex 
                    ? "bg-[#FF4081]/20 border border-[#FF4081]/50" 
                    : "hover:bg-gray-800"
                )}
              >
                <div className="flex-shrink-0">
                  {index === currentSongIndex && isPlaying ? (
                    <div className="h-4 w-4 flex items-center justify-center">
                      <div className="flex gap-0.5">
                        <div className="w-0.5 h-3 bg-[#FF4081] animate-pulse" />
                        <div className="w-0.5 h-2 bg-[#FF4081] animate-pulse delay-75" />
                        <div className="w-0.5 h-4 bg-[#FF4081] animate-pulse delay-150" />
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 w-4 text-center">
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-medium truncate",
                    index === currentSongIndex ? "text-[#FF4081]" : "text-white"
                  )}>
                    {song.title}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {song.artist || "Unknown Artist"}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(song.duration || 0)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}