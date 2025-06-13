import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { genreRecommendationRequestSchema } from "@shared/schema";
import type { GenreRecommendationRequest, GenreRecommendationResponse, GenreRecommendation } from "@shared/schema";
import UnifiedPageLayout from "@/components/layout/UnifiedPageLayout";
import { Music, Sparkles, TrendingUp, Users, Clock, Lightbulb, Star, History } from "lucide-react";
import { z } from "zod";

export default function GenreRecommendation() {
  const [activeTab, setActiveTab] = useState("analyze");
  const [recommendation, setRecommendation] = useState<GenreRecommendationResponse | null>(null);
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<GenreRecommendationRequest>({
    resolver: zodResolver(genreRecommendationRequestSchema),
    defaultValues: {
      lyrics: "",
      musicDescription: "",
      currentGenre: "",
      mood: "",
      influences: [],
      targetAudience: "",
    },
  });

  // Available options
  const moodOptions = [
    "energetic", "melancholy", "aggressive", "romantic", "dark", 
    "happy", "calm", "epic", "mysterious", "nostalgic"
  ];

  const audienceOptions = [
    "teenagers", "young adults", "adults", "mainstream", "underground",
    "niche", "club-goers", "radio-friendly", "streaming-focused"
  ];

  const popularInfluences = [
    "Drake", "Kendrick Lamar", "Taylor Swift", "The Weeknd", "Travis Scott",
    "Billie Eilish", "Post Malone", "Ariana Grande", "Ed Sheeran", "Dua Lipa",
    "Bad Bunny", "Olivia Rodrigo", "Harry Styles", "Lil Nas X", "SZA"
  ];

  // Generate recommendation mutation
  const generateRecommendation = useMutation({
    mutationFn: async (data: GenreRecommendationRequest) => {
      const response = await apiRequest("POST", "/api/genre/recommend", data);
      return response.json() as Promise<GenreRecommendationResponse>;
    },
    onSuccess: (data) => {
      setRecommendation(data);
      toast({
        title: "Genre Analysis Complete",
        description: `Primary genre identified: ${data.primaryGenre} (${data.confidence}% confidence)`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get recommendation history
  const { data: history, refetch: refetchHistory } = useQuery<GenreRecommendation[]>({
    queryKey: ["/api/genre/history"],
    enabled: false,
  });

  const onSubmit = (data: GenreRecommendationRequest) => {
    const requestData = { ...data, influences: selectedInfluences };
    generateRecommendation.mutate(requestData);
  };

  const addInfluence = (influence: string) => {
    if (!selectedInfluences.includes(influence)) {
      setSelectedInfluences([...selectedInfluences, influence]);
    }
  };

  const removeInfluence = (influence: string) => {
    setSelectedInfluences(selectedInfluences.filter(i => i !== influence));
  };

  const loadHistory = () => {
    setActiveTab("history");
    refetchHistory();
  };

  return (
    <UnifiedPageLayout 
      title="Genre Recommendation Engine" 
      description="AI-powered music genre analysis and recommendations"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyze" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Analyze
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2" onClick={loadHistory}>
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Music className="h-5 w-5 text-[#FF4081]" />
                  Music Analysis
                </CardTitle>
                <CardDescription>
                  Provide information about your music for AI-powered genre recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="lyrics"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Lyrics (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Paste your lyrics here to analyze themes and style..."
                              className="min-h-[100px] bg-gray-900 border-gray-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="musicDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Music Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your music style, instruments, tempo, etc..."
                              className="min-h-[80px] bg-gray-900 border-gray-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="currentGenre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Current Genre (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Hip-Hop, Pop, Rock..."
                                className="bg-gray-900 border-gray-700 text-white"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="mood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Mood</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                  <SelectValue placeholder="Select mood" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-gray-900 border-gray-700">
                                {moodOptions.map((mood) => (
                                  <SelectItem key={mood} value={mood} className="text-white">
                                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Target Audience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                                <SelectValue placeholder="Select target audience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-900 border-gray-700">
                              {audienceOptions.map((audience) => (
                                <SelectItem key={audience} value={audience} className="text-white">
                                  {audience.charAt(0).toUpperCase() + audience.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Musical Influences */}
                    <div className="space-y-3">
                      <FormLabel className="text-white">Musical Influences</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedInfluences.map((influence) => (
                          <Badge
                            key={influence}
                            variant="secondary"
                            className="bg-[#FF4081] text-white cursor-pointer"
                            onClick={() => removeInfluence(influence)}
                          >
                            {influence} ×
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {popularInfluences.slice(0, 9).map((influence) => (
                          <Button
                            key={influence}
                            type="button"
                            variant="outline"
                            size="sm"
                            className="text-xs border-gray-600 text-gray-300 hover:bg-[#FF4081]/20"
                            onClick={() => addInfluence(influence)}
                            disabled={selectedInfluences.includes(influence)}
                          >
                            {influence}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={generateRecommendation.isPending}
                      className="w-full musaix-gradient-button"
                    >
                      {generateRecommendation.isPending ? (
                        <>
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze Genre
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-5 w-5 text-[#FF4081]" />
                  AI Analysis Results
                </CardTitle>
                <CardDescription>
                  Comprehensive genre recommendations based on your music
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendation ? (
                  <div className="space-y-6">
                    {/* Primary Genre */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-white mb-2">{recommendation.primaryGenre}</h3>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Progress value={recommendation.confidence} className="w-32" />
                        <span className="text-[#FFC107] font-semibold">{recommendation.confidence}%</span>
                      </div>
                    </div>

                    <Separator className="bg-gray-700" />

                    {/* Secondary Genres */}
                    {recommendation.secondaryGenres.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4 text-[#FFC107]" />
                          Secondary Genres
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {recommendation.secondaryGenres.map((genre, index) => (
                            <Badge key={index} variant="outline" className="border-[#AB47BC] text-[#AB47BC]">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Analysis Reasoning */}
                    <div>
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-[#FFC107]" />
                        Analysis Reasoning
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{recommendation.reasoning}</p>
                    </div>

                    {/* Suggestions */}
                    {recommendation.suggestions.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-3">Recommendations</h4>
                        <ul className="space-y-2">
                          {recommendation.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
                              <span className="text-[#FF4081] mt-1">•</span>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Related Artists */}
                    {recommendation.relatedArtists.length > 0 && (
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#FF4081]" />
                          Related Artists
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {recommendation.relatedArtists.map((artist, index) => (
                            <Badge key={index} className="bg-gradient-to-r from-[#FF4081] to-[#AB47BC] text-white">
                              {artist}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Fill out the form and click "Analyze Genre" to get AI-powered recommendations</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <History className="h-5 w-5 text-[#FF4081]" />
                Recommendation History
              </CardTitle>
              <CardDescription>
                Your previous genre analysis sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history && Array.isArray(history) && history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((item: GenreRecommendation) => (
                    <div key={item.id} className="border border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-white font-semibold">
                          {(item.recommendedGenres as GenreRecommendationResponse).primaryGenre}
                        </h4>
                        <span className="text-gray-400 text-sm">
                          {new Date(item.createdAt!).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Progress value={(item.recommendedGenres as GenreRecommendationResponse).confidence} className="w-24" />
                        <span className="text-[#FFC107] text-sm">{(item.recommendedGenres as GenreRecommendationResponse).confidence}%</span>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">{item.aiAnalysis}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No recommendation history yet. Analyze some music to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </UnifiedPageLayout>
  );
}