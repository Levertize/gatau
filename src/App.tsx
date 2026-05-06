import React, { useState, useEffect, useRef } from 'react';
import AmbientPulse from './components/AmbientPulse';
import AudioPlayer from './components/AudioPlayer';
import NatureMixer from './components/NatureMixer';
import Settings from './components/Settings';
import ParticleCanvas from './components/ParticleCanvas';
import type { ParticleMode } from './types';

// Using stable gstatic URLs for ambient sounds
const AMBIENCE_SOURCES = [
  { id: 'rain', url: 'https://www.gstatic.com/voice_delight/sounds/long/rain.mp3' },
  { id: 'wind', url: 'https://www.gstatic.com/voice_delight/sounds/long/country_night.mp3' },
  { id: 'waves', url: 'https://www.gstatic.com/voice_delight/sounds/long/ocean.mp3' },
  { id: 'forest', url: 'https://www.gstatic.com/voice_delight/sounds/long/forest.mp3' },
];

const App: React.FC = () => {
  const [wallpaper, setWallpaper] = useState<string>('https://images.unsplash.com/photo-1518173946687-a4c8a9ba332f?auto=format&fit=crop&q=80&w=2574');
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [isNatureOpen, setIsNatureOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(32));
  
  // Persistence Refs
  const ambientObjects = useRef<Record<string, HTMLAudioElement>>({});
  const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>({
    rain: false, wind: false, waves: false, forest: false
  });
  const [ambientVolumes, setAmbientVolumes] = useState<Record<string, number>>({
    rain: 0.5, wind: 0.5, waves: 0.5, forest: 0.5
  });
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [masterAmbientVolume, setMasterAmbientVolume] = useState(0.5);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSource, setActiveSource] = useState<'yt' | 'local' | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [localAudio, setLocalAudio] = useState<string | null>(null);

  const [visuals, setVisuals] = useState({
    brightness: 0.3,
    showParticles: true,
    particleMode: 'dust' as ParticleMode,
    particleSpeed: 1,
    particleCount: 1
  });

  // Initialize once - REMOVED crossOrigin to prevent CORS errors on simple media
  useEffect(() => {
    AMBIENCE_SOURCES.forEach(s => {
      if (!ambientObjects.current[s.id]) {
        const a = new Audio();
        a.src = s.url;
        a.loop = true;
        a.volume = ambientVolumes[s.id] * masterAmbientVolume;
        ambientObjects.current[s.id] = a;
      }
    });
  }, []);

  // Update ambient volumes when master changes
  useEffect(() => {
    AMBIENCE_SOURCES.forEach(s => {
      if (ambientObjects.current[s.id]) {
        ambientObjects.current[s.id].volume = ambientVolumes[s.id] * masterAmbientVolume;
      }
    });
  }, [masterAmbientVolume, ambientVolumes]);

  useEffect(() => {
    let timeout: number;
    const handleActivity = () => {
      setShowUI(true);
      clearTimeout(timeout);
      if (!isAudioOpen && !isNatureOpen && !isSettingsOpen) {
        timeout = window.setTimeout(() => setShowUI(false), 8000);
      }
    };
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearTimeout(timeout);
    };
  }, [isAudioOpen, isNatureOpen, isSettingsOpen]);

  const toggleAmbient = (id: string) => {
    const audio = ambientObjects.current[id];
    if (!audio) return;
    
    if (activeSounds[id]) {
      audio.pause();
      setActiveSounds(prev => ({ ...prev, [id]: false }));
    } else {
      audio.play()
        .then(() => setActiveSounds(prev => ({ ...prev, [id]: true })))
        .catch(e => {
          console.error(`Play error for ${id}:`, e);
          setActiveSounds(prev => ({ ...prev, [id]: false }));
        });
    }
  };

  const handleAmbientVolume = (id: string, val: number) => {
    setAmbientVolumes(prev => ({ ...prev, [id]: val }));
  };

  const getScale = () => {
    const sum = frequencyData.reduce((a, b) => a + b, 0);
    const avg = sum / (frequencyData.length || 1);
    return isPlaying ? 1 + (avg / 255) * 0.4 : 1;
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans selection:bg-white/10">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-[4000ms]"
        style={{ 
          backgroundImage: `url(${wallpaper})`,
          opacity: visuals.brightness,
          transform: `scale(${1.05 + (getScale() - 1) * 0.1})`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

      <AmbientPulse scale={getScale()} />
      {visuals.showParticles && (
        <ParticleCanvas 
          mode={visuals.particleMode} 
          speed={visuals.particleSpeed} 
          count={visuals.particleCount} 
          frequencyData={frequencyData}
        />
      )}

      <div className={`relative z-50 h-full flex flex-col justify-between p-16 transition-all duration-1000 ease-out ${showUI ? 'opacity-100' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
        <header className="flex flex-col items-center">
          <h1 
            data-text="ZEN"
            className="text-8xl font-sans font-light tracking-[0.6em] text-outline-animate"
          >
            ZEN
          </h1>
          <div className="w-px h-16 bg-white/10 mt-10" />
        </header>

        <main className="flex flex-col items-center">
          {isPlaying && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-1000">
               <div className="flex items-end gap-1.5 h-10">
                 {[...Array(12)].map((_, i) => {
                   const durations = ['0.6s', '0.8s', '0.5s', '0.9s', '0.7s', '1.1s'];
                   const delays = ['0s', '0.2s', '0.4s', '0.1s', '0.3s', '0.5s'];
                   return (
                     <div 
                      key={i} 
                      className={`w-1.5 rounded-full bg-gradient-to-t from-white/5 via-white/50 to-white/10 ${isPlaying ? 'visualizer-bar' : ''}`}
                      style={{ 
                        height: isPlaying ? undefined : '15%',
                        '--duration': durations[i % durations.length],
                        '--delay': delays[i % delays.length]
                      } as React.CSSProperties} 
                     />
                   );
                 })}
               </div>
               <span className="text-[9px] tracking-[0.8em] uppercase font-light text-shimmer">
                 Atmosphere Active
               </span>
            </div>
          )}
        </main>

        <footer className="flex justify-center items-center">
          <nav className="boutique-glass px-12 py-7 rounded-full flex gap-16 items-center shadow-3xl border border-white/5">
            <button onClick={() => setIsAudioOpen(true)} className={`nav-link ${isAudioOpen || isPlaying ? 'active' : ''}`}>Soundtrack</button>
            <label className="nav-link">
              Canvas
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setWallpaper(URL.createObjectURL(file));
              }} />
            </label>
            <button onClick={() => setIsNatureOpen(true)} className={`nav-link ${isNatureOpen || Object.values(activeSounds).some(v => v) ? 'active' : ''}`}>Ambience</button>
            <button onClick={() => setIsSettingsOpen(true)} className={`nav-link ${isSettingsOpen ? 'active' : ''}`}>Setup</button>
          </nav>
        </footer>
      </div>

      <AudioPlayer 
        isOpen={isAudioOpen} onClose={() => setIsAudioOpen(false)} 
        onFrequencyData={setFrequencyData}
        isPlaying={isPlaying} setIsPlaying={setIsPlaying}
        activeSource={activeSource} setActiveSource={setActiveSource}
        videoId={videoId} setVideoId={setVideoId}
        localAudio={localAudio} setLocalAudio={setLocalAudio}
        volume={musicVolume}
      />
      <NatureMixer 
        isOpen={isNatureOpen} onClose={() => setIsNatureOpen(false)} 
        activeSounds={activeSounds} toggleSound={toggleAmbient}
        volumes={ambientVolumes} onVolumeChange={handleAmbientVolume}
      />
      <Settings 
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} 
        visuals={visuals} onUpdate={(key, value) => setVisuals(prev => ({ ...prev, [key]: value }))}
        wallpaper={wallpaper}
        setWallpaper={setWallpaper}
        musicVolume={musicVolume}
        onMusicVolumeChange={setMusicVolume}
        ambientVolume={masterAmbientVolume}
        onAmbientVolumeChange={setMasterAmbientVolume}
      />

      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] z-10" />
    </div>
  );
};

export default App;
