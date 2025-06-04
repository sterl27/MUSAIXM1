import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import UnifiedPageLayout from "@/components/layout/UnifiedPageLayout";
import SoundSignature from "@/components/SoundSignature";
import { Waves, User, Music2, Sparkles } from "lucide-react";

interface DemoProfile {
  artistName: string;
  genre: string;
  influences: string;
  style: string;
}

export default function SoundSignaturePage() {
  const [demoMode, setDemoMode] = useState(true);
  const [demoProfile, setDemoProfile] = useState<DemoProfile>({
    artistName: "Demo Artist",
    genre: "Hip-Hop",
    influences: "Kendrick Lamar, J. Cole, Drake",
    style: "Melodic rap with introspective lyrics and smooth delivery"
  });

  // Fetch user's artist profile
  const { data: userProfile, isLoading } = useQuery<any>({
    queryKey: ["/api/artist-profile"],
    retry: false,
  });

  const handleDemoChange = (field: keyof DemoProfile, value: string) => {
    setDemoProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const presetProfiles = [
    {
      name: "Melodic Rapper",
      profile: {
        artistName: "Melodic MC",
        genre: "Hip-Hop",
        influences: "Drake, The Weeknd, Travis Scott",
        style: "Melodic flow with emotional depth and atmospheric production"
      }
    },
    {
      name: "Lyrical Artist",
      profile: {
        artistName: "Wordsmith",
        genre: "Conscious Rap",
        influences: "Kendrick Lamar, J. Cole, Nas",
        style: "Complex wordplay with intricate rhyme schemes and social commentary"
      }
    },
    {
      name: "Trap Artist",
      profile: {
        artistName: "Trap King",
        genre: "Trap",
        influences: "Future, Young Thug, Playboi Carti",
        style: "High-energy delivery with catchy hooks and modern production"
      }
    },
    {
      name: "R&B Soul",
      profile: {
        artistName: "Soul Voice",
        genre: "R&B",
        influences: "Frank Ocean, The Weeknd, Bryson Tiller",
        style: "Smooth vocals with emotional vulnerability and rich harmonies"
      }
    }
  ];

  return (
    <UnifiedPageLayout 
      title="Sound Signature Analyzer"
      description="Visualize vocal characteristics and discover your unique sound profile"
    >
      <div className="space-y-6">
        {/* Mode Toggle */}
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FF4081]" />
              Analysis Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={demoMode ? "default" : "outline"}
                onClick={() => setDemoMode(true)}
                className={demoMode ? "musaix-gradient-button" : ""}
              >
                Demo Mode
              </Button>
              <Button
                variant={!demoMode ? "default" : "outline"}
                onClick={() => setDemoMode(false)}
                className={!demoMode ? "musaix-gradient-button" : ""}
                disabled={!userProfile && !isLoading}
              >
                <User className="h-4 w-4 mr-2" />
                My Profile
              </Button>
            </div>
            {!demoMode && !userProfile && !isLoading && (
              <p className="text-yellow-400 text-sm mt-2">
                Create an artist profile to use your personal data
              </p>
            )}
          </CardContent>
        </Card>

        {demoMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Demo Controls */}
            <div className="space-y-4">
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Music2 className="h-5 w-5 text-[#AB47BC]" />
                    Customize Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Artist Name</Label>
                    <Input
                      value={demoProfile.artistName}
                      onChange={(e) => handleDemoChange('artistName', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Genre</Label>
                    <Input
                      value={demoProfile.genre}
                      onChange={(e) => handleDemoChange('genre', e.target.value)}
                      placeholder="e.g. Hip-Hop, R&B, Pop"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Musical Influences</Label>
                    <Input
                      value={demoProfile.influences}
                      onChange={(e) => handleDemoChange('influences', e.target.value)}
                      placeholder="e.g. Kendrick Lamar, Drake, J. Cole"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-white">Style Description</Label>
                    <Textarea
                      value={demoProfile.style}
                      onChange={(e) => handleDemoChange('style', e.target.value)}
                      placeholder="Describe your vocal style and approach"
                      className="bg-gray-800 border-gray-600 text-white"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Preset Profiles */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="text-white">Quick Presets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {presetProfiles.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setDemoProfile(preset.profile)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sound Signature Visualization */}
            <div>
              <SoundSignature 
                artistProfile={demoProfile}
                showViewToggle={true}
                compact={false}
              />
            </div>
          </div>
        ) : (
          /* User Profile Mode */
          <div>
            {userProfile ? (
              <SoundSignature 
                artistProfile={{
                  artistName: userProfile.artistName,
                  genre: userProfile.genre,
                  influences: userProfile.influences?.join(', '),
                  style: userProfile.bio
                }}
                showViewToggle={true}
                compact={false}
              />
            ) : isLoading ? (
              <Card className="musaix-card-border bg-black/50">
                <CardContent className="p-8 text-center">
                  <div className="text-white">Loading your profile...</div>
                </CardContent>
              </Card>
            ) : (
              <Card className="musaix-card-border bg-black/50">
                <CardContent className="p-8 text-center">
                  <Waves className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-white mb-2">No Artist Profile Found</div>
                  <div className="text-gray-400 mb-4">
                    Create an artist profile to analyze your unique sound signature
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/artist-profile'}
                    className="musaix-gradient-button"
                  >
                    Create Profile
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Information Section */}
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Waves className="h-5 w-5 text-[#FF4081]" />
              About Sound Signatures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h4 className="text-white font-medium mb-2">What is a Sound Signature?</h4>
                <p className="text-sm">
                  Your Sound Signature is a visual representation of your vocal characteristics, 
                  analyzing five key dimensions of your artistic voice based on your genre, 
                  influences, and style.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">How it Works</h4>
                <p className="text-sm">
                  Our algorithm analyzes your artist profile data to generate personalized 
                  vocal characteristics, helping you understand and refine your unique sound 
                  identity.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Characteristics Analyzed</h4>
                <ul className="text-sm space-y-1">
                  <li>• Pitch Range: Vocal register and tonal placement</li>
                  <li>• Vocal Richness: Tonal warmth and fullness</li>
                  <li>• Vocal Power: Dynamic intensity and strength</li>
                  <li>• Voice Clarity: Articulation and crispness</li>
                  <li>• Delivery Speed: Pace and rhythm patterns</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Use Cases</h4>
                <ul className="text-sm space-y-1">
                  <li>• Understand your vocal strengths</li>
                  <li>• Compare with different artist styles</li>
                  <li>• Guide vocal training and development</li>
                  <li>• Inform production and mixing decisions</li>
                  <li>• Develop your artistic identity</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedPageLayout>
  );
}