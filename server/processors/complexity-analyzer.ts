import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ComplexityScore {
  overall: number;
  linguistic: number;
  structural: number;
  semantic: number;
  creative: number;
  grade: string;
  insights: string[];
  suggestions: string[];
}

/**
 * Analyze lyric complexity using Claude AI
 */
export async function analyzeLyricComplexity(lyrics: string): Promise<ComplexityScore> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: `You are an expert literary analyst and hip-hop scholar specializing in lyrical complexity assessment. Your task is to analyze rap/hip-hop lyrics across multiple dimensions and provide detailed scoring.

Analyze the following dimensions:

1. LINGUISTIC COMPLEXITY (0-100):
   - Vocabulary sophistication and diversity
   - Advanced word choice and diction
   - Multi-syllabic words and technical terms
   - Language innovation and neologisms

2. STRUCTURAL COMPLEXITY (0-100):
   - Rhyme scheme sophistication (internal rhymes, multi-rhymes, slant rhymes)
   - Meter and rhythm variations
   - Verse structure and organization
   - Flow patterns and cadence complexity

3. SEMANTIC DEPTH (0-100):
   - Metaphorical and figurative language depth
   - Thematic complexity and layered meanings
   - Abstract concepts and philosophical content
   - Symbolic and allegorical elements

4. CREATIVE INNOVATION (0-100):
   - Unique expressions and original phrases
   - Innovative wordplay and techniques
   - Artistic creativity and stylistic innovation
   - Breaking conventional patterns

Provide your analysis in JSON format with the following structure:
{
  "linguistic": number (0-100),
  "structural": number (0-100), 
  "semantic": number (0-100),
  "creative": number (0-100),
  "overall": number (0-100, weighted average),
  "grade": string (S, A+, A, A-, B+, B, B-, C+, C, C-, D, F),
  "insights": [array of 3-5 specific strengths identified],
  "suggestions": [array of 3-5 specific improvement recommendations]
}

Grade scale:
- S (95-100): Exceptional, masterpiece level
- A+ (90-94): Outstanding complexity
- A (85-89): Excellent complexity
- A- (80-84): Very good complexity
- B+ (75-79): Good complexity
- B (70-74): Above average complexity
- B- (65-69): Average complexity
- C+ (60-64): Below average complexity
- C (55-59): Basic complexity
- C- (50-54): Simple structure
- D (40-49): Elementary level
- F (0-39): Very basic or flawed

Be specific and constructive in your insights and suggestions.`,
      messages: [
        {
          role: 'user',
          content: `Please analyze the complexity of these lyrics:

${lyrics}

Provide a detailed complexity analysis in the specified JSON format.`
        }
      ]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude');
    }

    // Extract JSON from the response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not find JSON in Claude response');
    }

    const analysisResult = JSON.parse(jsonMatch[0]);
    
    // Validate and sanitize the response
    const score: ComplexityScore = {
      linguistic: Math.max(0, Math.min(100, Math.round(analysisResult.linguistic || 0))),
      structural: Math.max(0, Math.min(100, Math.round(analysisResult.structural || 0))),
      semantic: Math.max(0, Math.min(100, Math.round(analysisResult.semantic || 0))),
      creative: Math.max(0, Math.min(100, Math.round(analysisResult.creative || 0))),
      overall: Math.max(0, Math.min(100, Math.round(analysisResult.overall || 0))),
      grade: analysisResult.grade || 'C',
      insights: Array.isArray(analysisResult.insights) ? analysisResult.insights.slice(0, 5) : [],
      suggestions: Array.isArray(analysisResult.suggestions) ? analysisResult.suggestions.slice(0, 5) : []
    };

    // Calculate overall score if not provided or seems incorrect
    if (!analysisResult.overall || Math.abs(analysisResult.overall - ((score.linguistic + score.structural + score.semantic + score.creative) / 4)) > 10) {
      score.overall = Math.round((score.linguistic + score.structural + score.semantic + score.creative) / 4);
    }

    // Assign grade based on overall score if not provided or inconsistent
    if (!analysisResult.grade || !isValidGrade(analysisResult.grade, score.overall)) {
      score.grade = calculateGrade(score.overall);
    }

    return score;

  } catch (error) {
    console.error('Error analyzing lyric complexity with Claude:', error);
    
    // Fallback to basic analysis if Claude fails
    return await fallbackComplexityAnalysis(lyrics);
  }
}

