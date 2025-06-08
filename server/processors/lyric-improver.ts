import Anthropic from '@anthropic-ai/sdk';

// the newest Anthropic model is "claude-sonnet-4-20250514" which was released May 14, 2025. Use this by default unless user has already selected claude-3-7-sonnet-20250219
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ImprovementRequest {
  lyrics: string;
  focusAreas: string[];
  currentScore?: {
    overall: number;
    linguistic: number;
    structural: number;
    semantic: number;
    creative: number;
  };
  improvementLevel: 'subtle' | 'moderate' | 'significant';
}

/**
 * Improve lyrics using AI-powered enhancement
 */
export async function improveLyrics(request: ImprovementRequest): Promise<string> {
  const { lyrics, focusAreas, currentScore, improvementLevel } = request;

  // Try Claude AI first, fallback to rule-based improvement
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      return await improveLyricsWithClaude(request);
    } catch (error) {
      console.log('Claude API unavailable, using fallback improvement method');
      return await improveLyricsWithFallback(request);
    }
  }

  return await improveLyricsWithFallback(request);
}

/**
 * Improve lyrics using Claude AI
 */
async function improveLyricsWithClaude(request: ImprovementRequest): Promise<string> {
  const { lyrics, focusAreas, currentScore, improvementLevel } = request;

  const focusDescription = focusAreas.map(area => {
    switch (area) {
      case 'linguistic': return 'vocabulary sophistication and word choice complexity';
      case 'structural': return 'rhyme schemes, rhythm patterns, and verse organization';
      case 'semantic': return 'metaphorical depth, thematic complexity, and layered meanings';
      case 'creative': return 'innovative wordplay, unique expressions, and artistic creativity';
      case 'balanced': return 'overall complexity across all dimensions';
      default: return area;
    }
  }).join(', ');

  const improvementIntensity = {
    subtle: 'subtle enhancements while preserving the original style and meaning',
    moderate: 'noticeable improvements with some creative restructuring',
    significant: 'substantial enhancements with creative freedom to reimagine sections'
  }[improvementLevel];

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: `You are an expert lyricist and hip-hop scholar specializing in lyrical enhancement. Your task is to improve rap/hip-hop lyrics while maintaining their core meaning and emotional impact.

Enhancement Guidelines:
1. Preserve the original message and emotional tone
2. Maintain natural flow and rhythm
3. Enhance complexity in the specified focus areas: ${focusDescription}
4. Apply ${improvementIntensity}
5. Keep the structure recognizable but allow for creative improvements

Focus Areas Explanation:
- Linguistic: Advanced vocabulary, sophisticated word choice, technical terminology
- Structural: Complex rhyme schemes (internal rhymes, slant rhymes), varied meter, innovative verse patterns
- Semantic: Deeper metaphors, layered meanings, abstract concepts, philosophical themes
- Creative: Unique wordplay, innovative techniques, artistic experimentation

Current complexity scores: ${currentScore ? `Linguistic: ${currentScore.linguistic}/100, Structural: ${currentScore.structural}/100, Semantic: ${currentScore.semantic}/100, Creative: ${currentScore.creative}/100` : 'Not provided'}

Provide only the enhanced lyrics without additional commentary.`,
    messages: [
      {
        role: 'user',
        content: `Please enhance these lyrics with focus on: ${focusDescription}

Original lyrics:
${lyrics}

Enhanced lyrics:`
      }
    ]
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response format from Claude');
  }

  return content.text.trim();
}

/**
 * Fallback improvement using rule-based methods
 */
async function improveLyricsWithFallback(request: ImprovementRequest): Promise<string> {
  const { lyrics, focusAreas, improvementLevel } = request;
  
  let improvedLyrics = lyrics;
  const lines = lyrics.split('\n');
  const words = lyrics.toLowerCase().split(/\s+/).filter(w => w.length > 0);

  // Apply improvements based on focus areas
  for (const focusArea of focusAreas) {
    switch (focusArea) {
      case 'linguistic':
        improvedLyrics = enhanceLinguisticComplexity(improvedLyrics, improvementLevel);
        break;
      case 'structural':
        improvedLyrics = enhanceStructuralComplexity(improvedLyrics, improvementLevel);
        break;
      case 'semantic':
        improvedLyrics = enhanceSemanticDepth(improvedLyrics, improvementLevel);
        break;
      case 'creative':
        improvedLyrics = enhanceCreativity(improvedLyrics, improvementLevel);
        break;
      case 'balanced':
        improvedLyrics = enhanceLinguisticComplexity(improvedLyrics, 'subtle');
        improvedLyrics = enhanceStructuralComplexity(improvedLyrics, 'subtle');
        improvedLyrics = enhanceSemanticDepth(improvedLyrics, 'subtle');
        improvedLyrics = enhanceCreativity(improvedLyrics, 'subtle');
        break;
    }
  }

  return improvedLyrics;
}

/**
 * Enhance linguistic complexity
 */
