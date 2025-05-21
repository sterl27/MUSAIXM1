// Service for generating voice samples with ElevenLabs
import fetch from 'node-fetch';

interface Voice {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  labels?: Record<string, string>;
}

interface VoiceResponse {
  voices: Voice[];
}

// Available voice models
const MODELS = {
  MULTILINGUAL: "eleven_multilingual_v2",
  MONOLINGUAL: "eleven_monolingual_v1",
  TURBO: "eleven_turbo_v2",
};

/**
 * Get available voices from ElevenLabs
 */
export async function getAvailableVoices(): Promise<Voice[]> {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key is not configured');
    }

    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'xi-api-key': apiKey
      }
    });

    if (!response.ok) {
      const errorData = await response.json() as { detail?: string };
      throw new Error(`ElevenLabs API error: ${errorData.detail || response.statusText}`);
    }

    const data = await response.json() as VoiceResponse;
    return data.voices;
  } catch (error) {
    console.error('Error fetching ElevenLabs voices:', error);
    throw error;
  }
}

/**
 * Generate speech from text using ElevenLabs
 */
export async function generateSpeech(
  text: string, 
  voiceId: string, 
  modelId: string = MODELS.TURBO,
  stability: number = 0.5,
  similarityBoost: number = 0.75
): Promise<Buffer> {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ElevenLabs API key is not configured');
    }

    // Ensure text isn't too long
    const truncatedText = text.length > 300 ? text.substring(0, 300) + '...' : text;

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text: truncatedText,
        model_id: modelId,
        voice_settings: {
          stability,
          similarity_boost: similarityBoost
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API error: ${errorText || response.statusText}`);
    }

    const audioBuffer = await response.buffer();
    return audioBuffer;
  } catch (error) {
    console.error('Error generating speech with ElevenLabs:', error);
    throw error;
  }
}

// Map persona IDs to appropriate voice IDs
export const defaultVoiceMappings: Record<string, string> = {
  // Pre-defined voices - these are example IDs and should be replaced with actual ElevenLabs voice IDs
  "kendrick": "ErXwobaYiN019PkySvjV", // Antoni - male voice
  "drake": "VR6AewLTigWG4xSOukaG", // Elli - female voice
  "future": "pNInz6obpgDQGcFmaJgB", // Adam - male voice
  "jcole": "EXAVITQu4vr4xnSDxMaL", // Bella - female voice
  "travis": "yoZ06aMxZJJ28mfd3POQ", // Sam - male voice
  "nicki": "21m00Tcm4TlvDq8ikWAM", // Rachel - female voice
  "outkast": "AZnzlk1XvdvUeBnXmlld", // Domi - female voice
  "rock-classic": "MF3mGyEYCl7XYWbV9V6O", // Matty - male voice
  "rock-punk": "TxGEqnHWrfWFTfGW9XjX", // Josh - male voice
  "rock-indie": "jBpfuIE2acCO8z3wKNLl", // Nicole - female voice
  "electronic-edm": "flq6f7yk4E4fJM5XTYuZ", // Fin - male voice
  "electronic-ambient": "z9fAnlkpzviPz146aGWa", // Clara - female voice
  "electronic-techno": "tLuYQqiAOmGaTvLhNuWJ", // Charlie - male voice
  "pop-mainstream": "IKne3meq5aSn9XLyUdCD", // Callum - male voice
  "pop-indie": "XB0fDUnXU5powFXDhCwa", // Charlotte - female voice
  "rnb-classic": "onwK4e9ZLuTAKqWW03F9", // Daniel - male voice
  "rnb-modern": "bVMeCyTHy58xNoL34h3p", // Jessie - female voice
  // Default fallback voice
  "default": "21m00Tcm4TlvDq8ikWAM" // Rachel - default fallback voice
};

export const MODELS_LIST = Object.values(MODELS);