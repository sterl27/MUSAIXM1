import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UnifiedPageLayout from "@/components/layout/UnifiedPageLayout";
import { FileText, Download, RefreshCw, Music, ArrowRight, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StructureFormatter() {
  const [inputLyrics, setInputLyrics] = useState("");
  const [formattedLyrics, setFormattedLyrics] = useState("");
  const [selectedStructure, setSelectedStructure] = useState("verse-chorus");
  const { toast } = useToast();

  const structures = {
    "verse-chorus": {
      name: "Verse-Chorus",
      pattern: ["Verse 1", "Chorus", "Verse 2", "Chorus", "Bridge", "Chorus"],
      description: "Classic pop/rap structure"
    },
    "aaba": {
      name: "AABA",
      pattern: ["Verse 1", "Verse 2", "Bridge", "Verse 3"],
      description: "Traditional song form"
    },
    "verse-prechorus-chorus": {
      name: "Verse-PreChorus-Chorus",
      pattern: ["Verse 1", "Pre-Chorus", "Chorus", "Verse 2", "Pre-Chorus", "Chorus", "Bridge", "Chorus"],
      description: "Modern pop structure"
    },
    "rap-standard": {
      name: "Rap Standard",
      pattern: ["Intro", "Verse 1", "Hook", "Verse 2", "Hook", "Verse 3", "Hook", "Outro"],
      description: "Traditional rap format"
    },
    "trap": {
      name: "Trap Style",
      pattern: ["Intro", "Verse 1", "Chorus", "Verse 2", "Chorus", "Bridge", "Chorus", "Outro"],
      description: "Modern trap structure"
    }
  };

  const formatLyrics = () => {
    if (!inputLyrics.trim()) {
      toast({
        title: "No lyrics to format",
        description: "Please enter some lyrics first",
        variant: "destructive",
      });
      return;
    }

    const lines = inputLyrics.split('\n').filter(line => line.trim());
    const structure = structures[selectedStructure as keyof typeof structures];
    const sectionsCount = structure.pattern.length;
    const linesPerSection = Math.ceil(lines.length / sectionsCount);
    
    let formatted = "";
    let lineIndex = 0;

    structure.pattern.forEach((sectionName, sectionIndex) => {
      formatted += `[${sectionName}]\n`;
      
      // Add lines for this section
      const sectionLines = lines.slice(lineIndex, lineIndex + linesPerSection);
      sectionLines.forEach(line => {
        formatted += `${line}\n`;
      });
      
      formatted += "\n";
      lineIndex += linesPerSection;
    });

    setFormattedLyrics(formatted.trim());
    
    toast({
      title: "Lyrics formatted!",
      description: `Applied ${structure.name} structure`,
    });
  };

  const copyToClipboard = () => {
    if (formattedLyrics) {
      navigator.clipboard.writeText(formattedLyrics);
      toast({
        title: "Copied!",
        description: "Formatted lyrics copied to clipboard",
      });
    }
  };

  const downloadAsFile = () => {
    if (!formattedLyrics) {
      toast({
        title: "Nothing to download",
        description: "Please format lyrics first",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([formattedLyrics], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted_lyrics.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: "Formatted lyrics saved as file",
    });
  };

  const clearAll = () => {
    setInputLyrics("");
    setFormattedLyrics("");
  };

  return (
    <UnifiedPageLayout 
      title="Structure Formatter"
      description="Organize your lyrics into professional verse-chorus structure with section markers"
    >
      <div className="space-y-6">
        {/* Controls */}
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Music className="h-5 w-5 text-[#FF4081]" />
              Structure Settings
            </CardTitle>
            <CardDescription className="text-gray-400">
              Choose a song structure to format your lyrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedStructure} onValueChange={setSelectedStructure}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select structure" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(structures).map(([key, structure]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex flex-col">
                          <span>{structure.name}</span>
                          <span className="text-xs text-gray-400">{structure.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={formatLyrics} 
                  disabled={!inputLyrics.trim()}
                  className="musaix-gradient-button gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Format
                </Button>
                <Button variant="outline" onClick={clearAll} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Structure Preview */}
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-white">
              {structures[selectedStructure as keyof typeof structures].name} Structure
            </CardTitle>
            <CardDescription className="text-gray-400">
              {structures[selectedStructure as keyof typeof structures].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {structures[selectedStructure as keyof typeof structures].pattern.map((section, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="bg-[#AB47BC]/10 border-[#AB47BC]/30 text-[#AB47BC]"
                >
                  {index + 1}. {section}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Input and Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#FFC107]" />
                Raw Lyrics
              </CardTitle>
              <CardDescription className="text-gray-400">
                Paste your unformatted lyrics here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Paste your lyrics here...

Example:
I'm writing rhymes that blow your mind
Every single word perfectly aligned
Creating beats that make you move
Getting lost inside the groove
When the music starts to play
All my worries fade away"
                value={inputLyrics}
                onChange={(e) => setInputLyrics(e.target.value)}
                className="min-h-[400px] bg-gray-900 border-gray-600 text-white text-base leading-relaxed"
              />
              <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
                <span>{inputLyrics.split('\n').filter(line => line.trim()).length} lines</span>
                <span>{inputLyrics.split(/\s+/).filter(w => w.length > 0).length} words</span>
              </div>
            </CardContent>
          </Card>

          {/* Output */}
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Music className="h-5 w-5 text-[#3F51B5]" />
                    Formatted Lyrics
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Professional song structure with section markers
                  </CardDescription>
                </div>
                {formattedLyrics && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={downloadAsFile}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {formattedLyrics ? (
                <div className="bg-gray-900 p-4 rounded-md min-h-[400px] border border-gray-700">
                  <pre className="text-white text-base leading-relaxed whitespace-pre-wrap font-mono">
                    {formattedLyrics}
                  </pre>
                </div>
              ) : (
                <div className="bg-gray-900 p-4 rounded-md min-h-[400px] border border-gray-700 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Formatted lyrics will appear here</p>
                    <p className="text-sm mt-2">Enter lyrics and click "Format" to get started</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips */}
        <Card className="musaix-card-border bg-black/50">
          <CardHeader>
            <CardTitle className="text-white">Formatting Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-[#FF4081] mb-2">Verse Structure</h4>
                <p>Each verse should tell part of your story. Keep consistent syllable counts for better flow.</p>
              </div>
              <div>
                <h4 className="font-medium text-[#AB47BC] mb-2">Chorus Power</h4>
                <p>Make your chorus memorable and catchy. This is what listeners will remember most.</p>
              </div>
              <div>
                <h4 className="font-medium text-[#FFC107] mb-2">Bridge Purpose</h4>
                <p>Use the bridge to add variety or present a different perspective on your theme.</p>
              </div>
              <div>
                <h4 className="font-medium text-[#3F51B5] mb-2">Section Markers</h4>
                <p>Professional lyrics always include clear section markers for performers and producers.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedPageLayout>
  );
}