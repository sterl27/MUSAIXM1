import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedPageLayout from "@/components/layout/UnifiedPageLayout";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Save, Upload, Music, Image, User, Plus, X, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ArtistProfile {
  id: string;
  artistName: string;
  bio: string;
  genre: string;
  location: string;
  influences: string[];
  socialLinks: {
    instagram?: string;
    twitter?: string;
    spotify?: string;
    soundcloud?: string;
  };
  photos: string[];
  songs: {
    id: string;
    title: string;
    fileUrl: string;
    uploadDate: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function ArtistProfile() {
  const [profile, setProfile] = useState<ArtistProfile>({
    id: '',
    artistName: '',
    bio: '',
    genre: '',
    location: '',
    influences: [],
    socialLinks: {},
    photos: [],
    songs: [],
    createdAt: '',
    updatedAt: ''
  });
  
  const [newInfluence, setNewInfluence] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Fetch existing profile
  const { data: existingProfile, isLoading } = useQuery({
    queryKey: ["/api/artist-profile"],
    retry: false,
  });

  useEffect(() => {
    if (existingProfile) {
      setProfile(existingProfile as ArtistProfile);
    }
  }, [existingProfile]);

  // Save profile mutation
  const { mutate: saveProfile, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/artist-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error("Failed to save profile");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artist-profile"] });
      setIsEditing(false);
      toast({
        title: "Profile saved successfully!",
        description: "Your artist profile has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Upload photo mutation
  const { mutate: uploadPhoto, isPending: isUploadingPhoto } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await fetch("/api/upload/photo", {
        method: "POST",
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload photo");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setProfile(prev => ({
        ...prev,
        photos: [...prev.photos, data.photoUrl]
      }));
      toast({
        title: "Photo uploaded successfully!",
        description: "Your photo has been added to your profile.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Upload song mutation
  const { mutate: uploadSong, isPending: isUploadingSong } = useMutation({
    mutationFn: async ({ file, title }: { file: File; title: string }) => {
      const formData = new FormData();
      formData.append('song', file);
      formData.append('title', title);
      
      const response = await fetch("/api/upload/song", {
        method: "POST",
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error("Failed to upload song");
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      setProfile(prev => ({
        ...prev,
        songs: [...prev.songs, {
          id: data.songId,
          title: data.title,
          fileUrl: data.songUrl,
          uploadDate: new Date().toISOString()
        }]
      }));
      toast({
        title: "Song uploaded successfully!",
        description: "Your song has been added to your profile.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select a photo under 5MB.",
          variant: "destructive",
        });
        return;
      }
      uploadPhoto(file);
    }
  };

  const handleSongUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: "File too large",
          description: "Please select a song under 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      const title = prompt("Enter song title:");
      if (title) {
        uploadSong({ file, title });
      }
    }
  };

  const addInfluence = () => {
    if (newInfluence.trim() && !profile.influences.includes(newInfluence.trim())) {
      setProfile(prev => ({
        ...prev,
        influences: [...prev.influences, newInfluence.trim()]
      }));
      setNewInfluence('');
    }
  };

  const removeInfluence = (influence: string) => {
    setProfile(prev => ({
      ...prev,
      influences: prev.influences.filter(inf => inf !== influence)
    }));
  };

  const removePhoto = (photoUrl: string) => {
    setProfile(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo !== photoUrl)
    }));
  };

  const removeSong = (songId: string) => {
    setProfile(prev => ({
      ...prev,
      songs: prev.songs.filter(song => song.id !== songId)
    }));
  };

  if (isLoading) {
    return (
      <UnifiedPageLayout title="Artist Profile" description="Build your artist identity">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading profile...</div>
        </div>
      </UnifiedPageLayout>
    );
  }

  return (
    <UnifiedPageLayout 
      title="Artist Profile"
      description="Build your complete artist identity with bio, photos, and music"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#FF4081]" />
            <span className="text-lg font-semibold text-white">
              {profile.artistName || "Your Artist Profile"}
            </span>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Profile
              </Button>
            ) : (
              <>
                <Button onClick={() => setIsEditing(false)} variant="ghost">
                  Cancel
                </Button>
                <Button 
                  onClick={() => saveProfile()}
                  disabled={isSaving}
                  className="musaix-gradient-button"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Profile"}
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="bio">Bio & Style</TabsTrigger>
            <TabsTrigger value="media">Photos</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic" className="space-y-4">
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
                <CardDescription>Essential details about your artist identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Artist Name</Label>
                    <Input
                      value={profile.artistName}
                      onChange={(e) => setProfile(prev => ({ ...prev, artistName: e.target.value }))}
                      placeholder="Your stage name"
                      className="bg-gray-800 border-gray-600 text-white"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Genre</Label>
                    <Input
                      value={profile.genre}
                      onChange={(e) => setProfile(prev => ({ ...prev, genre: e.target.value }))}
                      placeholder="Hip Hop, R&B, Pop, etc."
                      className="bg-gray-800 border-gray-600 text-white"
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label className="text-white">Location</Label>
                    <Input
                      value={profile.location}
                      onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, State/Country"
                      className="bg-gray-800 border-gray-600 text-white"
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-2">
                  <Label className="text-white">Social Links</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={profile.socialLinks.instagram || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                      }))}
                      placeholder="Instagram URL"
                      className="bg-gray-800 border-gray-600 text-white"
                      disabled={!isEditing}
                    />
                    <Input
                      value={profile.socialLinks.twitter || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, twitter: e.target.value }
                      }))}
                      placeholder="Twitter URL"
                      className="bg-gray-800 border-gray-600 text-white"
                      disabled={!isEditing}
                    />
                    <Input
                      value={profile.socialLinks.spotify || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, spotify: e.target.value }
                      }))}
                      placeholder="Spotify URL"
                      className="bg-gray-800 border-gray-600 text-white"
                      disabled={!isEditing}
                    />
                    <Input
                      value={profile.socialLinks.soundcloud || ''}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        socialLinks: { ...prev.socialLinks, soundcloud: e.target.value }
                      }))}
                      placeholder="SoundCloud URL"
                      className="bg-gray-800 border-gray-600 text-white"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bio & Style */}
          <TabsContent value="bio" className="space-y-4">
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white">Artist Bio & Style</CardTitle>
                <CardDescription>Tell your story and define your artistic identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Artist Bio</Label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell your story... Where did you start? What drives your music? What makes you unique?"
                    className="h-32 bg-gray-800 border-gray-600 text-white"
                    disabled={!isEditing}
                  />
                </div>

                {/* Influences */}
                <div>
                  <Label className="text-white">Musical Influences</Label>
                  {isEditing && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newInfluence}
                        onChange={(e) => setNewInfluence(e.target.value)}
                        placeholder="Add an influence..."
                        className="bg-gray-800 border-gray-600 text-white"
                        onKeyPress={(e) => e.key === 'Enter' && addInfluence()}
                      />
                      <Button onClick={addInfluence} size="sm" className="musaix-gradient-button">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {profile.influences.map((influence, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-800 text-white">
                        {influence}
                        {isEditing && (
                          <X 
                            className="h-3 w-3 ml-1 cursor-pointer" 
                            onClick={() => removeInfluence(influence)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photos */}
          <TabsContent value="media" className="space-y-4">
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white">Photos</CardTitle>
                <CardDescription>Upload photos to showcase your visual identity</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing && (
                  <div className="mb-4">
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#FF4081] transition-colors">
                        <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <div className="text-white">Click to upload photos</div>
                        <div className="text-sm text-gray-400">PNG, JPG up to 5MB</div>
                      </div>
                    </Label>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photo} 
                        alt={`Artist photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {isEditing && (
                        <Button
                          onClick={() => removePhoto(photo)}
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Music */}
          <TabsContent value="music" className="space-y-4">
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white">Music Collection</CardTitle>
                <CardDescription>Upload your tracks to showcase your sound</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing && (
                  <div className="mb-4">
                    <Label htmlFor="song-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-[#FF4081] transition-colors">
                        <Music className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <div className="text-white">Click to upload songs</div>
                        <div className="text-sm text-gray-400">MP3, WAV up to 10MB</div>
                      </div>
                    </Label>
                    <Input
                      id="song-upload"
                      type="file"
                      accept="audio/*"
                      onChange={handleSongUpload}
                      className="hidden"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  {profile.songs.map((song) => (
                    <div key={song.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="ghost" className="text-[#FF4081]">
                          <Play className="h-4 w-4" />
                        </Button>
                        <div>
                          <div className="text-white font-medium">{song.title}</div>
                          <div className="text-sm text-gray-400">
                            Uploaded {new Date(song.uploadDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {isEditing && (
                        <Button
                          onClick={() => removeSong(song.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedPageLayout>
  );
}