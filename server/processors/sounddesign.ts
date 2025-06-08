import { log } from "../vite";

/**
 * Generate sound design suggestions based on description and parameters
 */
export async function generateSoundDesignSuggestion(
  description: string,
  effects: string[],
  instruments: string[]
): Promise<string> {
  try {
    // If we have OpenAI API key, use it for generating suggestions
    if (process.env.OPENAI_API_KEY) {
      log("Using OpenAI to generate sound design suggestions");
      return await generateWithOpenAI(description, effects, instruments);
    } else {
      // Otherwise use our built-in generator
      log("Using built-in sound design suggestion generator");
      return generateWithBuiltIn(description, effects, instruments);
    }
  } catch (error) {
    log(`Error generating sound design suggestions: ${error}`);
    // Fall back to built-in method if OpenAI fails
    return generateWithBuiltIn(description, effects, instruments);
  }
}

/**
 * Generate sound design suggestions using OpenAI
 */
async function generateWithOpenAI(
  description: string,
  effects: string[],
  instruments: string[]
): Promise<string> {
  // Create prompt for OpenAI
  const effectsText = effects.length > 0 
    ? `Use these audio effects in your suggestions: ${effects.join(", ")}.` 
    : "Suggest appropriate audio effects for this sound.";
    
  const instrumentsText = instruments.length > 0 
    ? `Incorporate these instruments/sounds: ${instruments.join(", ")}.` 
    : "Suggest appropriate instruments or sound sources.";

  const prompt = `
    I need detailed sound design suggestions for this sound description:
    "${description}"
    
    ${effectsText}
    ${instrumentsText}
    
    Please provide a comprehensive breakdown including:
    1. Main sound sources and how to design/layer them
    2. Processing chain with specific plugin settings
    3. Modulation and automation suggestions
    4. Mixing considerations
    5. Any additional production techniques that would enhance this sound
    
    Be specific about parameter values (e.g., attack: 20ms, release: 250ms) and techniques.
  `.trim();

  try {
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert sound designer with deep knowledge of synthesis, audio effects, and music production techniques."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      log(`OpenAI API error: ${JSON.stringify(error)}`);
      throw new Error(`OpenAI API error: ${error.error?.message || "Unknown error"}`);
    }
    
    const data = await response.json();
    const suggestion = data.choices[0]?.message?.content?.trim();
    
    if (!suggestion) {
      throw new Error("No suggestions were generated");
    }
    
    return suggestion;
  } catch (error) {
    log(`Error calling OpenAI for sound design: ${error}`);
    throw error;
  }
}

/**
 * Generate sound design suggestions using built-in templates
 */
