# 🎵 LyricLab: AI-Powered Lyric Enhancement Platform

LyricLab is a comprehensive lyrical enhancement platform that transforms lyrics through intelligent persona-based generation and creative production tools.

## 🚀 Features

### 🎤 Persona-Based Enhancements
- Transform your lyrics to match the style of different musical personas
- Each persona has unique characteristics that influence the transformation
- Visualize vocal characteristics with interactive Sound Signature feature

### 🧙‍♂️ Style Transformer
- Transform lyrics between different musical styles using OpenAI's powerful language models
- Choose from 10 different style presets across genres (Rap, Pop, Rock, R&B, etc.)
- Customize mood settings and transformation strength
- Control preservation of structure, rhymes, themes, and imagery

### 🎧 Sound Design
- Get professional sound design suggestions for your tracks
- Customize with different instruments and effects
- Perfect for producers looking to enhance their productions

### ✍️ Songwriter Assistant
- Generate lyrics based on topics, moods, and genres
- Perfect for overcoming writer's block or exploring new styles
- Customizable parameters for verse length and song structure

### 🗣️ Voice Preview
- Preview how your lyrics would sound with different voices
- Powered by ElevenLabs API for realistic voice synthesis
- Choose from various voice styles to match your creative vision

### 📊 Analytics & Visualization
- Persona Energy Meter to visualize the creative intensity of lyrics
- Sound Signature to compare vocal characteristics between personas
- Track your creative process with detailed insights

## 🔧 Technologies

- React frontend with TypeScript
- Express backend
- OpenAI integration for intelligent text generation
- ElevenLabs for voice synthesis
- PostgreSQL database for content storage

## 🛠️ Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL database
- OpenAI API key
- ElevenLabs API key (optional, for voice features)

### Installation
1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   OPENAI_API_KEY=your_openai_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key (optional)
   ```
4. Run the development server with `npm run dev`

## 📚 Usage Guide

### Using the Style Transformer

1. Navigate to the "Style Transformer" tab in the navigation
2. Enter your lyrics in the input field
3. Choose a target style from the available presets
4. Adjust transformation settings:
   - Transformation strength (Subtle to Complete)
   - Mood selection
   - Structure preservation
   - Rhyme keeping
   - Theme maintenance
   - Imagery enhancement
5. Click "Transform Lyrics" to generate your styled lyrics
6. Copy, save, or continue editing the transformed lyrics

### Working with Personas

1. Navigate to the "Personas" tab
2. Browse available personas across different musical genres
3. Select a persona to view their characteristics
4. Use the Sound Signature visualization to understand their vocal style
5. Apply persona characteristics to your lyrics via the Lyric Enhancer

### Creating Voice Previews

1. Select a persona or voice style
2. Enter the text you want to preview
3. Click "Generate Preview" to hear your lyrics with that voice
4. Download or share the audio preview

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- OpenAI for providing the language models
- ElevenLabs for voice synthesis technology
- All contributors who have helped build this project