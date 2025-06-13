import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import UnifiedPageLayout from '@/components/layout/UnifiedPageLayout';
import { 
  TrendingUp, Search, Loader2, Music, Users, 
  Headphones, Clock, Target, Zap, BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TrendData {
  currentGenres: string[];
  trendingArtists: string[];
  popularSounds: string[];
  productionTechniques: string[];
  insights: string[];
}

interface SampleTrends {
  trending: string[];
  classic: string[];
  techniques: string[];
}

interface TutorialData {
  tutorials: Array<{
    title: string;
    description: string;
    difficulty: string;
    techniques: string[];
  }>;
  tips: string[];
}

export default function TrendsDashboard() {
  const [activeTab, setActiveTab] = useState('trends');
  const [searchQuery, setSearchQuery] = useState('');
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [sampleTrends, setSampleTrends] = useState<SampleTrends | null>(null);
  const [tutorials, setTutorials] = useState<TutorialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tutorialLoading, setTutorialLoading] = useState(false);

  const { toast } = useToast();

  // Load sample trends on component mount
  useEffect(() => {
    loadSampleTrends();
  }, []);

  const loadSampleTrends = async () => {
    try {
      const res = await fetch('/api/beats/sample-trends', {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setSampleTrends(data);
      }
    } catch (error) {
      console.error('Error loading sample trends:', error);
    }
  };

  const searchTrends = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a search query for beat trends",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/beats/search-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ query: searchQuery })
      });

      if (res.ok) {
        const data = await res.json();
        setTrendData(data);
        toast({
          title: "Trends Updated",
          description: `Found trends for "${searchQuery}"`,
        });
      } else {
        throw new Error('Failed to fetch trends');
      }
    } catch (error) {
      console.error('Error searching trends:', error);
      toast({
        title: "Search Failed",
        description: "Failed to fetch trend data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchTutorials = async (genre: string) => {
    setTutorialLoading(true);
    try {
      const res = await fetch('/api/beats/search-tutorials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ genre, technique: 'production' })
      });

      if (res.ok) {
        const data = await res.json();
        setTutorials(data);
        toast({
          title: "Tutorials Loaded",
          description: `Found ${genre} production tutorials`,
        });
      }
    } catch (error) {
      console.error('Error searching tutorials:', error);
    } finally {
      setTutorialLoading(false);
    }
  };

  const quickSearches = [
    'trap beats 2024',
    'drill production',
    'lo-fi hip hop',
    'phonk Memphis',
    'UK drill sounds',
    'boom bap classic'
  ];

  return (
    <UnifiedPageLayout 
      title="Music Trends Dashboard" 
      description="Real-time music industry trends and production insights"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Industry Trends
          </TabsTrigger>
          <TabsTrigger value="samples" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            Sample Trends
          </TabsTrigger>
          <TabsTrigger value="tutorials" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Tutorials & Tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          {/* Search Section */}
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Search className="h-5 w-5 text-[#FF4081]" />
                Trend Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Input
                  placeholder="Search for beat trends (e.g., 'trap dark 2024', 'drill UK style')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchTrends()}
                  className="bg-gray-900 border-gray-700 text-white flex-1"
                />
                <Button
                  onClick={searchTrends}
                  disabled={loading}
                  className="musaix-gradient-button"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <span className="text-gray-400 text-sm">Quick searches:</span>
                <div className="flex flex-wrap gap-2">
                  {quickSearches.map((query, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(query);
                        setTimeout(() => searchTrends(), 100);
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs"
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trend Results */}
          {trendData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trending Genres */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <BarChart3 className="h-5 w-5 text-[#FF4081]" />
                    Trending Genres
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {trendData.currentGenres.map((genre, index) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-pointer"
                        onClick={() => searchTutorials(genre.toLowerCase())}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Producers */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5 text-[#FF4081]" />
                    Popular Producers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {trendData.trendingArtists.map((artist, index) => (
                      <Badge key={index} variant="outline" className="border-purple-500 text-purple-400">
                        {artist}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Production Techniques */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="h-5 w-5 text-[#FF4081]" />
                    Hot Techniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {trendData.productionTechniques.map((technique, index) => (
                      <Badge key={index} variant="outline" className="border-orange-500 text-orange-400">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Popular Sounds */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Headphones className="h-5 w-5 text-[#FF4081]" />
                    Popular Sounds
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {trendData.popularSounds.map((sound, index) => (
                      <Badge key={index} variant="outline" className="border-green-500 text-green-400">
                        {sound}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Industry Insights */}
              <Card className="musaix-card-border bg-black/50 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <TrendingUp className="h-5 w-5 text-[#FF4081]" />
                    Industry Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendData.insights.map((insight, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg">
                        <div className="w-2 h-2 bg-[#FF4081] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-200 text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!trendData && !loading && (
            <Card className="musaix-card-border bg-black/50">
              <CardContent className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-400">Search for beat trends to see real-time industry data</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="samples" className="space-y-6">
          {sampleTrends && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Trending Samples */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="text-white">Trending Samples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sampleTrends.trending.map((sample, index) => (
                      <div key={index} className="p-2 bg-gray-900 rounded text-gray-300 text-sm">
                        {sample}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Classic Samples */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="text-white">Classic Samples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sampleTrends.classic.map((sample, index) => (
                      <div key={index} className="p-2 bg-gray-900 rounded text-gray-300 text-sm">
                        {sample}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sampling Techniques */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="text-white">Sampling Techniques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sampleTrends.techniques.map((technique, index) => (
                      <div key={index} className="p-2 bg-gray-900 rounded text-gray-300 text-sm">
                        {technique}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-6">
          {tutorials ? (
            <div className="space-y-6">
              {/* Tutorials */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Target className="h-5 w-5 text-[#FF4081]" />
                    Production Tutorials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tutorials.tutorials.map((tutorial, index) => (
                      <div key={index} className="p-4 bg-gray-900 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{tutorial.title}</h4>
                          <Badge variant={tutorial.difficulty === 'Beginner' ? 'default' : tutorial.difficulty === 'Intermediate' ? 'secondary' : 'destructive'}>
                            {tutorial.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{tutorial.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {tutorial.techniques.map((technique, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                              {technique}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="musaix-card-border bg-black/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="h-5 w-5 text-[#FF4081]" />
                    Production Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tutorials.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg">
                        <div className="w-2 h-2 bg-[#FF4081] rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-200 text-sm">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="musaix-card-border bg-black/50">
              <CardContent className="text-center py-12">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-400 mb-4">
                  {tutorialLoading ? 'Loading tutorials...' : 'Click on a genre from the trends tab to load tutorials'}
                </p>
                {tutorialLoading && <Loader2 className="h-6 w-6 mx-auto animate-spin text-[#FF4081]" />}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </UnifiedPageLayout>
  );
}