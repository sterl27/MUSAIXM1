import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import UnifiedPageLayout from '@/components/layout/UnifiedPageLayout';
import { 
  Loader2, Music, Zap, Copy, RefreshCw, Wand2, Play, Pause, 
  Download, Save, Settings, Shuffle, Target, TrendingUp, 
  Volume2, Headphones, Mic, BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Enhanced beat configuration options
const genres = [
  { id: 'trap', name: 'Trap', description: 'Heavy 808s, hi-hats, snappy snares' },
  { id: 'boom-bap', name: 'Boom Bap', description: 'Classic hip-hop, dusty samples' },
  { id: 'drill', name: 'Drill', description: 'Dark, menacing, sliding 808s' },
  { id: 'dirty-south', name: 'Dirty South', description: 'Bouncy, crunk-influenced' },
  { id: 'lo-fi', name: 'Lo-Fi', description: 'Warm, nostalgic, vinyl texture' },
  { id: 'cloud-rap', name: 'Cloud Rap', description: 'Ethereal, atmospheric, dreamy' },
  { id: 'jazz-rap', name: 'Jazz Rap', description: 'Smooth jazz samples, sophisticated' },
  { id: 'phonk', name: 'Phonk', description: 'Memphis-inspired, dark, distorted' },
  { id: 'experimental', name: 'Experimental', description: 'Unconventional, avant-garde' },
  { id: 'uk-drill', name: 'UK Drill', description: 'Sliding bass, rapid hi-hats' },
  { id: 'afrobeat', name: 'Afrobeat', description: 'African percussion, rhythmic patterns' },
  { id: 'latin-trap', name: 'Latin Trap', description: 'Reggaeton influences, Latin percussion' }
];

const moods = [
  { id: 'aggressive', name: 'Aggressive', emoji: '🔥' },
  { id: 'dark', name: 'Dark', emoji: '🌑' },
  { id: 'epic', name: 'Epic', emoji: '⚡' },
  { id: 'laid-back', name: 'Laid-back', emoji: '😎' },
  { id: 'melancholic', name: 'Melancholic', emoji: '😢' },
  { id: 'triumphant', name: 'Triumphant', emoji: '🏆' },
  { id: 'mysterious', name: 'Mysterious', emoji: '🔮' },
  { id: 'energetic', name: 'Energetic', emoji: '⚡' },
  { id: 'smooth', name: 'Smooth', emoji: '✨' },
  { id: 'gritty', name: 'Gritty', emoji: '💀' },
  { id: 'uplifting', name: 'Uplifting', emoji: '🌟' },
  { id: 'nostalgic', name: 'Nostalgic', emoji: '📼' }
];

const tempos = [
  { id: 'slow', name: 'Slow (60-80 BPM)', range: '60-80 BPM' },
  { id: 'midtempo', name: 'Mid-tempo (80-120 BPM)', range: '80-120 BPM' },
  { id: 'fast', name: 'Fast (120-160 BPM)', range: '120-160 BPM' },
  { id: 'double-time', name: 'Double-time (160+ BPM)', range: '160+ BPM' }
];

const instrumentSections = {
  drums: [
    '808 bass', 'kick drum', 'snare', 'hi-hats', 'open hats', 'claps', 
    'rim shots', 'crash cymbals', 'ride cymbals', 'trap rolls'
  ],
  melodic: [
    'piano', 'electric piano', 'synth lead', 'synth pad', 'strings', 
    'brass', 'guitar', 'bass guitar', 'organ', 'bells'
  ],
  texture: [
    'vocal chops', 'reverse reverb', 'vinyl crackle', 'tape saturation', 
    'distortion', 'chorus', 'delay', 'reverb', 'filters', 'ambient sounds'
  ],
  samples: [
    'soul samples', 'jazz samples', 'r&b vocals', 'movie quotes', 
    'nature sounds', 'street sounds', 'vinyl loops', 'chopped vocals'
  ]
};

const beatStructures = [
  { id: 'basic', name: 'Basic Loop', description: '8-16 bar loop' },
  { id: 'verse-hook', name: 'Verse-Hook', description: 'Verse + hook sections' },
  { id: 'full-song', name: 'Full Song', description: 'Intro, verse, chorus, bridge, outro' },
  { id: 'freestyle', name: 'Freestyle', description: 'Open-ended, continuous flow' }
];

export default function BeatGenerator() {
  const [activeTab, setActiveTab] = useState('generator');
  const [selectedGenre, setSelectedGenre] = useState('trap');
  const [selectedMood, setSelectedMood] = useState('aggressive');
  const [selectedTempo, setSelectedTempo] = useState('midtempo');
  const [selectedStructure, setSelectedStructure] = useState('basic');
  
  // Advanced controls
  const [complexity, setComplexity] = useState([50]);
  const [creativity, setCreativity] = useState([70]);
  const [energy, setEnergy] = useState([80]);
  const [atmosphere, setAtmosphere] = useState([60]);
  
  // Instrument selections
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [customElements, setCustomElements] = useState('');
  const [artistInfluences, setArtistInfluences] = useState('');
  
  // Generated content
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // UI controls
  const [autoSave, setAutoSave] = useState(true);
  const [advancedMode, setAdvancedMode] = useState(false);
  
  // Web search integration
  const [enableTrendSearch, setEnableTrendSearch] = useState(true);
  const [trendData, setTrendData] = useState<any>(null);
  const [loadingTrends, setLoadingTrends] = useState(false);

  const { toast } = useToast();

  const addInstrument = (instrument: string) => {
    if (!selectedInstruments.includes(instrument)) {
      setSelectedInstruments([...selectedInstruments, instrument]);
    }
  };

  const removeInstrument = (instrument: string) => {
    setSelectedInstruments(selectedInstruments.filter(i => i !== instrument));
  };

  const fetchCurrentTrends = async () => {
    if (!enableTrendSearch) return null;
    
    setLoadingTrends(true);
    try {
      const genreInfo = genres.find(g => g.id === selectedGenre);
      const moodInfo = moods.find(m => m.id === selectedMood);
      
      const searchQuery = `${genreInfo?.name} ${moodInfo?.name} beat production`;
      
      const res = await fetch('/api/beats/search-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ query: searchQuery })
      });

      if (res.ok) {
        const trends = await res.json();
        setTrendData(trends);
        return trends;
      }
      return null;
    } catch (error) {
      console.error('Error fetching trends:', error);
      return null;
    } finally {
      setLoadingTrends(false);
    }
  };

  const generatePrompt = async () => {
    setLoading(true);
    
    const genreInfo = genres.find(g => g.id === selectedGenre);
    const moodInfo = moods.find(m => m.id === selectedMood);
    const tempoInfo = tempos.find(t => t.id === selectedTempo);
    const structureInfo = beatStructures.find(s => s.id === selectedStructure);
    
    // Fetch current trends if enabled
    let currentTrends = null;
    if (enableTrendSearch) {
      currentTrends = await fetchCurrentTrends();
    }
    
    const systemPrompt = `You are an advanced rap beat instrumental prompt generator with access to current music industry trends. Create vivid, cinematic descriptions of hip-hop/rap beats with precise details about sonic texture, instruments, and production techniques. Focus on creating atmospheric and professional beat descriptions that reflect current industry standards. Use lowercase and be highly descriptive with technical details.`;

    let userInput = `Generate a ${tempoInfo?.name} ${genreInfo?.name} beat that is ${moodInfo?.name}.
    
    Structure: ${structureInfo?.description}
    Complexity Level: ${complexity[0]}%
    Energy Level: ${energy[0]}%
    Atmosphere: ${atmosphere[0]}%
    Creativity: ${creativity[0]}%
    
    ${selectedInstruments.length > 0 ? `Key Instruments: ${selectedInstruments.join(', ')}` : ''}
    ${artistInfluences ? `Artist Influences: ${artistInfluences}` : ''}
    ${customElements ? `Custom Elements: ${customElements}` : ''}`;

    // Incorporate trend data if available
    if (currentTrends) {
      userInput += `\n\nCurrent Industry Trends to Incorporate:
      - Trending Genres: ${currentTrends.currentGenres?.join(', ') || 'N/A'}
      - Popular Producers: ${currentTrends.trendingArtists?.join(', ') || 'N/A'}
      - Production Techniques: ${currentTrends.productionTechniques?.join(', ') || 'N/A'}
      - Popular Sounds: ${currentTrends.popularSounds?.join(', ') || 'N/A'}
      - Industry Insights: ${currentTrends.insights?.join('. ') || 'N/A'}`;
    }
    
    userInput += '\n\nCreate a detailed beat description focusing on sonic texture, instrumentation, mood, and current production trends.';

    try {
      const endpoint = '/api/openai/enhance';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          lyrics: userInput,
          prompt: systemPrompt,
          temperature: creativity[0] / 100,
          personaId: 'neutral',
          useAI: true
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate beat prompt');
      }

      const data = await res.json();
      const newPrompt = data.enhancedLyrics;
      
      setGeneratedPrompt(newPrompt);
      setPromptHistory(prev => [newPrompt, ...prev.slice(0, 9)]);
      
      if (autoSave) {
        localStorage.setItem('beatGenerator_history', JSON.stringify([newPrompt, ...promptHistory.slice(0, 9)]));
      }

      toast({
        title: "Beat Prompt Generated",
        description: `Created ${genreInfo?.name} beat prompt with ${moodInfo?.name} mood${currentTrends ? ' using current trends' : ''}`,
      });

    } catch (error) {
      console.error('Error generating beat prompt:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate beat prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: "Beat prompt copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const randomizeSettings = () => {
    setSelectedGenre(genres[Math.floor(Math.random() * genres.length)].id);
    setSelectedMood(moods[Math.floor(Math.random() * moods.length)].id);
    setSelectedTempo(tempos[Math.floor(Math.random() * tempos.length)].id);
    setComplexity([Math.floor(Math.random() * 100)]);
    setCreativity([Math.floor(Math.random() * 100)]);
    setEnergy([Math.floor(Math.random() * 100)]);
    setAtmosphere([Math.floor(Math.random() * 100)]);
    
    toast({
      title: "Settings Randomized",
      description: "All beat parameters have been randomized",
    });
  };

  return (
    <UnifiedPageLayout 
      title="Rap Beat Prompt Generator" 
      description="AI-powered cinematic beat prompt creation with advanced production tools"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Generator
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced Tools
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls Panel */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Music className="h-5 w-5 text-[#FF4081]" />
                  Beat Configuration
                </CardTitle>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="advanced-mode" className="text-gray-300">Advanced Mode</Label>
                    <Switch
                      id="advanced-mode"
                      checked={advancedMode}
                      onCheckedChange={setAdvancedMode}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trend-search" className="text-gray-300">Real-time Trends</Label>
                    <Switch
                      id="trend-search"
                      checked={enableTrendSearch}
                      onCheckedChange={setEnableTrendSearch}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Genre Selection */}
                <div>
                  <Label className="text-white font-medium mb-3 block">Genre</Label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 max-h-60">
                      {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.id} className="text-white">
                          <div>
                            <div className="font-medium">{genre.name}</div>
                            <div className="text-xs text-gray-400">{genre.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mood Selection */}
                <div>
                  <Label className="text-white font-medium mb-3 block">Mood</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {moods.map((mood) => (
                      <Button
                        key={mood.id}
                        variant={selectedMood === mood.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMood(mood.id)}
                        className="text-xs"
                      >
                        {mood.emoji} {mood.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tempo Selection */}
                <div>
                  <Label className="text-white font-medium mb-3 block">Tempo</Label>
                  <Select value={selectedTempo} onValueChange={setSelectedTempo}>
                    <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      {tempos.map((tempo) => (
                        <SelectItem key={tempo.id} value={tempo.id} className="text-white">
                          <div>
                            <div className="font-medium">{tempo.name}</div>
                            <div className="text-xs text-gray-400">{tempo.range}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Controls */}
                {advancedMode && (
                  <>
                    <Separator className="bg-gray-700" />
                    
                    {/* Sliders */}
                    <div className="space-y-4">
                      <div>
                        <Label className="text-white flex items-center justify-between">
                          Complexity <span className="text-[#FFC107]">{complexity[0]}%</span>
                        </Label>
                        <Slider
                          value={complexity}
                          onValueChange={setComplexity}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-white flex items-center justify-between">
                          Energy <span className="text-[#FF4081]">{energy[0]}%</span>
                        </Label>
                        <Slider
                          value={energy}
                          onValueChange={setEnergy}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-white flex items-center justify-between">
                          Creativity <span className="text-[#AB47BC]">{creativity[0]}%</span>
                        </Label>
                        <Slider
                          value={creativity}
                          onValueChange={setCreativity}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-white flex items-center justify-between">
                          Atmosphere <span className="text-[#3F51B5]">{atmosphere[0]}%</span>
                        </Label>
                        <Slider
                          value={atmosphere}
                          onValueChange={setAtmosphere}
                          max={100}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    {/* Artist Influences */}
                    <div>
                      <Label className="text-white font-medium mb-2 block">Artist Influences</Label>
                      <Input
                        placeholder="e.g., Metro Boomin, Mike Will Made-It, Zaytoven..."
                        value={artistInfluences}
                        onChange={(e) => setArtistInfluences(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>

                    {/* Custom Elements */}
                    <div>
                      <Label className="text-white font-medium mb-2 block">Custom Elements</Label>
                      <Textarea
                        placeholder="Specific instruments, effects, or production techniques..."
                        value={customElements}
                        onChange={(e) => setCustomElements(e.target.value)}
                        className="bg-gray-900 border-gray-700 text-white min-h-[80px]"
                      />
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={generatePrompt}
                    disabled={loading}
                    className="flex-1 musaix-gradient-button"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Beat
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={randomizeSettings}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Volume2 className="h-5 w-5 text-[#FF4081]" />
                  Generated Beat Prompt
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedPrompt ? (
                  <div className="space-y-4">
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">
                        {generatedPrompt}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(generatedPrompt)}
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>

                    {/* Beat Characteristics */}
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-[#FF4081] text-white">
                          {genres.find(g => g.id === selectedGenre)?.name}
                        </Badge>
                        <Badge className="bg-[#AB47BC] text-white">
                          {moods.find(m => m.id === selectedMood)?.name}
                        </Badge>
                        <Badge className="bg-[#FFC107] text-black">
                          {tempos.find(t => t.id === selectedTempo)?.name}
                        </Badge>
                        {advancedMode && (
                          <>
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              Energy: {energy[0]}%
                            </Badge>
                            <Badge variant="outline" className="border-gray-600 text-gray-300">
                              Complexity: {complexity[0]}%
                            </Badge>
                          </>
                        )}
                        {enableTrendSearch && (
                          <Badge variant="outline" className="border-green-500 text-green-400">
                            Trends: {loadingTrends ? 'Loading...' : 'Active'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Trend Data Display */}
                    {trendData && enableTrendSearch && (
                      <div className="pt-4 border-t border-gray-700">
                        <h4 className="text-white font-medium mb-3">Current Industry Trends</h4>
                        <div className="space-y-3 text-sm">
                          {trendData.currentGenres && trendData.currentGenres.length > 0 && (
                            <div>
                              <span className="text-gray-400">Trending Genres:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {trendData.currentGenres.slice(0, 4).map((genre: string, index: number) => (
                                  <Badge key={index} variant="outline" className="border-blue-500 text-blue-400 text-xs">
                                    {genre}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {trendData.trendingArtists && trendData.trendingArtists.length > 0 && (
                            <div>
                              <span className="text-gray-400">Popular Producers:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {trendData.trendingArtists.slice(0, 3).map((artist: string, index: number) => (
                                  <Badge key={index} variant="outline" className="border-purple-500 text-purple-400 text-xs">
                                    {artist}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {trendData.productionTechniques && trendData.productionTechniques.length > 0 && (
                            <div>
                              <span className="text-gray-400">Hot Techniques:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {trendData.productionTechniques.slice(0, 3).map((technique: string, index: number) => (
                                  <Badge key={index} variant="outline" className="border-orange-500 text-orange-400 text-xs">
                                    {technique}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Headphones className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Configure your beat settings and click "Generate Beat" to create a cinematic prompt</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Instrument Builder */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <BarChart3 className="h-5 w-5 text-[#FF4081]" />
                  Instrument Builder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(instrumentSections).map(([section, instruments]) => (
                  <div key={section}>
                    <Label className="text-white font-medium mb-2 block capitalize">
                      {section}
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {instruments.map((instrument) => (
                        <Button
                          key={instrument}
                          variant={selectedInstruments.includes(instrument) ? "default" : "outline"}
                          size="sm"
                          onClick={() => 
                            selectedInstruments.includes(instrument) 
                              ? removeInstrument(instrument)
                              : addInstrument(instrument)
                          }
                          className="text-xs justify-start"
                        >
                          {instrument}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
                
                {selectedInstruments.length > 0 && (
                  <div className="pt-4 border-t border-gray-700">
                    <Label className="text-white font-medium mb-2 block">Selected Instruments</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedInstruments.map((instrument) => (
                        <Badge
                          key={instrument}
                          className="bg-[#FF4081] text-white cursor-pointer"
                          onClick={() => removeInstrument(instrument)}
                        >
                          {instrument} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Beat Structure */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-[#FF4081]" />
                  Beat Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {beatStructures.map((structure) => (
                  <div
                    key={structure.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedStructure === structure.id
                        ? 'border-[#FF4081] bg-[#FF4081]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedStructure(structure.id)}
                  >
                    <div className="font-medium text-white">{structure.name}</div>
                    <div className="text-sm text-gray-400">{structure.description}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <RefreshCw className="h-5 w-5 text-[#FF4081]" />
                Generated Prompts History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {promptHistory.length > 0 ? (
                <div className="space-y-4">
                  {promptHistory.map((prompt, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg p-4">
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        {prompt}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyToClipboard(prompt)}
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          onClick={() => setGeneratedPrompt(prompt)}
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Use This
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No prompts generated yet. Create your first beat prompt to see history here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </UnifiedPageLayout>
  );
}