import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UnifiedPageLayout from '@/components/layout/UnifiedPageLayout';
import { 
  Music, Play, Pause, Save, Download, Share, 
  Volume2, Settings, Layers, Mic, Clock, 
  TrendingUp, Target, Zap, RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const drumPatterns = [
  { id: 'trap-modern', name: 'Modern Trap', pattern: '1...2.3.....4.5.' },
  { id: 'boom-bap-classic', name: 'Classic Boom Bap', pattern: '1.2.3.4.1.2.3.4.' },
  { id: 'drill-uk', name: 'UK Drill', pattern: '1..23...4..56...' },
  { id: 'phonk-memphis', name: 'Memphis Phonk', pattern: '1.234.5.6.78..9.' },
  { id: 'afrobeat', name: 'Afrobeat', pattern: '1.2.3.1.2.3.4.5.' },
];

const bassPatterns = [
  { id: '808-hard', name: 'Hard 808', notes: ['C2', 'F2', 'G2', 'C3'] },
  { id: '808-melodic', name: 'Melodic 808', notes: ['C2', 'Eb2', 'F2', 'G2', 'Bb2'] },
  { id: 'sub-bass', name: 'Sub Bass', notes: ['C1', 'F1', 'G1'] },
  { id: 'reese-bass', name: 'Reese Bass', notes: ['C2', 'D2', 'F2'] },
];

const melodicElements = [
  { id: 'piano-keys', name: 'Piano Keys', style: 'Warm, nostalgic piano chords' },
  { id: 'synth-lead', name: 'Synth Lead', style: 'Bright, cutting synthesizer melody' },
  { id: 'guitar-sample', name: 'Guitar Sample', style: 'Looped guitar riff with vintage feel' },
  { id: 'string-section', name: 'String Section', style: 'Orchestral strings for cinematic depth' },
  { id: 'brass-stabs', name: 'Brass Stabs', style: 'Punchy horn sections for emphasis' },
];

export default function BeatStudio() {
  const [activeTab, setActiveTab] = useState('builder');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Beat parameters
  const [bpm, setBpm] = useState([120]);
  const [swing, setSwing] = useState([0]);
  const [groove, setGroove] = useState([50]);
  
  // Pattern selections
  const [selectedDrumPattern, setSelectedDrumPattern] = useState('trap-modern');
  const [selectedBassPattern, setSelectedBassPattern] = useState('808-hard');
  const [selectedMelodic, setSelectedMelodic] = useState<string[]>([]);
  
  // Mix parameters
  const [drumVolume, setDrumVolume] = useState([80]);
  const [bassVolume, setBassVolume] = useState([75]);
  const [melodicVolume, setMelodicVolume] = useState([60]);
  
  // Effects
  const [reverb, setReverb] = useState([30]);
  const [delay, setDelay] = useState([20]);
  const [distortion, setDistortion] = useState([10]);
  const [compression, setCompression] = useState([40]);
  
  // Project settings
  const [projectName, setProjectName] = useState('');
  const [beatGenre, setBeatGenre] = useState('trap');
  const [beatKey, setBeatKey] = useState('C');
  const [beatMode, setBeatMode] = useState('minor');
  
  const { toast } = useToast();

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Playback Stopped" : "Playback Started",
      description: `Beat ${isPlaying ? 'stopped' : 'playing'} at ${bpm[0]} BPM`,
    });
  };

  const addMelodicElement = (elementId: string) => {
    if (!selectedMelodic.includes(elementId)) {
      setSelectedMelodic([...selectedMelodic, elementId]);
    }
  };

  const removeMelodicElement = (elementId: string) => {
    setSelectedMelodic(selectedMelodic.filter(id => id !== elementId));
  };

  const exportBeat = () => {
    const beatData = {
      name: projectName || 'Untitled Beat',
      bpm: bpm[0],
      key: beatKey,
      mode: beatMode,
      genre: beatGenre,
      patterns: {
        drums: selectedDrumPattern,
        bass: selectedBassPattern,
        melodic: selectedMelodic
      },
      mix: {
        drums: drumVolume[0],
        bass: bassVolume[0],
        melodic: melodicVolume[0]
      },
      effects: {
        reverb: reverb[0],
        delay: delay[0],
        distortion: distortion[0],
        compression: compression[0]
      }
    };

    const dataStr = JSON.stringify(beatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${beatData.name.replace(/\s+/g, '_')}.json`;
    link.click();

    toast({
      title: "Beat Exported",
      description: `${beatData.name} exported as JSON project file`,
    });
  };

  const generateRandomBeat = () => {
    setSelectedDrumPattern(drumPatterns[Math.floor(Math.random() * drumPatterns.length)].id);
    setSelectedBassPattern(bassPatterns[Math.floor(Math.random() * bassPatterns.length)].id);
    setBpm([60 + Math.floor(Math.random() * 100)]);
    setSwing([Math.floor(Math.random() * 50)]);
    setGroove([Math.floor(Math.random() * 100)]);
    
    // Randomly select 1-3 melodic elements
    const numElements = 1 + Math.floor(Math.random() * 3);
    const randomElements: string[] = [];
    for (let i = 0; i < numElements; i++) {
      const randomElement = melodicElements[Math.floor(Math.random() * melodicElements.length)];
      if (!randomElements.includes(randomElement.id)) {
        randomElements.push(randomElement.id);
      }
    }
    setSelectedMelodic(randomElements);

    toast({
      title: "Random Beat Generated",
      description: `Created random ${beatGenre} beat at ${bpm[0]} BPM`,
    });
  };

  return (
    <UnifiedPageLayout 
      title="Beat Studio" 
      description="Professional beat creation and production workspace"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="mix" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Mix
          </TabsTrigger>
          <TabsTrigger value="effects" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </TabsTrigger>
        </TabsList>

        {/* Beat Builder Tab */}
        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Transport Controls */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Music className="h-5 w-5 text-[#FF4081]" />
                  Transport
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    onClick={togglePlayback}
                    className={`flex-1 ${isPlaying ? 'bg-red-600 hover:bg-red-700' : 'musaix-gradient-button'}`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={generateRandomBeat}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-white flex items-center justify-between">
                      BPM <span className="text-[#FF4081]">{bpm[0]}</span>
                    </Label>
                    <Slider
                      value={bpm}
                      onValueChange={setBpm}
                      min={60}
                      max={200}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-white flex items-center justify-between">
                      Swing <span className="text-[#FFC107]">{swing[0]}%</span>
                    </Label>
                    <Slider
                      value={swing}
                      onValueChange={setSwing}
                      max={50}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-white flex items-center justify-between">
                      Groove <span className="text-[#AB47BC]">{groove[0]}%</span>
                    </Label>
                    <Slider
                      value={groove}
                      onValueChange={setGroove}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white text-sm">Key</Label>
                    <Select value={beatKey} onValueChange={setBeatKey}>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map((key) => (
                          <SelectItem key={key} value={key} className="text-white">
                            {key}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white text-sm">Mode</Label>
                    <Select value={beatMode} onValueChange={setBeatMode}>
                      <SelectTrigger className="bg-gray-900 border-gray-700 text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="major" className="text-white">Major</SelectItem>
                        <SelectItem value="minor" className="text-white">Minor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Drum Patterns */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Target className="h-5 w-5 text-[#FF4081]" />
                  Drum Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {drumPatterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedDrumPattern === pattern.id
                        ? 'border-[#FF4081] bg-[#FF4081]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedDrumPattern(pattern.id)}
                  >
                    <div className="font-medium text-white mb-1">{pattern.name}</div>
                    <div className="text-xs font-mono text-gray-400">{pattern.pattern}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Bass Patterns */}
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Volume2 className="h-5 w-5 text-[#FF4081]" />
                  Bass Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bassPatterns.map((bass) => (
                  <div
                    key={bass.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedBassPattern === bass.id
                        ? 'border-[#FF4081] bg-[#FF4081]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedBassPattern(bass.id)}
                  >
                    <div className="font-medium text-white mb-1">{bass.name}</div>
                    <div className="text-xs text-gray-400">
                      Notes: {bass.notes.join(', ')}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Melodic Elements */}
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Mic className="h-5 w-5 text-[#FF4081]" />
                Melodic Elements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {melodicElements.map((element) => (
                  <div
                    key={element.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedMelodic.includes(element.id)
                        ? 'border-[#FF4081] bg-[#FF4081]/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => 
                      selectedMelodic.includes(element.id) 
                        ? removeMelodicElement(element.id)
                        : addMelodicElement(element.id)
                    }
                  >
                    <div className="font-medium text-white mb-2">{element.name}</div>
                    <div className="text-sm text-gray-400">{element.style}</div>
                  </div>
                ))}
              </div>

              {selectedMelodic.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <Label className="text-white font-medium mb-2 block">Selected Elements</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedMelodic.map((elementId) => {
                      const element = melodicElements.find(e => e.id === elementId);
                      return (
                        <Badge
                          key={elementId}
                          className="bg-[#FF4081] text-white cursor-pointer"
                          onClick={() => removeMelodicElement(elementId)}
                        >
                          {element?.name} ×
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mix Tab */}
        <TabsContent value="mix" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white">Drum Mix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white flex items-center justify-between">
                      Volume <span className="text-[#FF4081]">{drumVolume[0]}%</span>
                    </Label>
                    <Slider
                      value={drumVolume}
                      onValueChange={setDrumVolume}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white">Bass Mix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white flex items-center justify-between">
                      Volume <span className="text-[#FF4081]">{bassVolume[0]}%</span>
                    </Label>
                    <Slider
                      value={bassVolume}
                      onValueChange={setBassVolume}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white">Melodic Mix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white flex items-center justify-between">
                      Volume <span className="text-[#FF4081]">{melodicVolume[0]}%</span>
                    </Label>
                    <Slider
                      value={melodicVolume}
                      onValueChange={setMelodicVolume}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Effects Tab */}
        <TabsContent value="effects" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white">Spatial Effects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white flex items-center justify-between">
                    Reverb <span className="text-[#FF4081]">{reverb[0]}%</span>
                  </Label>
                  <Slider
                    value={reverb}
                    onValueChange={setReverb}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-white flex items-center justify-between">
                    Delay <span className="text-[#FFC107]">{delay[0]}%</span>
                  </Label>
                  <Slider
                    value={delay}
                    onValueChange={setDelay}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="musaix-card-border bg-black/50">
              <CardHeader>
                <CardTitle className="text-white">Dynamics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white flex items-center justify-between">
                    Distortion <span className="text-[#AB47BC]">{distortion[0]}%</span>
                  </Label>
                  <Slider
                    value={distortion}
                    onValueChange={setDistortion}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-white flex items-center justify-between">
                    Compression <span className="text-[#3F51B5]">{compression[0]}%</span>
                  </Label>
                  <Slider
                    value={compression}
                    onValueChange={setCompression}
                    max={100}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-6">
          <Card className="musaix-card-border bg-black/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Download className="h-5 w-5 text-[#FF4081]" />
                Project Export
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white font-medium mb-2 block">Project Name</Label>
                <Input
                  placeholder="Enter project name..."
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>

              <div>
                <Label className="text-white font-medium mb-2 block">Genre</Label>
                <Select value={beatGenre} onValueChange={setBeatGenre}>
                  <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {['trap', 'boom-bap', 'drill', 'phonk', 'lo-fi', 'experimental'].map((genre) => (
                      <SelectItem key={genre} value={genre} className="text-white">
                        {genre.charAt(0).toUpperCase() + genre.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button
                  onClick={exportBeat}
                  className="w-full musaix-gradient-button"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Beat Project
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </UnifiedPageLayout>
  );
}