function enhanceLinguisticComplexity(lyrics: string, level: string): string {
  const substitutions: Record<string, string[]> = {
    'big': ['monumental', 'colossal', 'tremendous', 'massive'],
    'small': ['minuscule', 'microscopic', 'infinitesimal', 'diminutive'],
    'good': ['exceptional', 'phenomenal', 'extraordinary', 'magnificent'],
    'bad': ['deplorable', 'catastrophic', 'detrimental', 'abysmal'],
    'think': ['contemplate', 'ruminate', 'deliberate', 'philosophize'],
    'feel': ['experience', 'perceive', 'internalize', 'resonate'],
    'see': ['observe', 'witness', 'visualize', 'discern'],
    'know': ['comprehend', 'recognize', 'acknowledge', 'internalize'],
    'want': ['desire', 'aspire', 'yearn', 'crave'],
    'make': ['create', 'construct', 'fabricate', 'manifest'],
    'time': ['temporal', 'chronological', 'momentous', 'eternal'],
    'life': ['existence', 'consciousness', 'vitality', 'mortality'],
    'love': ['affection', 'adoration', 'devotion', 'passion'],
    'hate': ['detest', 'loathe', 'despise', 'abhor'],
    'money': ['currency', 'capital', 'prosperity', 'affluence'],
    'power': ['authority', 'dominance', 'influence', 'sovereignty'],
    'fast': ['rapid', 'accelerated', 'velocity', 'momentum'],
    'slow': ['gradual', 'deliberate', 'methodical', 'measured']
  };

  let enhanced = lyrics;
  
  // Apply substitutions based on improvement level
  const intensityMultiplier = { subtle: 0.3, moderate: 0.6, significant: 0.9 }[level] || 0.6;
  
  Object.entries(substitutions).forEach(([simple, complex]) => {
    const regex = new RegExp(`\\b${simple}\\b`, 'gi');
    const matches = enhanced.match(regex);
    
    if (matches && Math.random() < intensityMultiplier) {
      const replacement = complex[Math.floor(Math.random() * complex.length)];
      enhanced = enhanced.replace(regex, replacement);
    }
  });

  return enhanced;
}

/**
 * Enhance structural complexity
 */
function enhanceStructuralComplexity(lyrics: string, level: string): string {
  const lines = lyrics.split('\n');
  let enhanced = lyrics;

  if (level === 'moderate' || level === 'significant') {
    // Add internal rhymes to some lines
    for (let i = 0; i < lines.length; i++) {
      if (Math.random() < 0.4) {
        const words = lines[i].split(' ');
        if (words.length > 4) {
          // Try to add internal rhyme in the middle
          const midPoint = Math.floor(words.length / 2);
          if (words[midPoint] && words[words.length - 1]) {
            const endWord = words[words.length - 1].toLowerCase();
            const rhymeWords = findRhymingWords(endWord);
            if (rhymeWords.length > 0) {
              words[midPoint] = rhymeWords[Math.floor(Math.random() * rhymeWords.length)];
              lines[i] = words.join(' ');
            }
          }
        }
      }
    }
    enhanced = lines.join('\n');
  }

  return enhanced;
}

/**
 * Enhance semantic depth
 */
function enhanceSemanticDepth(lyrics: string, level: string): string {
  const metaphorPairs: Record<string, string> = {
    'mind': 'labyrinth of consciousness',
    'heart': 'emotional epicenter',
    'soul': 'ethereal essence',
    'dreams': 'nocturnal visions',
    'thoughts': 'mental fragments',
    'pain': 'existential anguish',
    'hope': 'illuminating beacon',
    'fear': 'paralyzing shadow',
    'journey': 'odyssey through existence',
    'battle': 'internal warfare',
    'struggle': 'perpetual conflict',
    'success': 'pinnacle of achievement',
    'failure': 'learning crucible'
  };

  let enhanced = lyrics;
  
  if (level === 'moderate' || level === 'significant') {
    Object.entries(metaphorPairs).forEach(([simple, metaphor]) => {
      const regex = new RegExp(`\\b${simple}\\b`, 'gi');
      if (Math.random() < 0.4) {
        enhanced = enhanced.replace(regex, metaphor);
      }
    });
  }

  return enhanced;
}

/**
 * Enhance creativity
 */
function enhanceCreativity(lyrics: string, level: string): string {
  let enhanced = lyrics;

  if (level === 'significant') {
    // Add creative punctuation and formatting
    enhanced = enhanced.replace(/\./g, Math.random() > 0.7 ? '...' : '.');
    enhanced = enhanced.replace(/!/g, Math.random() > 0.5 ? '!!' : '!');
    
    // Add occasional creative spacing
    const lines = enhanced.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (Math.random() < 0.2) {
        lines[i] = lines[i].replace(/\s+/g, '  '); // Double spacing for emphasis
      }
    }
    enhanced = lines.join('\n');
  }

  return enhanced;
}

/**
 * Find rhyming words (simplified)
 */
function findRhymingWords(word: string): string[] {
  const rhymeGroups: Record<string, string[]> = {
    'ay': ['way', 'day', 'say', 'play', 'stay', 'gray'],
    'ight': ['night', 'light', 'sight', 'fight', 'bright', 'right'],
    'ow': ['know', 'flow', 'show', 'grow', 'slow', 'glow'],
    'ime': ['time', 'rhyme', 'climb', 'prime', 'sublime', 'paradigm'],
    'ound': ['sound', 'ground', 'found', 'bound', 'profound', 'astound']
  };

  for (const [ending, words] of Object.entries(rhymeGroups)) {
    if (word.endsWith(ending)) {
      return words.filter(w => w !== word);
    }
  }

  return [];
}