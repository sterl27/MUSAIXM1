import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UnifiedPageLayout from "@/components/layout/UnifiedPageLayout";
import { Search, Copy, RefreshCw, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RhymeGenerator() {
  const [inputWord, setInputWord] = useState("");
  const [searchedWord, setSearchedWord] = useState("");
  const { toast } = useToast();

  // Comprehensive rhyme database
  const rhymeDatabase: Record<string, { perfect: string[], near: string[], slant: string[] }> = {
    "flow": {
      perfect: ["go", "show", "know", "grow", "throw", "slow", "glow", "blow", "row", "low", "pro", "bro", "yo", "whoa"],
      near: ["soul", "goal", "roll", "toll", "hole", "whole", "pole", "bold", "gold", "told", "hold", "cold"],
      slant: ["few", "true", "blue", "crew", "new", "view", "through", "drew", "flew", "grew", "knew", "threw"]
    },
    "fire": {
      perfect: ["hire", "wire", "tire", "dire", "liar", "choir", "buyer", "flyer", "dryer", "higher", "desire", "require", "inspire", "acquire", "retire", "admire"],
      near: ["fear", "near", "dear", "clear", "year", "here", "peer", "beer", "gear", "tear", "wear", "bear"],
      slant: ["far", "car", "star", "bar", "war", "are", "hard", "guard", "yard", "card", "part", "heart"]
    },
    "time": {
      perfect: ["rhyme", "climb", "crime", "prime", "lime", "dime", "chime", "grime", "mime", "thyme", "sublime", "paradigm"],
      near: ["mind", "find", "kind", "blind", "grind", "wind", "bind", "signed", "lined", "fined", "mined", "shined"],
      slant: ["team", "dream", "cream", "stream", "beam", "seem", "theme", "scheme", "extreme", "supreme"]
    },
    "love": {
      perfect: ["above", "dove", "shove", "glove", "thereof", "enough", "rough", "tough", "stuff", "bluff", "cuff", "buff"],
      near: ["life", "knife", "wife", "strife", "rife", "fife"],
      slant: ["leave", "believe", "achieve", "receive", "deceive", "conceive", "retrieve", "relieve"]
    },
    "way": {
      perfect: ["day", "say", "play", "stay", "may", "pay", "lay", "bay", "hay", "gray", "pray", "sway", "clay", "spray", "delay", "decay", "display", "replay", "betray", "today"],
      near: ["wait", "gate", "fate", "late", "hate", "rate", "mate", "date", "state", "great", "straight", "weight"],
      slant: ["will", "still", "hill", "fill", "kill", "skill", "drill", "chill", "thrill", "spill"]
    },
    "beat": {
      perfect: ["feet", "heat", "meet", "sweet", "street", "neat", "seat", "meat", "treat", "wheat", "sheet", "fleet", "greet", "compete", "complete", "defeat", "repeat", "retreat"],
      near: ["bit", "hit", "sit", "fit", "pit", "wit", "kit", "split", "quit", "lit", "spit", "admit"],
      slant: ["bad", "mad", "sad", "had", "glad", "pad", "add", "dad", "lad", "rad"]
    },
    "night": {
      perfect: ["light", "sight", "right", "fight", "flight", "bright", "height", "might", "tight", "white", "bite", "write", "spite", "quite", "invite", "delight", "insight", "tonight"],
      near: ["nice", "ice", "price", "twice", "dice", "mice", "vice", "slice", "spice", "advice"],
      slant: ["not", "hot", "got", "shot", "spot", "plot", "lot", "pot", "rot", "dot"]
    },
    "real": {
      perfect: ["feel", "deal", "steal", "heal", "meal", "seal", "wheel", "steel", "kneel", "peel", "reel", "appeal", "reveal", "ideal", "surreal"],
      near: ["rail", "tail", "sail", "nail", "mail", "jail", "fail", "pale", "sale", "tale", "scale", "whale"],
      slant: ["roll", "soul", "goal", "toll", "hole", "whole", "pole", "bold", "gold", "told"]
    }
  };

  const generateRhymes = (word: string) => {
    const lowerWord = word.toLowerCase();
    
    // Check if we have the word in our database
    if (rhymeDatabase[lowerWord]) {
      return rhymeDatabase[lowerWord];
    }
    
    // Generate rhymes based on word endings
    const wordEnding = lowerWord.slice(-2);
    const wordEndingLong = lowerWord.slice(-3);
    
    const allWords = Object.keys(rhymeDatabase).reduce((acc, key) => {
      return [...acc, ...rhymeDatabase[key].perfect, ...rhymeDatabase[key].near, ...rhymeDatabase[key].slant];
    }, [] as string[]);
    
    const perfect = allWords.filter(w => w.endsWith(wordEnding) && w !== lowerWord);
    const near = allWords.filter(w => w.endsWith(wordEndingLong.slice(-2)) && !perfect.includes(w) && w !== lowerWord);
    const slant = allWords.filter(w => w.includes(wordEnding.slice(-1)) && !perfect.includes(w) && !near.includes(w) && w !== lowerWord);
    
    return {
      perfect: perfect.slice(0, 15),
      near: near.slice(0, 12),
      slant: slant.slice(0, 10)
    };
  };

  const rhymes = useMemo(() => {
    if (!searchedWord) return { perfect: [], near: [], slant: [] };
    return generateRhymes(searchedWord);
  }, [searchedWord]);

  const handleSearch = () => {
    if (inputWord.trim()) {
      setSearchedWord(inputWord.trim());
    }
  };

  const copyToClipboard = (word: string) => {
    navigator.clipboard.writeText(word);
    toast({
      title: "Copied!",
      description: `"${word}" copied to clipboard`,
    });
  };

  const copyAllRhymes = (type: 'perfect' | 'near' | 'slant') => {
    const words = rhymes[type].join(', ');
    navigator.clipboard.writeText(words);
    toast({
      title: "Copied!",
      description: `All ${type} rhymes copied to clipboard`,
    });
  };

  return (
    <UnifiedPageLayout 
      title="Rhyme Generator"
      description="Find perfect rhymes for your lyrics to enhance your lyrical flow"
    >
      <div className="space-y-6">
        {/* Search Section */}
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="h-5 w-5 text-[#FF4081]" />
              Find Rhymes
            </CardTitle>
            <CardDescription className="text-gray-400">
              Enter a word to generate rhymes and near-rhymes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Enter a word (e.g., flow, fire, time)..."
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-gray-800 border-gray-600 text-white text-lg"
              />
              <Button 
                onClick={handleSearch} 
                disabled={!inputWord.trim()}
                className="musaix-gradient-button gap-2"
              >
                <Search className="h-4 w-4" />
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {searchedWord && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Perfect Rhymes */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF4081]"></div>
                    Perfect Rhymes
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyAllRhymes('perfect')}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Exact sound matches with "{searchedWord}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {rhymes.perfect.length > 0 ? (
                    rhymes.perfect.map((word, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="mr-2 mb-2 bg-[#FF4081]/10 border-[#FF4081]/30 text-[#FF4081] hover:bg-[#FF4081]/20 cursor-pointer"
                        onClick={() => copyToClipboard(word)}
                      >
                        {word}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No perfect rhymes found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Near Rhymes */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#AB47BC]"></div>
                    Near Rhymes
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyAllRhymes('near')}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Close sound matches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {rhymes.near.length > 0 ? (
                    rhymes.near.map((word, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="mr-2 mb-2 bg-[#AB47BC]/10 border-[#AB47BC]/30 text-[#AB47BC] hover:bg-[#AB47BC]/20 cursor-pointer"
                        onClick={() => copyToClipboard(word)}
                      >
                        {word}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No near rhymes found</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Slant Rhymes */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FFC107]"></div>
                    Slant Rhymes
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyAllRhymes('slant')}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription className="text-gray-400">
                  Creative sound connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {rhymes.slant.length > 0 ? (
                    rhymes.slant.map((word, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="mr-2 mb-2 bg-[#FFC107]/10 border-[#FFC107]/30 text-[#FFC107] hover:bg-[#FFC107]/20 cursor-pointer"
                        onClick={() => copyToClipboard(word)}
                      >
                        {word}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No slant rhymes found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Examples */}
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#FFC107]" />
              Quick Examples
            </CardTitle>
            <CardDescription className="text-gray-400">
              Try these popular rap words
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["flow", "fire", "time", "love", "way", "beat", "night", "real"].map((word) => (
                <Button
                  key={word}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInputWord(word);
                    setSearchedWord(word);
                  }}
                  className="border-gray-600 text-white hover:bg-gray-700"
                >
                  {word}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-white">Pro Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-[#FF4081] mb-2">Perfect Rhymes</h4>
                <p>Use for strong endings and choruses. They create memorable hooks.</p>
              </div>
              <div>
                <h4 className="font-medium text-[#AB47BC] mb-2">Near Rhymes</h4>
                <p>Great for verses. They maintain flow without being too obvious.</p>
              </div>
              <div>
                <h4 className="font-medium text-[#FFC107] mb-2">Slant Rhymes</h4>
                <p>Add creativity and surprise. Perfect for complex lyrical patterns.</p>
              </div>
              <div>
                <h4 className="font-medium text-[#3F51B5] mb-2">Mix & Match</h4>
                <p>Combine different rhyme types to create dynamic and engaging lyrics.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedPageLayout>
  );
}