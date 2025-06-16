import { useEffect, useRef, useState, useCallback } from "react";

interface AnimatedSoundWaveBackgroundProps {
  isPlaying?: boolean;
  tempo?: number; // BPM
  intensity?: number; // 0-1 scale
  className?: string;
  audioElement?: HTMLAudioElement | null;
}

interface WaveConfig {
  amplitude: number;
  frequency: number;
  phase: number;
  speed: number;
  color: string;
  opacity: number;
}

export default function AnimatedSoundWaveBackground({
  isPlaying = false,
  tempo = 120,
  intensity = 0.5,
  className = "",
  audioElement = null
}: AnimatedSoundWaveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);
  const timeDataRef = useRef<Uint8Array | null>(null);
  
  const [actualTempo, setActualTempo] = useState(tempo);
  const [audioIntensity, setAudioIntensity] = useState(intensity);
  const lastBeatTime = useRef(0);
  const beatIntervalRef = useRef<number>(60000 / tempo); // ms per beat

  // Wave configurations for different layers
  const waveConfigs: WaveConfig[] = [
    {
      amplitude: 50,
      frequency: 0.02,
      phase: 0,
      speed: 0.01,
      color: "#FF4081",
      opacity: 0.3
    },
    {
      amplitude: 30,
      frequency: 0.03,
      phase: Math.PI / 3,
      speed: 0.015,
      color: "#AB47BC",
      opacity: 0.25
    },
    {
      amplitude: 40,
      frequency: 0.025,
      phase: Math.PI / 2,
      speed: 0.008,
      color: "#3F51B5",
      opacity: 0.2
    },
    {
      amplitude: 60,
      frequency: 0.015,
      phase: Math.PI,
      speed: 0.012,
      color: "#FFC107",
      opacity: 0.15
    }
  ];

  // Initialize audio analysis
  const initializeAudioAnalysis = useCallback(() => {
    if (!audioElement || audioContextRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      
      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      
      frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount);
      timeDataRef.current = new Uint8Array(analyser.fftSize);
    } catch (error) {
      console.warn("Audio analysis not available:", error);
    }
  }, [audioElement]);

  // Advanced tempo detection with multiple frequency bands
  const detectTempo = useCallback(() => {
    if (!analyserRef.current || !frequencyDataRef.current) return;

    analyserRef.current.getByteFrequencyData(frequencyDataRef.current);
    
    const currentTime = Date.now();
    const dataArray = frequencyDataRef.current;
    
    // Analyze bass frequencies (20-200 Hz) for beat detection
    const bassRange = Math.floor(dataArray.length * 0.1); // Roughly 20-200 Hz
    let bassEnergy = 0;
    for (let i = 0; i < bassRange; i++) {
      bassEnergy += dataArray[i];
    }
    bassEnergy /= bassRange;
    
    // Detect peaks in bass energy
    const threshold = 100 + (audioIntensity * 80);
    const beatDetected = bassEnergy > threshold;
    
    if (beatDetected && currentTime - lastBeatTime.current > 300) { // Minimum 300ms between beats
      const timeDiff = currentTime - lastBeatTime.current;
      const detectedBPM = 60000 / timeDiff;
      
      if (detectedBPM > 60 && detectedBPM < 200) {
        setActualTempo(prev => prev * 0.85 + detectedBPM * 0.15); // Smooth transition
        beatIntervalRef.current = 60000 / detectedBPM;
      }
      lastBeatTime.current = currentTime;
    }
  }, [audioIntensity]);

  // Get audio intensity from frequency data
  const getAudioIntensity = useCallback(() => {
    if (!analyserRef.current || !frequencyDataRef.current) return intensity;

    analyserRef.current.getByteFrequencyData(frequencyDataRef.current);
    
    // Calculate average intensity from frequency data
    let sum = 0;
    const dataArray = frequencyDataRef.current;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    
    const average = sum / dataArray.length;
    const normalizedIntensity = average / 255;
    
    setAudioIntensity(prev => prev * 0.8 + normalizedIntensity * 0.2); // Smooth transition
    return normalizedIntensity;
  }, [intensity]);

  // Draw animated waves
  const drawWaves = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    ctx.clearRect(0, 0, width, height);
    
    const currentIntensity = getAudioIntensity();
    const tempoMultiplier = actualTempo / 120; // Normalize to 120 BPM
    const beatPhase = (time % beatIntervalRef.current) / beatIntervalRef.current;
    
    // Beat pulse effect with enhanced tempo responsiveness
    const beatPulse = Math.sin(beatPhase * Math.PI * 2) * 0.4 + 0.6;
    const tempoIntensity = Math.min(tempoMultiplier * 1.5, 2.0);
    
    waveConfigs.forEach((config, index) => {
      ctx.beginPath();
      ctx.strokeStyle = config.color;
      ctx.globalAlpha = config.opacity * (isPlaying ? 1 : 0.3) * beatPulse;
      ctx.lineWidth = 2 + (currentIntensity * 4) + (tempoIntensity * 1.5);
      
      // Enhanced wave parameters with tempo responsiveness
      const amplitude = config.amplitude * (1 + currentIntensity * 2.5) * beatPulse * tempoIntensity;
      const frequency = config.frequency * tempoMultiplier * (1 + currentIntensity * 0.5);
      const phase = config.phase + (time * config.speed * tempoMultiplier * 0.001);
      
      // Create more complex wave patterns based on tempo
      const tempoOffset = (actualTempo - 120) / 120; // Normalized tempo offset
      
      // Draw primary wave
      for (let x = 0; x <= width; x += 1) {
        const baseWave = Math.sin(x * frequency + phase) * amplitude;
        const tempoWave = Math.cos(x * frequency * 0.7 + phase + tempoOffset) * amplitude * 0.3;
        const intensityWave = Math.sin(x * frequency * 2 + phase * 1.5) * amplitude * currentIntensity * 0.2;
        
        const y = height / 2 + baseWave + tempoWave + intensityWave;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      // Add secondary harmonic wave
      ctx.beginPath();
      ctx.globalAlpha = config.opacity * 0.5 * (isPlaying ? 1 : 0.2) * beatPulse;
      ctx.lineWidth = 1 + (currentIntensity * 2);
      
      for (let x = 0; x <= width; x += 3) {
        const y = height / 2 + Math.sin(x * frequency * 2 + phase + Math.PI) * amplitude * 0.3;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    });
    
    // Add particle effects on beat
    if (isPlaying && beatPhase < 0.1) {
      const particleCount = Math.floor(currentIntensity * 10);
      ctx.globalAlpha = 0.6;
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = height / 2 + (Math.random() - 0.5) * 200;
        const size = Math.random() * 3 + 1;
        
        ctx.beginPath();
        ctx.fillStyle = waveConfigs[i % waveConfigs.length].color;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [actualTempo, audioIntensity, isPlaying, getAudioIntensity]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Set canvas size
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const currentTime = Date.now();
    
    // Detect tempo and update audio analysis
    if (isPlaying && audioElement) {
      detectTempo();
    }
    
    // Draw waves
    drawWaves(ctx, width, height, currentTime);
    
    // Continue animation
    if (isPlaying || audioIntensity > 0.1) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying, audioElement, detectTempo, drawWaves, audioIntensity]);

  // Initialize audio analysis when audio element is available
  useEffect(() => {
    if (audioElement && isPlaying) {
      initializeAudioAnalysis();
    }
  }, [audioElement, isPlaying, initializeAudioAnalysis]);

  // Start/stop animation based on playing state
  useEffect(() => {
    if (isPlaying || audioIntensity > 0.1) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate, audioIntensity]);

  // Cleanup audio context
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent'
      }}
    />
  );
}