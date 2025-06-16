import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Terminal, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap,
  Target,
  Music,
  Brain,
  Wand2
} from "lucide-react";

interface ValidationRule {
  id: string;
  name: string;
  description: string;
  type: 'rhyme' | 'count' | 'structure' | 'complexity' | 'style';
  validator: (text: string) => { passed: boolean; details: string };
}

interface TaskInstruction {
  id: string;
  instruction: string;
  validationRules: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  category: string;
}

const VALIDATION_RULES: ValidationRule[] = [
  {
    id: "rhyme_presence",
    name: "Rhyme Scheme",
    description: "Must contain consistent rhyming patterns",
    type: "rhyme",
    validator: (text: string) => {
      const lines = text.split('\n').filter(line => line.trim());
      if (lines.length < 2) return { passed: false, details: "Need at least 2 lines to check rhymes" };
      
      const endWords = lines.map(line => {
        const words = line.trim().split(' ');
        return words[words.length - 1].toLowerCase().replace(/[.,!?]/g, '');
      });
      
      // Simple rhyme check - look for similar endings
      let rhymeCount = 0;
      for (let i = 0; i < endWords.length - 1; i++) {
        for (let j = i + 1; j < endWords.length; j++) {
          const word1 = endWords[i];
          const word2 = endWords[j];
          if (word1.length > 2 && word2.length > 2) {
            const ending1 = word1.slice(-2);
            const ending2 = word2.slice(-2);
            if (ending1 === ending2) rhymeCount++;
          }
        }
      }
      
      const rhymeRatio = rhymeCount / lines.length;
      return {
        passed: rhymeRatio > 0.3,
        details: `Found ${rhymeCount} rhymes in ${lines.length} lines (${Math.round(rhymeRatio * 100)}%)`
      };
    }
  },
  {
    id: "line_count",
    name: "Line Count",
    description: "Must have between 8-32 lines",
    type: "count",
    validator: (text: string) => {
      const lines = text.split('\n').filter(line => line.trim());
      const count = lines.length;
      return {
        passed: count >= 8 && count <= 32,
        details: `Has ${count} lines (target: 8-32)`
      };
    }
  },
  {
    id: "verse_structure",
    name: "Verse Structure",
    description: "Should have clear verse/chorus structure",
    type: "structure",
    validator: (text: string) => {
      const hasVerse = /\b(verse|v1|v2)\b/i.test(text);
      const hasChorus = /\b(chorus|hook|refrain)\b/i.test(text);
      const hasStructure = hasVerse || hasChorus;
      
      return {
        passed: hasStructure,
        details: hasStructure ? "Clear structure detected" : "No verse/chorus markers found"
      };
    }
  },
  {
    id: "complexity_score",
    name: "Complexity Level",
    description: "Must achieve minimum complexity score",
    type: "complexity",
    validator: (text: string) => {
      const wordCount = text.split(' ').length;
      const uniqueWords = new Set(text.toLowerCase().split(' ')).size;
      const avgWordLength = text.replace(/\s+/g, '').length / wordCount;
      
      const complexityScore = Math.min(10, 
        (uniqueWords / wordCount * 10) + 
        (avgWordLength - 3) + 
        (wordCount > 50 ? 2 : 0)
      );
      
      return {
        passed: complexityScore >= 5,
        details: `Complexity score: ${complexityScore.toFixed(1)}/10`
      };
    }
  },
  {
    id: "style_consistency",
    name: "Style Consistency",
    description: "Maintains consistent style throughout",
    type: "style",
    validator: (text: string) => {
      const lines = text.split('\n').filter(line => line.trim());
      const avgLineLength = lines.reduce((acc, line) => acc + line.length, 0) / lines.length;
      const lengthVariance = lines.reduce((acc, line) => acc + Math.abs(line.length - avgLineLength), 0) / lines.length;
      
      return {
        passed: lengthVariance < avgLineLength * 0.5,
        details: `Line length variance: ${Math.round(lengthVariance)} chars (avg: ${Math.round(avgLineLength)})`
      };
    }
  }
];