/**
 * Fallback complexity analysis using rule-based methods
 */
async function fallbackComplexityAnalysis(lyrics: string): Promise<ComplexityScore> {
  const words = lyrics.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const lines = lyrics.split('\n').filter(line => line.trim().length > 0);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  
  // Basic linguistic analysis
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
  const vocabularyDiversity = uniqueWords.size / words.length;
  const complexWords = words.filter(word => word.length > 6).length;
  const linguistic = Math.min(100, Math.round(
    (avgWordLength * 10) + 
    (vocabularyDiversity * 50) + 
    (complexWords / words.length * 40)
  ));

  // Basic structural analysis
  const rhymeCount = countApproximateRhymes(lines);
  const punctuationVariety = countPunctuationVariety(lyrics);
  const structural = Math.min(100, Math.round(
    (rhymeCount * 15) + 
    (lines.length * 5) + 
    (punctuationVariety * 10)
  ));

  // Basic semantic analysis
  const metaphorWords = ['like', 'as', 'metaphor', 'symbol', 'represent'];
  const abstractWords = ['love', 'hate', 'time', 'life', 'death', 'soul', 'mind', 'heart'];
  const metaphorCount = words.filter(word => metaphorWords.some(m => word.includes(m))).length;
  const abstractCount = words.filter(word => abstractWords.some(a => word.includes(a))).length;
  const semantic = Math.min(100, Math.round(
    (metaphorCount / words.length * 100) + 
    (abstractCount / words.length * 60) + 
    (lines.length * 3)
  ));

  // Basic creative analysis
  const allCaps = (lyrics.match(/[A-Z]{2,}/g) || []).length;
  const exclamations = (lyrics.match(/!/g) || []).length;
  const questions = (lyrics.match(/\?/g) || []).length;
  const creative = Math.min(100, Math.round(
    (vocabularyDiversity * 40) + 
    (allCaps * 5) + 
    (exclamations * 3) + 
    (questions * 2) + 
    (uniqueWords.size / 10)
  ));

  const overall = Math.round((linguistic + structural + semantic + creative) / 4);
  const grade = calculateGrade(overall);

  return {
    linguistic,
    structural,
    semantic,
    creative,
    overall,
    grade,
    insights: [
      "Analysis completed using fallback method",
      `Vocabulary diversity: ${Math.round(vocabularyDiversity * 100)}%`,
      `Average word length: ${avgWordLength.toFixed(1)} characters`,
      lines.length > 8 ? "Good verse structure length" : "Consider expanding verse length"
    ],
    suggestions: [
      "Try using more advanced vocabulary",
      "Experiment with complex rhyme schemes",
      "Add metaphorical depth to your lyrics",
      "Include more abstract concepts",
      "Vary your sentence structure"
    ]
  };
}

/**
 * Helper function to count approximate rhymes
 */
function countApproximateRhymes(lines: string[]): number {
  if (lines.length < 2) return 0;
  
  let rhymeCount = 0;
  for (let i = 0; i < lines.length - 1; i++) {
    const line1End = lines[i].trim().split(/\s+/).pop()?.toLowerCase() || '';
    const line2End = lines[i + 1].trim().split(/\s+/).pop()?.toLowerCase() || '';
    
    if (line1End.length > 1 && line2End.length > 1) {
      const suffix1 = line1End.slice(-2);
      const suffix2 = line2End.slice(-2);
      if (suffix1 === suffix2) {
        rhymeCount++;
      }
    }
  }
  
  return rhymeCount;
}

/**
 * Helper function to count punctuation variety
 */
function countPunctuationVariety(text: string): number {
  const punctuation = ['.', '!', '?', ',', ';', ':', '-', '(', ')', '"', "'"];
  return punctuation.filter(p => text.includes(p)).length;
}

/**
 * Calculate grade based on overall score
 */
function calculateGrade(score: number): string {
  if (score >= 95) return 'S';
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'A-';
  if (score >= 75) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 65) return 'B-';
  if (score >= 60) return 'C+';
  if (score >= 55) return 'C';
  if (score >= 50) return 'C-';
  if (score >= 40) return 'D';
  return 'F';
}

/**
 * Validate if grade matches score
 */
function isValidGrade(grade: string, score: number): boolean {
  const expectedGrade = calculateGrade(score);
  return grade === expectedGrade;
}