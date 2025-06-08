import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Persona } from '@/lib/types';
import { 
  TrendingUp, 
  BarChart3, 
  Clock, 
  Target, 
  Award, 
  Zap, 
  Brain,
  Calendar,
  PieChart,
  LineChart
} from 'lucide-react';

interface CreativeSession {
  id: string;
  timestamp: Date;
  energy: number;
  wordCount: number;
  persona?: Persona;
  duration: number; // in minutes
  peakEnergy: number;
  averageEnergy: number;
  creativityScore: number;
}

interface CreativeAnalyticsDashboardProps {
  currentLyrics?: string;
  currentPersona?: Persona | null;
  className?: string;
}

export default function CreativeAnalyticsDashboard({ 
  currentLyrics, 
  currentPersona,
  className 
}: CreativeAnalyticsDashboardProps) {
  const [sessions, setSessions] = useState<CreativeSession[]>([]);
  const [currentSession, setCurrentSession] = useState<CreativeSession | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Initialize or update current session
  useEffect(() => {
    if (currentLyrics && !sessionStartTime) {
      setSessionStartTime(new Date());
    }

    if (currentLyrics && sessionStartTime) {
      const words = currentLyrics.split(/\s+/).filter(w => w.length > 0);
      const duration = (Date.now() - sessionStartTime.getTime()) / (1000 * 60); // minutes
      
      // Calculate energy metrics
      const energy = calculateEnergyLevel(currentLyrics);
      const creativityScore = calculateCreativityScore(currentLyrics);
      
      const session: CreativeSession = {
        id: `session-${Date.now()}`,
        timestamp: sessionStartTime,
        energy,
        wordCount: words.length,
        persona: currentPersona || undefined,
        duration: Math.max(0.1, duration),
        peakEnergy: energy, // Will be updated over time
        averageEnergy: energy,
        creativityScore
      };
      
      setCurrentSession(session);
    }
  }, [currentLyrics, currentPersona, sessionStartTime]);

  // Calculate energy level based on lyrics
  const calculateEnergyLevel = (lyrics: string): number => {
    if (!lyrics) return 0;
    
    const words = lyrics.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const powerWords = ['fire', 'blazing', 'intense', 'wild', 'crazy', 'power', 'strong', 'fast'];
    const emotionalWords = ['love', 'hate', 'pain', 'joy', 'passion', 'heart', 'soul'];
    
    let score = 0;
    words.forEach(word => {
      if (powerWords.some(pw => word.includes(pw))) score += 15;
      if (emotionalWords.some(ew => word.includes(ew))) score += 10;
    });
    
    const exclamations = (lyrics.match(/!/g) || []).length;
    const caps = (lyrics.match(/[A-Z]{2,}/g) || []).length;
    
    score += exclamations * 20 + caps * 15;
    
    return Math.min(100, score / Math.max(words.length / 10, 1));
  };

  // Calculate creativity score
  const calculateCreativityScore = (lyrics: string): number => {
    if (!lyrics) return 0;
    
    const words = lyrics.split(/\s+/).filter(w => w.length > 0);
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const lines = lyrics.split('\n').filter(l => l.trim().length > 0);
    
    const diversity = uniqueWords.size / Math.max(words.length, 1);
    const complexity = Math.min(1, lines.length / 20);
    const structure = lines.length > 4 ? 0.8 : lines.length / 5;
    
    return Math.round((diversity * 40 + complexity * 30 + structure * 30));
  };

  // Save current session
  const saveCurrentSession = () => {
    if (currentSession) {
      setSessions(prev => [...prev.slice(-9), currentSession]);
      setCurrentSession(null);
      setSessionStartTime(null);
    }
  };

  // Analytics calculations
  const analytics = React.useMemo(() => {
    if (sessions.length === 0) return {
      totalSessions: 0,
      totalWords: 0,
      totalTime: 0,
      averageEnergy: 0,
      averageCreativity: 0,
      bestSession: null,
      productiveTime: 'No data',
      favoritePersona: 'None'
    };

    const totalSessions = sessions.length;
    const totalWords = sessions.reduce((sum, s) => sum + s.wordCount, 0);
    const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
    const averageEnergy = sessions.reduce((sum, s) => sum + s.energy, 0) / sessions.length;
    const averageCreativity = sessions.reduce((sum, s) => sum + s.creativityScore, 0) / sessions.length;
    
    const bestSession = sessions.reduce((best, current) => 
      current.creativityScore > (best?.creativityScore || 0) ? current : best, 
      null as CreativeSession | null
    );

    // Find most productive hour
    const hourCounts = Array(24).fill(0);
    sessions.forEach(session => {
      const hour = session.timestamp.getHours();
      hourCounts[hour] += session.wordCount;
    });
    const mostProductiveHour = hourCounts.indexOf(Math.max(...hourCounts));
    const productiveTime = mostProductiveHour === -1 ? 'No data' : 
      `${mostProductiveHour}:00 - ${mostProductiveHour + 1}:00`;

    // Find favorite persona
    const personaCounts: Record<string, number> = {};
    sessions.forEach(session => {
      if (session.persona) {
        personaCounts[session.persona.name] = (personaCounts[session.persona.name] || 0) + 1;
      }
    });
    const favoritePersona = Object.keys(personaCounts).length > 0 ? 
      Object.entries(personaCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0] : 'None';

    return {
      totalSessions,
      totalWords,
      totalTime,
      averageEnergy: Math.round(averageEnergy),
      averageCreativity: Math.round(averageCreativity),
      bestSession,
      productiveTime,
      favoritePersona
    };
  }, [sessions]);

  const getEnergyColor = (energy: number) => {
    if (energy < 25) return 'text-[#3F51B5]';
    if (energy < 50) return 'text-[#AB47BC]';
    if (energy < 75) return 'text-[#FF4081]';
    return 'text-[#FFC107]';
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card className="musaix-card-border bg-black/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Brain className="h-5 w-5 text-[#FF4081]" />
            Creative Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="session">Current Session</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FF4081]">{analytics.totalSessions}</div>
                  <div className="text-xs text-gray-400">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#AB47BC]">{analytics.totalWords}</div>
                  <div className="text-xs text-gray-400">Words Written</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FFC107]">{Math.round(analytics.totalTime)}</div>
                  <div className="text-xs text-gray-400">Minutes</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getEnergyColor(analytics.averageEnergy)}`}>
                    {analytics.averageEnergy}%
                  </div>
                  <div className="text-xs text-gray-400">Avg Energy</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-[#FF4081]" />
                      Performance Metrics
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Creativity Score</span>
                          <span className="text-[#AB47BC]">{analytics.averageCreativity}%</span>
                        </div>
                        <Progress value={analytics.averageCreativity} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Energy Level</span>
                          <span className={getEnergyColor(analytics.averageEnergy)}>{analytics.averageEnergy}%</span>
                        </div>
                        <Progress value={analytics.averageEnergy} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-[#FFC107]" />
                      Insights
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Most Productive:</span>
                        <span className="text-white">{analytics.productiveTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Favorite Persona:</span>
                        <span className="text-white">{analytics.favoritePersona}</span>
                      </div>
                      {analytics.bestSession && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Best Session:</span>
                          <span className="text-[#FF4081]">{analytics.bestSession.creativityScore}% creativity</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Current Session Tab */}
            <TabsContent value="session" className="space-y-4">
              {currentSession ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#FF4081]">{Math.round(currentSession.duration)}</div>
                      <div className="text-xs text-gray-400">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#AB47BC]">{currentSession.wordCount}</div>
                      <div className="text-xs text-gray-400">Words</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-bold ${getEnergyColor(currentSession.energy)}`}>
                        {Math.round(currentSession.energy)}%
                      </div>
                      <div className="text-xs text-gray-400">Energy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[#FFC107]">{currentSession.creativityScore}%</div>
                      <div className="text-xs text-gray-400">Creativity</div>
                    </div>
                  </div>

                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-white font-medium">Session Progress</h4>
                        <Button 
                          size="sm" 
                          onClick={saveCurrentSession}
                          className="musaix-gradient-button"
                        >
                          Save Session
                        </Button>
                      </div>
                      
                      {currentSession.persona && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-gray-400 text-sm">Current Persona:</span>
                          <Badge className="bg-gradient-to-r from-[#FF4081] to-[#AB47BC] text-white">
                            {currentSession.persona.icon} {currentSession.persona.name}
                          </Badge>
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Writing Pace</span>
                          <span className="text-white">
                            {Math.round(currentSession.wordCount / Math.max(currentSession.duration, 0.1))} words/min
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Session Started</span>
                          <span className="text-white">
                            {sessionStartTime?.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">Start writing to begin tracking your session</p>
                </div>
              )}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              {sessions.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {sessions.slice(-10).reverse().map((session, index) => (
                    <Card key={session.id} className="bg-gray-800/50 border-gray-700">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-medium text-sm">
                                Session #{sessions.length - index}
                              </span>
                              {session.persona && (
                                <Badge variant="outline" className="text-xs">
                                  {session.persona.icon} {session.persona.name}
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-4 gap-2 text-xs">
                              <div>
                                <span className="text-gray-400">Words:</span>
                                <span className="text-white ml-1">{session.wordCount}</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Time:</span>
                                <span className="text-white ml-1">{Math.round(session.duration)}m</span>
                              </div>
                              <div>
                                <span className="text-gray-400">Energy:</span>
                                <span className={`ml-1 ${getEnergyColor(session.energy)}`}>
                                  {Math.round(session.energy)}%
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-400">Creativity:</span>
                                <span className="text-[#FFC107] ml-1">{session.creativityScore}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {session.timestamp.toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No sessions recorded yet</p>
                  <p className="text-gray-500 text-sm">Start writing to build your creative history</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}