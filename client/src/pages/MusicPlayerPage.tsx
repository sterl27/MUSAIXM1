import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import UnifiedPageLayout from '@/components/layout/UnifiedPageLayout';
import { 
  Music,
  ExternalLink,
  Play,
  Pause,
  Heart,
  Search,
  Headphones,
  Volume2,
  VolumeX,
  Share2,
  Download,
  Users,
  Clock,
  TrendingUp,
  SkipBack,
  SkipForward,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SoundWaveVisualizer from '@/components/SoundWaveVisualizer';

declare global {
  interface Window {
    SC: any;
  }
}

export default function MusicPlayerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const widgetRef = useRef<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  // Load SoundCloud Widget API
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    script.onload = () => {
      if (iframeRef.current && window.SC) {
        widgetRef.current = window.SC.Widget(iframeRef.current);
        
        // Bind events
        widgetRef.current.bind(window.SC.Widget.Events.READY, () => {
          setIsLoading(false);
          // Set initial volume
          widgetRef.current.setVolume(volume[0]);
        });

        widgetRef.current.bind(window.SC.Widget.Events.PLAY, () => {
          setIsPlaying(true);
        });

        widgetRef.current.bind(window.SC.Widget.Events.PAUSE, () => {
          setIsPlaying(false);
        });

        widgetRef.current.bind(window.SC.Widget.Events.FINISH, () => {
          setIsPlaying(false);
        });

        widgetRef.current.bind(window.SC.Widget.Events.PLAY_PROGRESS, (data: any) => {
          setPosition(data.currentPosition);
          setDuration(data.loadProgress * data.currentPosition / data.relativePosition);
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [volume]);

  // Widget control functions
  const togglePlayPause = () => {
    if (widgetRef.current) {
      widgetRef.current.toggle();
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume);
    if (widgetRef.current) {
      widgetRef.current.setVolume(newVolume[0]);
    }
  };

  const skipNext = () => {
    if (widgetRef.current) {
      widgetRef.current.next();
    }
  };

  const skipPrev = () => {
    if (widgetRef.current) {
      widgetRef.current.prev();
    }
  };

  const seekTo = (percentage: number) => {
    if (widgetRef.current && duration > 0) {
      const seekPosition = (percentage / 100) * duration;
      widgetRef.current.seekTo(seekPosition);
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const featuredPlaylists = [
    {
      title: "Musaix Pro",
      artist: "S73RL",
      description: "Official Musaix Pro curated tracks and beats",
      embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2036321085&color=%23ff4081&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true&show_artwork=true&show_playcount=true&buying=false&sharing=true&download=true&start_track=0&single_active=true",
      soundcloudUrl: "https://soundcloud.com/s73rl/sets/musaix-pro",
      tags: ["Hip Hop", "Rap", "Beats", "Official"],
      isOfficial: true
    },
    {
      title: "Trap Essentials",
      artist: "Various Artists",
      description: "Essential trap beats and instrumentals for your next project",
      embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/example1&color=%23ff4081&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true&show_artwork=true&show_playcount=true&buying=false&sharing=true&download=false&start_track=0&single_active=true",
      soundcloudUrl: "#",
      tags: ["Trap", "Beats", "Instrumentals"],
      isOfficial: false
    },
    {
      title: "Lo-Fi Hip Hop Vibes",
      artist: "Chill Collective",
      description: "Smooth lo-fi beats perfect for studying and relaxation",
      embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/example2&color=%23ab47bc&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true&show_artwork=true&show_playcount=true&buying=false&sharing=true&download=false&start_track=0&single_active=true",
      soundcloudUrl: "#",
      tags: ["Lo-Fi", "Chill", "Study"],
      isOfficial: false
    }
  ];

  const handleSharePlaylist = (title: string, url: string) => {
    if (navigator.share) {
      navigator.share({
        title: `Check out ${title} on SoundCloud`,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied",
        description: "Playlist link copied to clipboard",
      });
    }
  };

  const filteredPlaylists = featuredPlaylists.filter(playlist =>
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <UnifiedPageLayout 
      title="Music Player" 
      description="Stream curated playlists and discover new music"
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white">Music Player</h1>
            <p className="text-gray-400">Discover and stream curated playlists from SoundCloud</p>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search playlists, artists, genres..."
              className="pl-10 bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="musaix-card-border bg-black/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FF4081]/20 rounded-lg">
                  <Music className="h-5 w-5 text-[#FF4081]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-sm text-gray-400">Playlists</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="musaix-card-border bg-black/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#AB47BC]/20 rounded-lg">
                  <Users className="h-5 w-5 text-[#AB47BC]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">2.5K</p>
                  <p className="text-sm text-gray-400">Listeners</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="musaix-card-border bg-black/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FFC107]/20 rounded-lg">
                  <Clock className="h-5 w-5 text-[#FFC107]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4h</p>
                  <p className="text-sm text-gray-400">Total Time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="musaix-card-border bg-black/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3F51B5]/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-[#3F51B5]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">12K</p>
                  <p className="text-sm text-gray-400">Plays</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Playlists Section */}
        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="featured" className="text-white data-[state=active]:bg-[#FF4081]">
              Featured Playlists
            </TabsTrigger>
            <TabsTrigger value="trending" className="text-white data-[state=active]:bg-[#FF4081]">
              Trending
            </TabsTrigger>
            <TabsTrigger value="genres" className="text-white data-[state=active]:bg-[#FF4081]">
              By Genre
            </TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {filteredPlaylists.map((playlist, index) => (
                <Card key={index} className="musaix-card-border bg-black/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-white">{playlist.title}</CardTitle>
                          {playlist.isOfficial && (
                            <Badge className="bg-[#FF4081] text-white">Official</Badge>
                          )}
                        </div>
                        <p className="text-gray-400">by {playlist.artist}</p>
                        <p className="text-sm text-gray-500">{playlist.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {playlist.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="border-gray-600 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSharePlaylist(playlist.title, playlist.soundcloudUrl)}
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <a href={playlist.soundcloudUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* SoundCloud Embed */}
                    <div className="w-full space-y-4">
                      <iframe 
                        ref={index === 0 ? iframeRef : null}
                        width="100%" 
                        height="300" 
                        scrolling="no" 
                        frameBorder="no" 
                        allow="autoplay" 
                        src={playlist.embedUrl}
                        className="rounded-lg"
                        id={`soundcloud-player-${index}`}
                      />
                      
                      {/* Enhanced Controls for Main Player */}
                      {index === 0 && (
                        <Card className="bg-gray-900/50 border-gray-700">
                          <CardContent className="p-4">
                            <div className="space-y-4">
                              {/* Progress Bar */}
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs text-gray-400">
                                  <span>{formatTime(position)}</span>
                                  <span>{formatTime(duration)}</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-1 cursor-pointer"
                                     onClick={(e) => {
                                       const rect = e.currentTarget.getBoundingClientRect();
                                       const percentage = ((e.clientX - rect.left) / rect.width) * 100;
                                       seekTo(percentage);
                                     }}
                                >
                                  <div 
                                    className="bg-[#FF4081] h-1 rounded-full transition-all"
                                    style={{ width: duration > 0 ? `${(position / duration) * 100}%` : '0%' }}
                                  />
                                </div>
                              </div>

                              {/* Main Controls */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={skipPrev}
                                    className="text-gray-400 hover:text-white"
                                    disabled={isLoading}
                                  >
                                    <SkipBack className="h-4 w-4" />
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="lg"
                                    onClick={togglePlayPause}
                                    className="text-white hover:text-[#FF4081] w-12 h-12 rounded-full bg-[#FF4081]/20 hover:bg-[#FF4081]/30"
                                    disabled={isLoading}
                                  >
                                    {isLoading ? (
                                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : isPlaying ? (
                                      <Pause className="h-6 w-6" />
                                    ) : (
                                      <Play className="h-6 w-6" />
                                    )}
                                  </Button>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={skipNext}
                                    className="text-gray-400 hover:text-white"
                                    disabled={isLoading}
                                  >
                                    <SkipForward className="h-4 w-4" />
                                  </Button>
                                </div>

                                {/* Volume Control */}
                                <div className="flex items-center gap-2 w-32">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleVolumeChange(volume[0] > 0 ? [0] : [75])}
                                    className="text-gray-400 hover:text-white"
                                  >
                                    {volume[0] === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                  </Button>
                                  <Slider
                                    value={volume}
                                    onValueChange={handleVolumeChange}
                                    max={100}
                                    step={1}
                                    className="flex-1"
                                  />
                                  <span className="text-xs text-gray-400 w-8">{volume[0]}</span>
                                </div>
                              </div>

                              {/* Additional Info */}
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Music className="h-3 w-3" />
                                  <span>External controls via SoundCloud Widget API</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : isPlaying ? 'bg-green-500' : 'bg-gray-500'}`} />
                                  <span>{isLoading ? 'Loading...' : isPlaying ? 'Playing' : 'Paused'}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                      
                      <div className="text-xs text-gray-500 text-center">
                        <a 
                          href="https://soundcloud.com/s73rl" 
                          title="S73RL" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-[#FF4081] no-underline"
                        >
                          S73RL
                        </a>
                        {' · '}
                        <a 
                          href="https://soundcloud.com/s73rl/sets/musaix-pro" 
                          title="Musaix Pro" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-[#FF4081] no-underline"
                        >
                          Musaix Pro
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-6">
            <Card className="musaix-card-border bg-black/50">
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-400">Trending playlists coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="genres" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Hip Hop', 'Trap', 'Lo-Fi', 'R&B', 'Pop', 'Electronic', 'Jazz', 'Rock'].map((genre) => (
                <Card key={genre} className="musaix-card-border bg-black/50 cursor-pointer hover:bg-gray-800/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Music className="h-8 w-8 mx-auto mb-2 text-[#FF4081]" />
                    <h3 className="text-white font-medium">{genre}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Sound Wave Visualizer */}
        <SoundWaveVisualizer 
          isPlaying={isPlaying}
          audioElement={null}
          className="mb-6"
        />

        {/* Quick Actions */}
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Headphones className="h-5 w-5 text-[#FF4081]" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="musaix-gradient-button h-12">
                <Play className="h-4 w-4 mr-2" />
                Play Random
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 h-12">
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800 h-12">
                <Download className="h-4 w-4 mr-2" />
                Offline Mode
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedPageLayout>
  );
}