function generateWithBuiltIn(
  description: string,
  effects: string[],
  instruments: string[]
): string {
  // Analyze description for keywords
  const lowerDesc = description.toLowerCase();
  
  // Sound categories
  const isBass = /bass|low|deep|808|sub|rumble|bottom/.test(lowerDesc);
  const isPad = /pad|ambient|atmosphere|ethereal|dreamy|lush|background/.test(lowerDesc);
  const isLead = /lead|melody|solo|bright|cutting|foreground/.test(lowerDesc);
  const isPercussion = /drum|percussion|rhythm|beat|kick|snare|hit|impact/.test(lowerDesc);
  const isAtmosphere = /texture|landscape|environment|field|recording|ambient|atmosphere/.test(lowerDesc);
  
  // Characteristics
  const isWarm = /warm|analog|vintage|rich|thick/.test(lowerDesc);
  const isBright = /bright|crisp|clear|sharp|cutting|high/.test(lowerDesc);
  const isDark = /dark|moody|ominous|sinister|shadowy/.test(lowerDesc);
  const isDistorted = /distorted|gritty|fuzzy|crunchy|broken|glitch/.test(lowerDesc);
  const isMoving = /moving|evolving|dynamic|changing|morphing/.test(lowerDesc);
  
  // Generate suggestions based on analysis
  let output = `# Sound Design Suggestions for: "${description}"\n\n`;
  
  // Add sound sources section
  output += "## Sound Sources\n\n";
  
  if (instruments.length > 0) {
    output += "Using your selected instruments:\n";
    instruments.forEach(instrument => {
      output += `- ${instrument}: ${getSoundSourceSuggestion(instrument)}\n`;
    });
  } else {
    output += "Recommended sound sources:\n";
    
    if (isBass) {
      output += "- Sine wave or triangle wave oscillator as the foundation\n";
      output += "- Layer with subtle square wave one octave up for harmonics\n";
      output += "- Add subtle noise for texture and presence\n";
      
      if (isDistorted) {
        output += "- Use distortion or saturation to add harmonics\n";
      }
    } else if (isPad) {
      output += "- Multiple detuned sawtooth or triangle oscillators\n";
      output += "- Slow attack (500ms - 2s) and release (1-4s)\n";
      output += "- Use multiple voices with slight detuning (+/- 5-10 cents)\n";
      output += "- Layer with subtle noise or field recordings for texture\n";
    } else if (isLead) {
      output += "- Primary sawtooth or square wave oscillator\n";
      output += "- Secondary oscillator tuned an octave or fifth above\n";
      output += "- Fast attack (1-5ms) and medium release (150-300ms)\n";
      
      if (isDistorted) {
        output += "- Add distortion or bit crushing for edge\n";
      }
    } else if (isPercussion) {
      output += "- Start with noise generator for high elements (hi-hats, shakers)\n";
      output += "- Use sine wave with pitch envelope for kick drums\n";
      output += "- Layer noise and tonal elements for snares\n";
      output += "- Short decay times (50-200ms) for tight percussion\n";
    } else if (isAtmosphere) {
      output += "- Field recordings as the foundation\n";
      output += "- Granular synthesis to stretch and transform the recordings\n";
      output += "- Multiple layers of ambient textures\n";
      output += "- Very slow evolving modulation\n";
    } else {
      // Default recommendations
      output += "- Consider layering multiple sound sources for richness\n";
      output += "- Combine synthetic and organic elements\n";
      output += "- Use different synthesis types: subtractive, FM, wavetable\n";
      output += "- Record and process real-world sounds\n";
    }
  }
  
  // Add effects chain section
  output += "\n## Effects Chain\n\n";
  
  if (effects.length > 0) {
    output += "Processing with your selected effects:\n";
    effects.forEach(effect => {
      output += `- ${effect}: ${getEffectSuggestion(effect)}\n`;
    });
  } else {
    output += "Recommended effects processing:\n";
    
    if (isBass) {
      output += "- EQ: Boost around 80-100Hz, cut at 200-300Hz to reduce mud\n";
      output += "- Compression: 4:1 ratio, slow attack (30ms), medium release (150ms)\n";
      output += "- Subtle saturation to add harmonics and help with small speakers\n";
    } else if (isPad) {
      output += "- Reverb: Large hall or plate, 3-5s decay, 15-20% wet/dry\n";
      output += "- Chorus: Subtle amount (10-20%), slow rate (0.5-1Hz)\n";
      output += "- Filter: Sweep low-pass filter slowly over time\n";
    } else if (isLead) {
      output += "- EQ: Boost presence (2-5kHz), cut unnecessary low end below 200Hz\n";
      output += "- Delay: 1/8 or 1/4 note synced, 20-30% feedback, 25% wet\n";
      output += "- Compression: Fast attack (5ms), medium release (100ms), 3:1 ratio\n";
    } else if (isPercussion) {
      output += "- Transient shaper to accentuate attack portion\n";
      output += "- Room reverb with short decay (0.5-1s)\n";
      output += "- Compression: Fast attack (1-5ms), short release (50-100ms), high ratio (6:1)\n";
    } else if (isAtmosphere) {
      output += "- Multiple reverbs in series, varying from room to large hall\n";
      output += "- Delays with high feedback (50-70%)\n";
      output += "- Subtle flanging or phasing modulation\n";
    } else {
      // Default effects
      output += "- EQ: Shape the frequency response to fit your mix\n";
      output += "- Compression: Control dynamics and add character\n";
      output += "- Spatial effects: Reverb and delay for depth\n";
      output += "- Modulation: Add movement with chorus, phaser, or flanger\n";
    }
  }
  
  // Add modulation section
  output += "\n## Modulation & Automation\n\n";
  
  if (isMoving) {
    output += "- LFO modulating filter cutoff (rate: 0.1-0.5Hz for slow movement)\n";
    output += "- Automate reverb size and mix over time\n";
    output += "- Use envelope followers to make effects respond to input dynamics\n";
    output += "- Gradually change distortion/saturation amount through the progression\n";
  } else {
    output += "- Subtle LFO on pitch (1-3 cents) for natural vibrato\n";
    output += "- Automate EQ to emphasize different frequencies at key moments\n";
    output += "- Consider volume automation for evolving presence\n";
  }
  
  // Add mixing section
  output += "\n## Mixing Considerations\n\n";
  
  if (isBass) {
    output += "- Keep bass centered in the stereo field\n";
    output += "- Use multiband compression to control low end\n";
    output += "- Consider parallel processing to maintain clear lows while adding character\n";
  } else if (isPad) {
    output += "- Pan different layers slightly left and right for width\n";
    output += "- Use mid/side processing to enhance stereo content\n";
    output += "- Keep levels consistent with automation or compression\n";
  } else if (isLead) {
    output += "- Ensure it cuts through the mix with presence EQ (2-5kHz)\n";
    output += "- Use automation to highlight important phrases\n";
    output += "- Consider double-tracking or chorus for width\n";
  } else if (isPercussion) {
    output += "- Balance transient vs. body depending on the mix context\n";
    output += "- Consider bus processing for cohesive percussion groups\n";
    output += "- Use panning for creating rhythm interest\n";
  } else if (isAtmosphere) {
    output += "- Use wide stereo processing or mid/side techniques\n";
    output += "- Keep levels subtle to act as supporting elements\n";
    output += "- Consider sidechaining to make room for foreground elements\n";
  } else {
    output += "- Balance the stereo field appropriately\n";
    output += "- Control dynamics with compression\n";
    output += "- Consider frequency masking with other elements\n";
  }
  
  return output;
}

