import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnifiedPageLayout from '@/components/layout/UnifiedPageLayout';
import { 
  Music,
  ExternalLink,
  Play,
  Heart,
  Search,
  Headphones,
  Volume2,
  Share2,
  Download,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MusicPlayerPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const featuredPlaylists = [
    {
      title: "Musaix Pro",
      artist: "S73RL",
      description: "Official Musaix Pro curated tracks and beats",
      embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2036321085&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
      soundcloudUrl: "https://soundcloud.com/s73rl/sets/musaix-pro",
      tags: ["Hip Hop", "Rap", "Beats", "Official"],
      isOfficial: true
    },
    {
      title: "Trap Essentials",
      artist: "Various Artists",
      description: "Essential trap beats and instrumentals for your next project",
      embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/example1&color=%23ff4081&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
      soundcloudUrl: "#",
      tags: ["Trap", "Beats", "Instrumentals"],
      isOfficial: false
    },
    {
      title: "Lo-Fi Hip Hop Vibes",
      artist: "Chill Collective",
      description: "Smooth lo-fi beats perfect for studying and relaxation",
      embedUrl: "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/example2&color=%23ab47bc&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
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
                    <div className="w-full">
                      <iframe 
                        width="100%" 
                        height="300" 
                        scrolling="no" 
                        frameBorder="no" 
                        allow="autoplay" 
                        src={playlist.embedUrl}
                        className="rounded-lg"
                      />
                      <div className="mt-2 text-xs text-gray-500 text-center">
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