// Style Transformer Service with OpenAI integration
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

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
 * Transform lyrics using OpenAI API
 */
export async function transformLyrics(
  originalLyrics: string,
  options: TransformationOptions
): Promise<string> {
  // Validate inputs
  if (!originalLyrics || !originalLyrics.trim()) {
    throw new Error("No lyrics provided");
  }
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }
  
  try {
    // Construct the system prompt with detailed instructions
    const systemPrompt = constructSystemPrompt(options);
    
    // Create the user prompt with the lyrics
    const userPrompt = `Here are the original lyrics to transform:\n\n${originalLyrics}`;
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7, // Adjust creativity level based on the task
      max_tokens: 2000, // Adjust based on expected length of lyrics
    });
    
    // Return the transformed lyrics
    return response.choices[0].message.content || "Error: No content received from API";
  } catch (error) {
    console.error("Error transforming lyrics with OpenAI:", error);
    throw error;
  }
}

/**
 * Construct system prompt based on transformation options
 */
function constructSystemPrompt(options: TransformationOptions): string {
  const { 
    targetStyle, 
    mood, 
    strength, 
    preserveStructure, 
    keepRhymes, 
    maintainThemes, 
    enhanceImagery,
    customInstructions 
  } = options;
  
  // Style-specific guidance
  const styleGuidance = getStyleGuidance(targetStyle);
  
  // Transformation strength instructions
  const strengthInstructions = getStrengthInstructions(strength);
  
  // Build the system prompt
  let prompt = `You are an expert songwriter and lyricist with deep knowledge of various musical styles and genres. 
Your task is to transform the provided lyrics into a ${targetStyle} style${mood ? ` with a ${mood} mood` : ''}.

STYLE GUIDELINES:
${styleGuidance}

TRANSFORMATION INTENSITY:
${strengthInstructions}

TRANSFORMATION RULES:`;

  // Add conditional rules based on options
  if (preserveStructure) {
    prompt += `
- Maintain the original song structure (verses, chorus, bridge, etc.). Do not add or remove sections.`;
  }
  
  if (keepRhymes) {
    prompt += `
- Preserve the original rhyme scheme and pattern as much as possible.`;
  }
  
  if (maintainThemes) {
    prompt += `
- Keep the core themes, messages, and emotional essence of the original lyrics.`;
  }
  
  if (enhanceImagery) {
    prompt += `
- Enhance the imagery and metaphors to match the target style while making the lyrics more vivid.`;
  }
  
  // Add custom instructions if provided
  if (customInstructions) {
    prompt += `

ADDITIONAL INSTRUCTIONS:
${customInstructions}`;
  }
  
  prompt += `

OUTPUT GUIDELINES:
- Return ONLY the transformed lyrics, formatted cleanly with appropriate line breaks.
- Maintain any section headers (like "VERSE" or "CHORUS") from the original if present.
- Do not include any explanations, notes, or commentary - just the transformed lyrics.`;

  return prompt;
}

/**
 * Get style-specific guidance based on the target style
 */
function getStyleGuidance(targetStyle: string): string {
  const styleGuidelines: Record<string, string> = {
    "rap-boom-bap": `
- Use complex internal rhyme schemes characteristic of 90s hip-hop
- Incorporate clever wordplay and metaphors
- Focus on storytelling and message-driven lyrics
- Include some cultural references from the golden era of hip-hop
- Maintain a steady, consistent flow that works with boom-bap beats`,
    
    "rap-trap": `
- Use triplet flows and staccato delivery patterns
- Add ad-libs in parentheses (like "yeah", "skrrt", etc.)
- Include trap-specific slang and terminology
- Write shorter lines with impactful delivery
- Focus on repetitive, catchy phrases for hooks`,
    
    "rap-melodic": `
- Incorporate singing elements and melodic hooks
- Focus on emotional themes and personal narratives
- Use more musical phrasing that could be sung
- Balance rap verses with melodic choruses
- Include more vulnerable, introspective content`,
    
    "pop-mainstream": `
- Create simple, memorable hooks and phrases
- Use direct, relatable language and universal themes
- Structure around a strong chorus that repeats
- Keep vocabulary accessible for wide audience appeal
- Incorporate upbeat, positive messaging when possible`,
    
    "pop-indie": `
- Use more poetic and metaphorical language
- Include quirky or unexpected imagery
- Focus on introspective themes with personal details
- Avoid overly commercial language
- Incorporate some unconventional structure elements`,
    
    "rock-classic": `
- Use powerful, anthemic language and imagery
- Include some extended metaphors or epic storytelling
- Focus on themes of freedom, rebellion, or deep emotion
- Write with rhythm suitable for guitar-driven music
- Structure around strong, repeatable choruses`,
    
    "rock-punk": `
- Use raw, direct language with attitude
- Keep lines short and impactful
- Focus on themes of rebellion, alienation, or social issues
- Include call-and-response sections when appropriate
- Use conversational, authentic language rather than poetic flourishes`,
    
    "rnb-modern": `
- Focus on smooth, sensual language and imagery
- Use subtle wordplay and double meanings
- Include more sophisticated emotional narratives
- Balance straightforward sections with more poetic ones
- Incorporate space for vocal runs and melisma`,
    
    "folk-acoustic": `
- Focus on detailed storytelling with vivid characters
- Use nature imagery and traditional metaphors
- Structure around narrative development
- Include some repeated refrains or motifs
- Use descriptive, evocative language`,
    
    "electronic-edm": `
- Create simple, repeatable phrases for high-energy sections
- Include buildup and drop moments in the lyrical structure
- Use euphoric, energetic language for chorus/hook sections
- Keep verses concise with forward momentum
- Focus on universal, emotionally resonant themes`
  };
  
  return styleGuidelines[targetStyle] || 
    "Transform the lyrics to match the specified style while maintaining the essential meaning and emotion.";
}

/**
 * Get instructions based on transformation strength
 */
function getStrengthInstructions(strength: number): string {
  if (strength <= 0.25) {
    return "Apply a SUBTLE transformation. Make minimal changes to adapt the lyrics to the target style, keeping most of the original wording intact. This should feel like the same song with a light stylistic touch.";
  } else if (strength <= 0.5) {
    return "Apply a MODERATE transformation. Balance between preserving original elements and introducing style-specific changes. The result should be recognizable as derived from the original but clearly styled differently.";
  } else if (strength <= 0.75) {
    return "Apply a STRONG transformation. Make significant changes to adapt the lyrics to the target style while keeping only the most essential elements of the original. The result should primarily reflect the target style.";
  } else {
    return "Apply a COMPLETE transformation. Reimagine the lyrics entirely in the target style, keeping only the core theme and emotional essence. Don't hesitate to replace most of the original wording and phrasing.";
  }
}