import React from 'react';
import { X, Sun, Sparkles, Zap, Layers, Image as ImageIcon, Volume2, Music } from 'lucide-react';
import type { ParticleMode } from '../types';

// 1. IMPORT GAMBAR LOKAL (Pastikan file ada di folder src/assets/)
import bgStudyDay from '../assets/studyday.jpg';
import bgStudyNight from '../assets/studynight.jpg';
import bgRainy from '../assets/rainy.jpg';
import bgWinter from '../assets/winter.jpg';
import bgBeach from '../assets/beach.jpg';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  visuals: {
    brightness: number;
    showParticles: boolean;
    particleMode: ParticleMode;
    particleSpeed: number;
    particleCount: number;
  };
  onUpdate: (key: string, value: any) => void;
  wallpaper: string;
  setWallpaper: (url: string) => void;
  musicVolume: number;
  onMusicVolumeChange: (val: number) => void;
  ambientVolume: number;
  onAmbientVolumeChange: (val: number) => void;
}

const DEFAULT_BACKGROUNDS = [
  { id: 'lofi-day', label: 'Study Day', url: bgStudyDay },
  { id: 'lofi-night', label: 'Study Night', url: bgStudyNight },
  { id: 'lofi-rainy', label: 'Rainy Night', url: bgRainy },
  { id: 'lofi-winter', label: 'Winter Chill', url: bgWinter },
  { id: 'lofi-beach', label: 'Beach Lofi', url: bgBeach },
];

const Settings: React.FC<SettingsProps> = ({ 
  isOpen, onClose, visuals, onUpdate, wallpaper, setWallpaper,
  musicVolume, onMusicVolumeChange, ambientVolume, onAmbientVolumeChange
}) => {
  if (!isOpen) return null;

  const modes: { id: ParticleMode; label: string }[] = [
    { id: 'dust', label: 'Dust Motes' },
    { id: 'sakura', label: 'Sakura Petals' },
    { id: 'grain', label: 'Retro Grain' },
    { id: 'rain', label: 'Rainy Day' },
    { id: 'fireflies', label: 'Fireflies' },
    { id: 'snow', label: 'Snowy Fall' },
    { id: 'minimal', label: 'Zen Dot' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-2xl">
      <div className="boutique-glass w-full max-w-sm p-10 rounded-[3rem] relative border border-white/5 shadow-3xl">
        <button onClick={onClose} className="absolute top-8 right-8 opacity-20 hover:opacity-100 transition-opacity">
          <X size={20} />
        </button>

        <h2 className="serif-title text-xl italic opacity-40 mb-10 text-center tracking-widest">Atmosphere</h2>

        <div className="space-y-10 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
          {/* Audio Mixing */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between opacity-20">
                <span className="text-[9px] uppercase tracking-widest font-bold">Soundtrack Level</span>
                <Music size={12} />
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" 
                value={musicVolume}
                onChange={(e) => onMusicVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between opacity-20">
                <span className="text-[9px] uppercase tracking-widest font-bold">Ambience Level</span>
                <Volume2 size={12} />
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" 
                value={ambientVolume}
                onChange={(e) => onAmbientVolumeChange(parseFloat(e.target.value))}
                className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>

          {/* Backgrounds */}
          <div className="space-y-4 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between opacity-20">
              <span className="text-[9px] uppercase tracking-widest font-bold">Backgrounds</span>
              <ImageIcon size={12} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_BACKGROUNDS.map(bg => (
                <button 
                  key={bg.id}
                  onClick={() => setWallpaper(bg.url)}
                  className={`py-3 rounded-xl text-[9px] uppercase tracking-widest border transition-all ${wallpaper === bg.url ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 border-white/5 opacity-40 hover:opacity-100'}`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brightness */}
          <div className="space-y-4 border-t border-white/5 pt-6">
            <div className="flex items-center justify-between opacity-20">
              <span className="text-[9px] uppercase tracking-widest font-bold">Luminance</span>
              <Sun size={12} />
            </div>
            <input 
              type="range" min="0.1" max="1" step="0.01" 
              value={visuals.brightness}
              onChange={(e) => onUpdate('brightness', parseFloat(e.target.value))}
              className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Mode Selector */}
          <div className="space-y-4">
            <div className="flex items-center justify-between opacity-20">
              <span className="text-[9px] uppercase tracking-widest font-bold">Effect Mode</span>
              <Layers size={12} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {modes.map(m => (
                <button 
                  key={m.id}
                  onClick={() => onUpdate('particleMode', m.id)}
                  className={`py-3 rounded-xl text-[9px] uppercase tracking-widest border transition-all ${visuals.particleMode === m.id ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 border-white/5 opacity-40 hover:opacity-100'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Particle Controls */}
          <div className="space-y-6 pt-4 border-t border-white/5">
             <div className="space-y-3">
                <div className="flex justify-between opacity-20 text-[8px] uppercase tracking-widest">
                  <span>Intensity</span>
                  <Zap size={10} />
                </div>
                <input 
                  type="range" min="0.1" max="5" step="0.1" 
                  value={visuals.particleSpeed}
                  onChange={(e) => onUpdate('particleSpeed', parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
                />
             </div>
             <div className="space-y-3">
                <div className="flex justify-between opacity-20 text-[8px] uppercase tracking-widest">
                  <span>Amount</span>
                  <Sparkles size={10} />
                </div>
                <input 
                  type="range" min="0.1" max="2" step="0.1" 
                  value={visuals.particleCount}
                  onChange={(e) => onUpdate('particleCount', parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white"
                />
             </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <span className="text-[9px] uppercase tracking-widest font-bold opacity-20">Background FX</span>
            <button 
              onClick={() => onUpdate('showParticles', !visuals.showParticles)}
              className={`w-10 h-5 rounded-full transition-all flex items-center px-1 ${visuals.showParticles ? 'bg-white' : 'bg-white/10'}`}
            >
              <div className={`w-3 h-3 rounded-full transition-all ${visuals.showParticles ? 'bg-black translate-x-5' : 'bg-white/40'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
