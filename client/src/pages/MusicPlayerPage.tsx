import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import UnifiedPageLayout from "@/components/layout/UnifiedPageLayout";
import MusicPlayer from "@/components/MusicPlayer";
import { queryClient } from "@/lib/queryClient";
import { 
  Music, 
  Plus, 
  Upload, 
  Search, 
  Filter,
  Trash2,
  Edit,
  PlayCircle,
  List,
  Grid
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Song {
  id: string;
  title: string;
  fileUrl: string;
  uploadDate: string;
  duration?: number;
  artist?: string;
  genre?: string;
  album?: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  createdAt: string;
  isDefault?: boolean;
}

export default function MusicPlayerPage() {
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");

  const { toast } = useToast();

  // Fetch user's songs from Artist Profile
  const { data: userSongs = [], isLoading: songsLoading } = useQuery<Song[]>({
    queryKey: ["/api/artist-profile/songs"],
    retry: false,
  });

  // Fetch user's playlists
  const { data: playlists = [], isLoading: playlistsLoading } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists"],
    retry: false,
  });

  // Create playlist mutation
  const { mutate: createPlaylist, isPending: isCreatingPlaylistMutation } = useMutation({
    mutationFn: async (playlistData: { name: string; description: string; songs: string[] }) => {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playlistData),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error("Failed to create playlist");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      setIsCreatingPlaylist(false);
      setNewPlaylistName("");
      setNewPlaylistDescription("");
      toast({
        title: "Playlist created successfully!",
        description: "Your new playlist is ready to use.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create playlist",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Initialize with default playlist
  useEffect(() => {
    if (!currentPlaylist && userSongs.length > 0) {
      const defaultPlaylist: Playlist = {
        id: 'default',
        name: 'All Songs',
        description: 'All your uploaded songs',
        songs: userSongs,
        createdAt: new Date().toISOString(),
        isDefault: true
      };
      setCurrentPlaylist(defaultPlaylist);
    }
  }, [userSongs, currentPlaylist]);

  // Filter songs based on search and genre
  const filteredSongs = currentPlaylist?.songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (song.artist || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || song.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  }) || [];

  // Get unique genres
  const genres = Array.from(new Set(userSongs.map(song => song.genre).filter(Boolean)));

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast({
        title: "Playlist name required",
        description: "Please enter a name for your playlist.",
        variant: "destructive",
      });
      return;
    }

    createPlaylist({
      name: newPlaylistName,
      description: newPlaylistDescription,
      songs: []
    });
  };

  const handleSongChange = (index: number) => {
    setCurrentSongIndex(index);
  };

  const playPlaylist = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setCurrentSongIndex(0);
  };

  if (songsLoading || playlistsLoading) {
    return (
      <UnifiedPageLayout title="Music Player" description="Play and manage your music collection">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading your music...</div>
        </div>
      </UnifiedPageLayout>
    );
  }

  return (
    <UnifiedPageLayout 
      title="Music Player"
      description="Play and manage your music collection with custom playlists"
    >
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Music className="h-6 w-6 text-[#FF4081]" />
              <span className="text-lg font-semibold text-white">
                {currentPlaylist?.name || "Music Player"}
              </span>
            </div>
            {currentPlaylist && (
              <Badge variant="secondary" className="bg-gray-800 text-white">
                {filteredSongs.length} songs
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            >
              {viewMode === 'list' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => setIsCreatingPlaylist(true)}
              className="musaix-gradient-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Playlist
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Playlists and Filters */}
          <div className="lg:col-span-1 space-y-4">
            {/* Playlists */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <List className="h-5 w-5" />
                  Playlists
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Default "All Songs" playlist */}
                <div
                  onClick={() => playPlaylist({
                    id: 'default',
                    name: 'All Songs',
                    description: 'All your uploaded songs',
                    songs: userSongs,
                    createdAt: new Date().toISOString(),
                    isDefault: true
                  })}
                  className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                    currentPlaylist?.id === 'default' 
                      ? 'bg-[#FF4081]/20 border border-[#FF4081]/50' 
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <Music className="h-4 w-4 text-[#FF4081]" />
                  <div className="flex-1">
                    <p className="text-white font-medium">All Songs</p>
                    <p className="text-sm text-gray-400">{userSongs.length} songs</p>
                  </div>
                </div>

                {/* User playlists */}
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    onClick={() => playPlaylist(playlist)}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                      currentPlaylist?.id === playlist.id 
                        ? 'bg-[#FF4081]/20 border border-[#FF4081]/50' 
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <PlayCircle className="h-4 w-4 text-[#AB47BC]" />
                    <div className="flex-1">
                      <p className="text-white font-medium">{playlist.name}</p>
                      <p className="text-sm text-gray-400">{playlist.songs.length} songs</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Filters */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <Label className="text-white">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search songs..."
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                {/* Genre Filter */}
                {genres.length > 0 && (
                  <div>
                    <Label className="text-white">Genre</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button
                        variant={selectedGenre === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedGenre(null)}
                        className="text-xs"
                      >
                        All
                      </Button>
                      {genres.map((genre) => (
                        <Button
                          key={genre}
                          variant={selectedGenre === genre ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedGenre(genre)}
                          className="text-xs"
                        >
                          {genre}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Music Player */}
            {currentPlaylist && filteredSongs.length > 0 && (
              <MusicPlayer
                playlist={filteredSongs}
                currentSongIndex={Math.min(currentSongIndex, filteredSongs.length - 1)}
                onSongChange={handleSongChange}
                showPlaylist={false}
              />
            )}

            {/* Song List */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white">
                  {currentPlaylist?.name || "Songs"}
                </CardTitle>
                {currentPlaylist?.description && (
                  <p className="text-gray-400">{currentPlaylist.description}</p>
                )}
              </CardHeader>
              <CardContent>
                {filteredSongs.length === 0 ? (
                  <div className="text-center py-8">
                    <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">
                      {userSongs.length === 0 
                        ? "No songs uploaded yet. Visit your Artist Profile to upload music."
                        : "No songs match your current filters."
                      }
                    </p>
                  </div>
                ) : (
                  <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-2"}>
                    {filteredSongs.map((song, index) => (
                      <div
                        key={song.id}
                        onClick={() => handleSongChange(index)}
                        className={`flex items-center gap-4 p-4 rounded-md cursor-pointer transition-colors ${
                          index === currentSongIndex 
                            ? 'bg-[#FF4081]/20 border border-[#FF4081]/50' 
                            : 'hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gray-700 rounded-md flex items-center justify-center">
                            <Music className="h-6 w-6 text-gray-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${
                            index === currentSongIndex ? 'text-[#FF4081]' : 'text-white'
                          }`}>
                            {song.title}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {song.artist || "Unknown Artist"}
                          </p>
                          {song.genre && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              {song.genre}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(song.uploadDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Playlist Modal */}
        {isCreatingPlaylist && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4 musaix-card-border bg-black">
              <CardHeader>
                <CardTitle className="text-white">Create New Playlist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Playlist Name</Label>
                  <Input
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Enter playlist name..."
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Description (optional)</Label>
                  <Input
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                    placeholder="Enter description..."
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatingPlaylist(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePlaylist}
                    disabled={isCreatingPlaylistMutation}
                    className="musaix-gradient-button"
                  >
                    {isCreatingPlaylistMutation ? "Creating..." : "Create"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </UnifiedPageLayout>
  );
}