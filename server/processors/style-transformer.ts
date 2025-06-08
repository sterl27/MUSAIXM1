// Style Transformer Service with built-in transformations

// Interface for transformation options
interface TransformationOptions {
  targetStyle: string;
  mood?: string;
  strength: number;
  preserveStructure: boolean;
  keepRhymes: boolean;
  maintainThemes: boolean;
  enhanceImagery: boolean;
  customInstructions?: string;
}

/**
 * Transform lyrics using built-in style transformation
 */
export async function transformLyrics(
  originalLyrics: string,
  options: TransformationOptions
): Promise<string> {
  // Validate inputs
  if (!originalLyrics || !originalLyrics.trim()) {
    throw new Error("No lyrics provided");
  }
  
  try {
    // Split lyrics into lines for processing
    const lines = originalLyrics.split('\n').filter(line => line.trim());
    
    // Transform each line based on the target style
    const transformedLines = lines.map(line => {
      let transformedLine = line;
      
      // Apply style-specific transformations
      transformedLine = applyStyleTransformation(transformedLine, options.targetStyle, options.strength);
      
      // Apply mood transformations if specified
      if (options.mood) {
        transformedLine = applyMoodTransformation(transformedLine, options.mood);
      }
      
      // Enhance imagery if requested
      if (options.enhanceImagery) {
        transformedLine = enhanceImagery(transformedLine);
      }
      
      return transformedLine;
    });
    
    return transformedLines.join('\n');
  } catch (error) {
    console.error("Error transforming lyrics:", error);
    throw error;
  }
}

/**
 * Apply style-specific transformations to a line of lyrics
 */
function applyStyleTransformation(line: string, targetStyle: string, strength: number): string {
  const intensityFactor = strength / 10; // Convert to 0-1 scale
  
  switch (targetStyle.toLowerCase()) {
    case 'trap':
      return applyTrapStyle(line, intensityFactor);
    case 'boom bap':
      return applyBoomBapStyle(line, intensityFactor);
    case 'melodic':
      return applyMelodicStyle(line, intensityFactor);
    case 'conscious':
      return applyConsciousStyle(line, intensityFactor);
    case 'drill':
      return applyDrillStyle(line, intensityFactor);
    case 'old school':
      return applyOldSchoolStyle(line, intensityFactor);
    default:
      return line;
  }
}

/**
 * Apply trap style transformations
 */
function applyTrapStyle(line: string, intensity: number): string {
  if (intensity < 0.3) return line;
  
  return line.replace(/\b(yeah|yes)\b/gi, 'yeah yeah')
           .replace(/\b(money|cash)\b/gi, 'bands')
           .replace(/\b(car|vehicle)\b/gi, 'whip')
           .replace(/\b(jewelry|chains)\b/gi, 'ice');
}

/**
 * Apply boom bap style transformations
 */
function applyBoomBapStyle(line: string, intensity: number): string {
  if (intensity < 0.3) return line;
  
  return line.replace(/\b(microphone|mic)\b/gi, 'microphone check')
           .replace(/\b(skills|talent)\b/gi, 'lyrical prowess')
           .replace(/\b(beats|rhythm)\b/gi, 'boom bap beats');
}

/**
 * Apply melodic style transformations
 */
function applyMelodicStyle(line: string, intensity: number): string {
  if (intensity < 0.3) return line;
  
  return line.replace(/\b(sing|singing)\b/gi, 'harmonize')
           .replace(/\b(love|heart)\b/gi, 'soul')
           .replace(/\b(pain|hurt)\b/gi, 'wounded heart');
}

/**
 * Apply conscious style transformations
 */
function applyConsciousStyle(line: string, intensity: number): string {
  if (intensity < 0.3) return line;
  
  return line.replace(/\b(think|thought)\b/gi, 'contemplate')
           .replace(/\b(world|society)\b/gi, 'social fabric')
           .replace(/\b(change|transform)\b/gi, 'revolution');
}

/**
 * Apply drill style transformations
 */
function applyDrillStyle(line: string, intensity: number): string {
  if (intensity < 0.3) return line;
  
  return line.replace(/\b(street|block)\b/gi, 'the block')
           .replace(/\b(real|truth)\b/gi, 'facts')
           .replace(/\b(work|hustle)\b/gi, 'grind');
}

/**
 * Apply old school style transformations
 */
function applyOldSchoolStyle(line: string, intensity: number): string {
  if (intensity < 0.3) return line;
  
  return line.replace(/\b(party|celebration)\b/gi, 'block party')
           .replace(/\b(dance|move)\b/gi, 'break dance')
           .replace(/\b(fresh|cool)\b/gi, 'def');
}

/**
 * Apply mood transformations to a line
 */
function applyMoodTransformation(line: string, mood: string): string {
  switch (mood.toLowerCase()) {
    case 'aggressive':
      return line.replace(/\b(said|told)\b/g, 'screamed')
               .replace(/\b(go|move)\b/g, 'charge')
               .replace(/\b(want|need)\b/g, 'demand');
    case 'melancholic':
      return line.replace(/\b(happy|glad)\b/g, 'empty')
               .replace(/\b(bright|light)\b/g, 'dark')
               .replace(/\b(smile|laugh)\b/g, 'cry');
    case 'confident':
      return line.replace(/\b(maybe|might)\b/g, 'will')
               .replace(/\b(try|attempt)\b/g, 'dominate')
               .replace(/\b(hope|wish)\b/g, 'know');
    case 'introspective':
      return line.replace(/\b(they|everyone)\b/g, 'I')
               .replace(/\b(out there|outside)\b/g, 'within')
               .replace(/\b(see|look)\b/g, 'reflect');
    default:
      return line;
  }
}

/**
 * Enhance imagery in a line of lyrics
 */
function enhanceImagery(line: string): string {
  // Add metaphorical elements and vivid descriptions
  return line.replace(/\b(money|cash)\b/g, 'paper stacks flowing like rivers')
           .replace(/\b(car|ride)\b/g, 'steel beast')
           .replace(/\b(house|home)\b/g, 'fortress of dreams')
           .replace(/\b(street|road)\b/g, 'concrete arteries')
           .replace(/\b(night|evening)\b/g, 'velvet darkness')
           .replace(/\b(city|town)\b/g, 'urban jungle')
           .replace(/\b(sky|heaven)\b/g, 'infinite canvas');
}