/**
 * Get suggestion for specific sound source/instrument
 */
function getSoundSourceSuggestion(instrument: string): string {
  const suggestions: {[key: string]: string} = {
    'synth': "Use multiple oscillators with different waveforms (saw, square, sine) with slight detuning",
    'piano': "Layer with soft pad or strings for richness, adjust velocity sensitivity",
    'guitar': "Consider convolution with amp impulse responses, add subtle overdrive",
    'bass': "Ensure fundamental frequency is clear, add subtle harmonics with saturation",
    'strings': "Layer multiple instances with slightly different articulations for realism",
    'brass': "Pay attention to attack characteristics, layer with subtle noise for breaths",
    'drums': "Layer samples with different characteristics, process kick and snare separately",
    'pads': "Use multiple detuned oscillators with slow attack and release, add movement with LFOs"
  };
  
  // Extract the instrument name from more complex strings
  const baseName = instrument.split(' ')[0].toLowerCase();
  
  return suggestions[baseName] || "Process with appropriate EQ and effects for your mix context";
}

/**
 * Get suggestion for specific effect
 */
function getEffectSuggestion(effect: string): string {
  const suggestions: {[key: string]: string} = {
    'reverb': "Start with 15-20% wet/dry mix, adjust pre-delay (20-80ms) to maintain definition",
    'delay': "Sync to tempo, use filtering on feedback path, try ping-pong for stereo interest",
    'distortion': "Apply subtly (10-30%), consider multiband distortion to preserve certain frequencies",
    'compression': "Start with 3:1 ratio, adjust attack to let transients through if needed",
    'filter': "Automate cutoff for movement, add resonance (20-40%) for emphasis at cutoff point",
    'chorus': "Keep subtle (10-25%) for thickening, higher values (40-60%) for more obvious effect",
    'flanger': "Use low feedback (10-20%), slow rate (0.1-0.5Hz) for subtle movement",
    'phaser': "4-8 stages for subtle effect, more stages for more dramatic sweeps"
  };
  
  // Extract the effect name from more complex strings
  const baseName = effect.split(' ')[0].toLowerCase();
  
  return suggestions[baseName] || "Adjust parameters to taste, starting with subtle settings";
}