const SAMPLE_INSTRUCTIONS: TaskInstruction[] = [
  {
    id: "rap_verse_basic",
    instruction: "Write a 16-line rap verse about overcoming challenges with AABB rhyme scheme",
    validationRules: ["rhyme_presence", "line_count", "complexity_score"],
    priority: "high",
    estimatedTime: 300,
    category: "verse"
  },
  {
    id: "conscious_rap",
    instruction: "Create conscious rap lyrics addressing social issues with complex internal rhymes",
    validationRules: ["rhyme_presence", "complexity_score", "style_consistency"],
    priority: "high",
    estimatedTime: 600,
    category: "conscious"
  },
  {
    id: "melodic_hook",
    instruction: "Write a melodic hook with simple rhymes and emotional depth",
    validationRules: ["line_count", "style_consistency"],
    priority: "medium",
    estimatedTime: 240,
    category: "hook"
  },
  {
    id: "battle_rap",
    instruction: "Create aggressive battle rap bars with complex wordplay and punchlines",
    validationRules: ["rhyme_presence", "complexity_score", "line_count"],
    priority: "high",
    estimatedTime: 450,
    category: "battle"
  }
];

interface InstructionTaskRouterProps {
  onTaskSelect?: (instruction: TaskInstruction) => void;
  currentLyrics?: string;
}

export default function InstructionTaskRouter({ 
  onTaskSelect, 
  currentLyrics = "" 
}: InstructionTaskRouterProps) {
  const [customInstruction, setCustomInstruction] = useState("");
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [validationResults, setValidationResults] = useState<Record<string, { passed: boolean; details: string }>>({});

  const runValidation = (text: string) => {
    const results: Record<string, { passed: boolean; details: string }> = {};
    
    VALIDATION_RULES.forEach(rule => {
      results[rule.id] = rule.validator(text);
    });
    
    setValidationResults(results);
    return results;
  };

  const handleTaskSelect = (instruction: TaskInstruction) => {
    onTaskSelect?.(instruction);
  };

  const createCustomTask = () => {
    if (!customInstruction.trim()) return;
    
    const customTask: TaskInstruction = {
      id: `custom_${Date.now()}`,
      instruction: customInstruction,
      validationRules: selectedRules,
      priority: "medium",
      estimatedTime: selectedRules.length * 120,
      category: "custom"
    };
    
    handleTaskSelect(customTask);
  };

  const toggleRule = (ruleId: string) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    );
  };

  // Run validation on current lyrics if available
  const currentValidation = currentLyrics ? runValidation(currentLyrics) : {};
  const passedRules = Object.values(currentValidation).filter(result => result.passed).length;
  const totalRules = Object.keys(currentValidation).length;

  return (
    <div className="space-y-6">
      
      {/* Current Validation Status */}
      {currentLyrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Validation Results ({passedRules}/{totalRules})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {VALIDATION_RULES.map(rule => {
                const result = currentValidation[rule.id];
                if (!result) return null;
                
                return (
                  <div key={rule.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800">
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{rule.name}</p>
                      <p className="text-xs text-gray-400 truncate">{result.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preset Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            Preset Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {SAMPLE_INSTRUCTIONS.map(instruction => (
              <div 
                key={instruction.id}
                className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors border border-gray-700 hover:border-gray-500"
                onClick={() => handleTaskSelect(instruction)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">{instruction.instruction}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {instruction.category}
                      </Badge>
                      <Badge 
                        variant={instruction.priority === 'high' ? 'destructive' : 'secondary'} 
                        className="text-xs"
                      >
                        {instruction.priority}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {Math.round(instruction.estimatedTime / 60)}m
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {instruction.validationRules.map(ruleId => {
                    const rule = VALIDATION_RULES.find(r => r.id === ruleId);
                    return rule ? (
                      <Badge key={ruleId} variant="secondary" className="text-xs">
                        {rule.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Instruction Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Custom Instruction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Describe your lyric writing task..."
            value={customInstruction}
            onChange={(e) => setCustomInstruction(e.target.value)}
          />
          
          <div>
            <p className="text-sm font-medium mb-3">Validation Rules</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {VALIDATION_RULES.map(rule => (
                <div 
                  key={rule.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border-2 ${
                    selectedRules.includes(rule.id)
                      ? 'bg-blue-900/30 border-blue-500'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-500'
                  }`}
                  onClick={() => toggleRule(rule.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedRules.includes(rule.id) ? 'bg-blue-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium">{rule.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{rule.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={createCustomTask}
            disabled={!customInstruction.trim() || selectedRules.length === 0}
            className="w-full"
          >
            <Zap className="h-4 w-4 mr-2" />
            Create Custom Task
          </Button>
        </CardContent>
      </Card>

      {/* Validation Rules Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Validation Rules Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {VALIDATION_RULES.map(rule => (
              <div key={rule.id} className="p-3 rounded-lg bg-gray-800">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {rule.type}
                  </Badge>
                  <span className="text-sm font-medium">{rule.name}</span>
                </div>
                <p className="text-xs text-gray-400">{rule.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}