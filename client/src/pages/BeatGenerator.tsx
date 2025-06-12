import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UnifiedPageLayout from '@/components/layout/UnifiedPageLayout';
import { Loader2, Music, Zap, Copy, RefreshCw, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const genres = ['trap', 'boom bap', 'drill', 'dirty south', 'lo-fi', 'cloud rap', 'jazz rap', 'phonk', 'experimental'];
const moods = ['aggressive', 'sad', 'epic', 'laid-back', 'dark', 'hype', 'melancholic', 'triumphant', 'mysterious'];
const tempos = ['slow', 'midtempo', 'fast', 'double-time'];

export default function BeatGenerator() {
  const [genre, setGenre] = useState('trap');
  const [mood, setMood] = useState('aggressive');
  const [tempo, setTempo] = useState('midtempo');
  const [extras, setExtras] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);

  const { toast } = useToast();

  const generatePrompt = async () => {
    setLoading(true);
    const systemPrompt = `You are a rap beat instrumental prompt generator. Describe vivid, cinematic 1–2 sentence instrumental hip-hop/rap beats with genre, mood, tempo, sonic texture, and key instruments. No vocals. No lists. lowercase only.`;

    const userInput = `Generate a ${tempo} ${genre} beat that is ${mood}, with details like: ${extras}`;

    try {
      // Use the existing OpenAI endpoint with required parameters
      const endpoint = '/api/openai/enhance';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          lyrics: userInput,
          prompt: systemPrompt,
          temperature: 0.8,
          personaId: 'neutral', // Required parameter
          useAI: true
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate prompt');
      }

      const data = await res.json();
      const generatedPrompt = data.enhancedLyrics || 'Failed to generate prompt.';
      
      setPrompt(generatedPrompt.trim());
      
      // Add to history
      if (generatedPrompt && generatedPrompt !== 'Failed to generate prompt.') {
        setPromptHistory(prev => [generatedPrompt.trim(), ...prev.slice(0, 4)]);
      }

      toast({
        title: "Beat prompt generated!",
        description: "Your cinematic beat description is ready.",
      });
    } catch (err) {
      console.error('Error generating prompt:', err);
      setPrompt('Failed to generate prompt. Please try again.');
      toast({
        title: "Generation failed",
        description: "Unable to generate beat prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (prompt) {
      try {
        await navigator.clipboard.writeText(prompt);
        toast({
          title: "Copied to clipboard!",
          description: "Beat prompt copied successfully.",
        });
      } catch (err) {
        toast({
          title: "Copy failed",
          description: "Unable to copy to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const useHistoryPrompt = (historyPrompt: string) => {
    setPrompt(historyPrompt);
  };

  const clearAll = () => {
    setPrompt('');
    setExtras('');
    setPromptHistory([]);
  };

  return (
    <UnifiedPageLayout 
      title="Beat Prompt Generator"
      description="Generate AI-powered cinematic descriptions for rap beat production"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Main Generator Card */}
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wand2 className="h-6 w-6 text-[#FF4081]" />
              Rap Beat Prompt Generator
            </CardTitle>
            <p className="text-gray-400">
              Create vivid, cinematic descriptions for instrumental hip-hop beats
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Genre</label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {genres.map(g => (
                      <SelectItem key={g} value={g} className="text-white hover:bg-gray-700">
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Mood</label>
                <Select value={mood} onValueChange={setMood}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {moods.map(m => (
                      <SelectItem key={m} value={m} className="text-white hover:bg-gray-700">
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm font-medium">Tempo</label>
                <Select value={tempo} onValueChange={setTempo}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {tempos.map(t => (
                      <SelectItem key={t} value={t} className="text-white hover:bg-gray-700">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Extra Details */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Extra Details</label>
              <Input
                placeholder="808s, cinematic, grime, vinyl crackle, orchestral, etc."
                value={extras}
                onChange={e => setExtras(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>

            {/* Generate Button */}
            <div className="flex gap-3">
              <Button 
                onClick={generatePrompt} 
                disabled={loading} 
                className="flex-1 musaix-gradient-button"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Prompt
                  </>
                )}
              </Button>
              
              <Button
                onClick={clearAll}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Generated Prompt */}
            {prompt && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-white text-sm font-medium">Generated Beat Prompt</label>
                  <Button
                    onClick={copyToClipboard}
                    size="sm"
                    variant="outline"
                    className="border-[#FF4081]/50 text-[#FF4081] hover:bg-[#FF4081]/10"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
                <Textarea 
                  readOnly 
                  value={prompt} 
                  className="bg-gray-800 border-gray-600 text-white min-h-[100px] resize-none"
                  rows={4} 
                />
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-[#FF4081]/20 text-[#FF4081]">
                    {genre}
                  </Badge>
                  <Badge variant="secondary" className="bg-[#AB47BC]/20 text-[#AB47BC]">
                    {mood}
                  </Badge>
                  <Badge variant="secondary" className="bg-[#FFC107]/20 text-[#FFC107]">
                    {tempo}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prompt History */}
        {promptHistory.length > 0 && (
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Music className="h-5 w-5 text-[#AB47BC]" />
                Recent Prompts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {promptHistory.map((historyPrompt, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                    onClick={() => useHistoryPrompt(historyPrompt)}
                  >
                    <p className="text-white text-sm">{historyPrompt}</p>
                    <p className="text-gray-400 text-xs mt-2">Click to use this prompt</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Tips */}
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-white text-lg">Usage Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="text-white font-medium mb-2">Best Practices:</h4>
                <ul className="space-y-1">
                  <li>• Use specific instruments in extra details</li>
                  <li>• Combine multiple moods for complexity</li>
                  <li>• Reference classic producers or eras</li>
                  <li>• Include texture descriptions (gritty, clean, etc.)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-2">Example Details:</h4>
                <ul className="space-y-1">
                  <li>• "analog warmth, vinyl crackle"</li>
                  <li>• "orchestral strings, trap 808s"</li>
                  <li>• "metro boomin style, ambient pads"</li>
                  <li>• "old school samples, modern drums"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedPageLayout>
  );
}