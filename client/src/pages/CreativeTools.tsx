import PageLayout from "@/components/layout/PageLayout";
import ToolsNavigation from "@/components/layout/ToolsNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Wand2, Zap, BarChart3, MusicIcon, Download, Mic } from "lucide-react";
import PersonaEnergyMeter from "@/components/PersonaEnergyMeter";
import { Persona } from "@/lib/types";

export default function CreativeTools() {
  // Use a sample persona for the energy meter demo
  const samplePersona: Persona = {
    id: "kendrick",
    name: "Kendrick Lamar",
    description: "Dense wordplay",
    icon: "crown"
  };
  
  // Sample lyrics for demonstration
  const sampleLyrics = "I got power, poison, pain and joy inside my DNA\nI got hustle though, ambition, flow inside my DNA";

  return (
    <PageLayout title="Creative Tools" description="Enhance your creative process with these specialized tools">
      <ToolsNavigation />
      
      <Tabs defaultValue="lyric-tools" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-6">
          <TabsTrigger value="lyric-tools">Lyric Tools</TabsTrigger>
          <TabsTrigger value="energy-analyzer">Energy Analyzer</TabsTrigger>
          <TabsTrigger value="audio-tools">Audio Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lyric-tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wand2 className="mr-2 h-5 w-5" />
                  Rhyme Generator
                </CardTitle>
                <CardDescription>Find perfect rhymes for your lyrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Enter a word to generate rhymes and near-rhymes to enhance your lyrical flow.
                </p>
                <Button className="w-full">Open Rhyme Generator</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Flow Analyzer
                </CardTitle>
                <CardDescription>Analyze your flow and cadence</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Paste your lyrics to get insights on syllable patterns, stress points, and flow suggestions.
                </p>
                <Button className="w-full">Open Flow Analyzer</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MusicIcon className="mr-2 h-5 w-5" />
                  Structure Formatter
                </CardTitle>
                <CardDescription>Format your song structure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Organize your lyrics into professional verse-chorus structure with section markers.
                </p>
                <Button className="w-full">Open Structure Formatter</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="energy-analyzer" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Persona Energy Meter
                </CardTitle>
                <CardDescription>Visualize the creative intensity of your lyrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  The energy meter analyzes your lyrics and chosen persona to determine 
                  the energy level and emotional intensity of your content.
                </p>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Sample Lyrics with {samplePersona.name} Persona</h3>
                  <p className="text-sm text-muted-foreground mb-4">{sampleLyrics}</p>
                  
                  <PersonaEnergyMeter 
                    persona={samplePersona}
                    lyrics={sampleLyrics}
                  />
                </div>
                
                <div className="bg-secondary/10 rounded-md p-3 text-sm">
                  <h4 className="font-medium mb-1">What Factors Affect Energy?</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                    <li>Word choice and vocabulary</li>
                    <li>Persona's typical style</li>
                    <li>Exclamation marks and emphasis</li>
                    <li>Themes and emotional content</li>
                  </ul>
                </div>
                
                <Button className="w-full">Analyze Your Lyrics</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Energy Map Guide</CardTitle>
                <CardDescription>Understanding energy levels in different personas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                    <div>
                      <h4 className="font-medium">Calm (0-30%)</h4>
                      <p className="text-sm text-muted-foreground">
                        Gentle, reflective, and introspective lyrics.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <div>
                      <h4 className="font-medium">Balanced (30-60%)</h4>
                      <p className="text-sm text-muted-foreground">
                        Moderate energy with a mix of intensity and restraint.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                    <div>
                      <h4 className="font-medium">Energetic (60-85%)</h4>
                      <p className="text-sm text-muted-foreground">
                        High energy, assertive and dynamic expression.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <div>
                      <h4 className="font-medium">Intense (85-100%)</h4>
                      <p className="text-sm text-muted-foreground">
                        Maximum energy, aggressive and very passionate delivery.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-md mt-4">
                  <h4 className="font-medium mb-2">Persona Energy Spectrum</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Each musical persona has their own baseline energy level that influences how your lyrics are perceived.
                  </p>
                  <Button variant="outline" className="w-full mt-2">
                    <Download className="mr-2 h-4 w-4" />
                    Download Energy Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="audio-tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mic className="mr-2 h-5 w-5" />
                  Voice Style Preview
                </CardTitle>
                <CardDescription>Preview vocal styles for your lyrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Hear how your lyrics might sound when performed in different vocal styles and personas.
                </p>
                <Button className="w-full">Open Voice Preview</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Coming Soon</CardTitle>
                <CardDescription>We're working on more audio tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Future Audio Tools</h4>
                  <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                    <li>Melody Generator</li>
                    <li>Beat Matcher</li>
                    <li>Harmony Suggester</li>
                    <li>Vocal Effect Simulator</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}