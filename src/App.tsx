import React, { useState, useEffect, useRef } from 'react';
import { Image as ImageIcon, Link, Upload, X, Globe } from 'lucide-react';
import AmbientPulse from './components/AmbientPulse';
import AudioPlayer from './components/AudioPlayer';
import NatureMixer from './components/NatureMixer';
import Settings from './components/Settings';
import ParticleCanvas from './components/ParticleCanvas';
import type { ParticleMode } from './types';

// Import local backgrounds
import bgStudyDay from './assets/studyday.jpg';
import bgStudyNight from './assets/studynight.jpg';
import bgRainy from './assets/rainy.jpg';
import bgWinter from './assets/winter.jpg';
import bgBeach from './assets/beach.jpg';

const DEFAULT_BACKGROUNDS = [
  { id: 'lofi-day', label: 'Study Day', url: bgStudyDay },
  { id: 'lofi-night', label: 'Study Night', url: bgStudyNight },
  { id: 'lofi-rainy', label: 'Rainy Night', url: bgRainy },
  { id: 'lofi-winter', label: 'Winter Chill', url: bgWinter },
  { id: 'lofi-beach', label: 'Beach Lofi', url: bgBeach },
];

// Using stable URLs for ambient sounds
const AMBIENCE_SOURCES = [
  { id: 'rain', url: 'https://www.gstatic.com/voice_delight/sounds/long/rain.mp3' },
  { id: 'wind', url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/a/a0/Howling_wind.ogg/Howling_wind.ogg.mp3' },
  { id: 'night', url: 'https://www.gstatic.com/voice_delight/sounds/long/country_night.mp3' },
  { id: 'waves', url: 'https://www.gstatic.com/voice_delight/sounds/long/ocean.mp3' },
  { id: 'forest', url: 'https://www.gstatic.com/voice_delight/sounds/long/forest.mp3' },
];

const App: React.FC = () => {
  const [wallpaper, setWallpaper] = useState<string>(DEFAULT_BACKGROUNDS[0].url);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [isNatureOpen, setIsNatureOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasUrl, setCanvasUrl] = useState('');
  const [showUI, setShowUI] = useState(true);
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(32));
  
  // Persistence Refs
  const ambientObjects = useRef<Record<string, HTMLAudioElement>>({});
  const [activeSounds, setActiveSounds] = useState<Record<string, boolean>>({
    rain: false, wind: false, night: false, waves: false, forest: false
  });
  const [ambientVolumes, setAmbientVolumes] = useState<Record<string, number>>({
    rain: 0.5, wind: 0.5, night: 0.5, waves: 0.5, forest: 0.5
  });
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [masterAmbientVolume, setMasterAmbientVolume] = useState(0.5);

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSource, setActiveSource] = useState<'yt' | 'local' | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [localAudio, setLocalAudio] = useState<string | null>(null);

  const [visuals, setVisuals] = useState({
    brightness: 0.3,
    contrast: 1.1,
    saturation: 1.1,
    showParticles: true,
    particleMode: 'dust' as ParticleMode,
    particleSpeed: 1,
    particleCount: 1
  });

  // Initialize once
  useEffect(() => {
    AMBIENCE_SOURCES.forEach(s => {
      if (!ambientObjects.current[s.id]) {
        const a = new Audio();
        a.src = s.url;
        a.loop = true;
        a.volume = ambientVolumes[s.id] * masterAmbientVolume;
        
        // Add error handling for each audio element
        a.onerror = () => {
          console.warn(`Ambience sound ${s.id} failed to load from ${s.url}.`);
        };

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
      if (!isAudioOpen && !isNatureOpen && !isSettingsOpen && !isCanvasOpen) {
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
  }, [isAudioOpen, isNatureOpen, isSettingsOpen, isCanvasOpen]);

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
          transform: `scale(${1.05 + (getScale() - 1) * 0.05})`, // Reduced scale effect to prevent jarring movement
          filter: `contrast(${visuals.contrast}) saturate(${visuals.saturation})` 
        }}
      />
      {/* Darker overlays for better UI visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" /> 

      <AmbientPulse scale={getScale()} />
      {visuals.showParticles && (
        <ParticleCanvas 
          mode={visuals.particleMode} 
          speed={visuals.particleSpeed} 
          count={visuals.particleCount} 
          frequencyData={frequencyData}
        />
      )}

      <div className="relative z-50 h-full flex flex-col justify-between p-6 md:p-16 transition-all duration-1000 ease-out">
        <header className="flex flex-col items-center">
          <h1 
            data-text="ZENSPACE"
            className="text-5xl sm:text-6xl md:text-8xl font-sans font-light tracking-[0.6em] text-outline-animate"
          >
            ZENSPACE
          </h1>
          <div className={`w-px h-16 bg-white/10 mt-10 transition-all duration-1000 ${showUI ? 'opacity-100' : 'opacity-0'}`} />
        </header>

        <main className="flex flex-col items-center">
          {isPlaying && (
            <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-1000">
               <div className="flex items-end gap-2 h-12">
                 {[...Array(16)].map((_, i) => {
                   const durations = ['0.6s', '0.8s', '0.5s', '0.9s', '0.7s', '1.1s', '0.4s', '1.0s'];
                   const delays = ['0s', '0.2s', '0.4s', '0.1s', '0.3s', '0.5s', '0.2s', '0.1s'];
                   return (
                     <div 
                      key={i} 
                      className={`w-1 rounded-full bg-gradient-to-t from-white/10 via-white/40 to-white/80 shadow-[0_0_15px_rgba(255,255,255,0.2)] ${isPlaying ? 'visualizer-bar' : ''}`}
                      style={{ 
                        height: isPlaying ? undefined : '15%',
                        '--duration': durations[i % durations.length],
                        '--delay': delays[i % delays.length]
                      } as React.CSSProperties} 
                     />
                   );
                 })}
               </div>
               <div className="relative py-2 px-6">
                 <div className="absolute inset-0 border border-white/10 rounded-full blur-[2px]" />
                 <span className="relative text-[9px] tracking-[0.8em] uppercase font-bold text-white/40 text-shimmer">
                   Atmosphere Active
                 </span>
               </div>
            </div>
          )}
        </main>

        <footer className={`flex flex-col items-center gap-8 transition-all duration-1000 ${showUI ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div 
            className="relative p-[1px] rounded-full overflow-hidden glow-container shadow-3xl z-20"
            style={{ backgroundColor: 'black' }}
          >
            <nav className="boutique-glass px-6 py-4 md:px-12 md:py-7 rounded-full flex gap-4 md:gap-16 items-center border border-white/5 relative z-10">
              <button onClick={() => setIsAudioOpen(true)} className={`nav-link ${isAudioOpen || isPlaying ? 'active' : ''}`}>Soundtrack</button>
              <button onClick={() => setIsCanvasOpen(true)} className={`nav-link ${isCanvasOpen ? 'active' : ''}`}>Canvas</button>
              <button onClick={() => setIsNatureOpen(true)} className={`nav-link ${isNatureOpen || Object.values(activeSounds).some(v => v) ? 'active' : ''}`}>Ambience</button>
              <button onClick={() => setIsSettingsOpen(true)} className={`nav-link ${isSettingsOpen ? 'active' : ''}`}>Setup</button>
            </nav>
          </div>

          <a 
            href="https://github.com/Levertize" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative px-6 py-2 rounded-full overflow-hidden transition-all duration-500 hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] font-light opacity-30 group-hover:opacity-80 transition-opacity">
              <span>Made by iqbal/levertize with</span>
              <span className="text-red-500/60 animate-pulse">❤️</span>
              <div className="w-px h-3 bg-white/20 mx-1" />
              <svg 
                className="w-3 h-3 fill-current" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              <span className="font-bold">GitHub</span>
            </div>
          </a>
        </footer>
      </div>

      {/* Canvas Hub Modal */}
      {isCanvasOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-3xl">
          <div className="boutique-glass w-full max-w-sm p-8 md:p-12 rounded-[3rem] relative border border-white/5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={() => setIsCanvasOpen(false)} className="absolute top-6 right-6 md:top-8 md:right-8 opacity-20 hover:opacity-100 transition-opacity">
              <X size={20} />
            </button>

            <div className="flex flex-col items-center gap-2 mb-10">
              <ImageIcon size={24} className="opacity-20 animate-pulse" />
              <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-30">Canvas Selection</h2>
            </div>

            <div className="space-y-12">
              {/* Current Wallpaper Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between opacity-20">
                  <span className="text-[9px] uppercase tracking-widest font-bold">Current Atmosphere</span>
                  <Globe size={12} />
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img src={wallpaper} alt="Current Wallpaper" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              </div>

              {/* Presets Grid */}
              <div className="space-y-4 border-t border-white/5 pt-10">
                <div className="flex items-center justify-between opacity-20">
                  <span className="text-[9px] uppercase tracking-widest font-bold">Lofi Presets</span>
                  <ImageIcon size={12} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {DEFAULT_BACKGROUNDS.map(bg => (
                    <button 
                      key={bg.id}
                      onClick={() => setWallpaper(bg.url)}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-white/5 transition-all hover:border-white/20 active:scale-95"
                    >
                      <img src={bg.url} alt={bg.label} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] uppercase tracking-widest font-bold">{bg.label}</span>
                      </div>
                      {wallpaper === bg.url && (
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-6 border-t border-white/5 pt-10">
                <div className="flex items-center justify-between opacity-20">
                  <span className="text-[9px] uppercase tracking-widest font-bold">Remote Image</span>
                  <Link size={12} />
                </div>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (canvasUrl) {
                      setWallpaper(canvasUrl);
                      setCanvasUrl('');
                    }
                  }} 
                  className="space-y-4"
                >
                  <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:border-white/20 transition-colors">
                    <Link size={14} className="opacity-20 mr-3 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Paste Image URL (Unsplash, etc.)" 
                      className="w-full bg-transparent py-4 text-[11px] focus:outline-none placeholder:opacity-10"
                      value={canvasUrl}
                      onChange={(e) => setCanvasUrl(e.target.value)}
                    />
                    {canvasUrl && (
                      <button 
                        type="submit"
                        className="ml-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-[8px] uppercase tracking-widest font-bold transition-all shrink-0"
                      >
                        Set
                      </button>
                    )}
                  </div>
                </form>

                {/* Local Upload */}
                <div className="relative group cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setWallpaper(URL.createObjectURL(file));
                    }} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                  <div className="w-full py-6 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-3 opacity-30 group-hover:opacity-60 transition-opacity bg-white/5">
                    <Upload size={20} />
                    <span className="text-[9px] uppercase tracking-widest">Browse Local Image</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
