import React from 'react';
import { X, Sun, Sparkles, Zap, Layers, Volume2, Music, Contrast, Palette, Sliders } from 'lucide-react';
import type { ParticleMode } from '../types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  visuals: {
    brightness: number;
    contrast: number;
    saturation: number;
    showParticles: boolean;
    particleMode: ParticleMode;
    particleSpeed: number;
    particleCount: number;
  };
  onUpdate: (key: string, value: any) => void;
  musicVolume: number;
  onMusicVolumeChange: (val: number) => void;
  ambientVolume: number;
  onAmbientVolumeChange: (val: number) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  isOpen, onClose, visuals, onUpdate,
  musicVolume, onMusicVolumeChange, ambientVolume, onAmbientVolumeChange
}) => {
  if (!isOpen) return null;

  const modes: { id: ParticleMode; label: string }[] = [
    { id: 'dust', label: 'Dust' },
    { id: 'sakura', label: 'Sakura' },
    { id: 'grain', label: 'Grain' },
    { id: 'rain', label: 'Rain' },
    { id: 'fireflies', label: 'Firefly' },
    { id: 'snow', label: 'Snow' },
    { id: 'minimal', label: 'Zen' },
  ];

  const ControlGroup = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 space-y-6">
      <div className="flex items-center gap-3 opacity-30">
        <Icon size={14} />
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{title}</span>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );

  const Slider = ({ label, icon: Icon, value, min, max, step, onChange }: any) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center opacity-40">
        <div className="flex items-center gap-2">
          <Icon size={10} />
          <span className="text-[8px] uppercase tracking-widest">{label}</span>
        </div>
        <span className="text-[8px] font-mono">{Math.round(value * 100)}%</span>
      </div>
      <input 
        type="range" min={min} max={max} step={step} 
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white hover:accent-white/80 transition-all"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-3xl">
      <div className="boutique-glass w-full max-w-sm p-12 rounded-[3rem] relative border border-white/5 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-8 right-8 opacity-20 hover:opacity-100 transition-opacity">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center gap-2 mb-10">
          <Sliders size={24} className="opacity-20 animate-pulse" />
          <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-30">Setup</h2>
        </div>

        <div className="space-y-6">
          {/* Audio Mixing Card */}
          <ControlGroup title="Audio Mix" icon={Volume2}>
            <Slider 
              label="Soundtrack" icon={Music} 
              value={musicVolume} min="0" max="1" step="0.01" 
              onChange={onMusicVolumeChange} 
            />
            <Slider 
              label="Ambience" icon={Volume2} 
              value={ambientVolume} min="0" max="1" step="0.01" 
              onChange={onAmbientVolumeChange} 
            />
          </ControlGroup>

          {/* Visual Tuning Card */}
          <ControlGroup title="Atmosphere" icon={Sun}>
            <Slider 
              label="Luminance" icon={Sun} 
              value={visuals.brightness} min="0.1" max="1" step="0.01" 
              onChange={(v: any) => onUpdate('brightness', v)} 
            />
            <Slider 
              label="Contrast" icon={Contrast} 
              value={visuals.contrast / 2} min="0.5" max="2" step="0.01" 
              onChange={(v: any) => onUpdate('contrast', v * 2)} 
            />
            <Slider 
              label="Saturation" icon={Palette} 
              value={visuals.saturation / 2} min="0" max="2" step="0.01" 
              onChange={(v: any) => onUpdate('saturation', v * 2)} 
            />
          </ControlGroup>

          {/* Particle Engine Card */}
          <ControlGroup title="Visual FX" icon={Sparkles}>
            <div className="grid grid-cols-2 gap-2">
              {modes.map(m => (
                <button 
                  key={m.id}
                  onClick={() => onUpdate('particleMode', m.id)}
                  className={`py-3 rounded-xl text-[8px] uppercase tracking-widest border transition-all ${visuals.particleMode === m.id ? 'bg-white text-black border-white shadow-xl' : 'bg-white/5 border-white/5 opacity-40 hover:opacity-100'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            
            <div className="pt-4 space-y-6 border-t border-white/5">
              <Slider 
                label="Intensity" icon={Zap} 
                value={visuals.particleSpeed / 5} min="0.1" max="5" step="0.1" 
                onChange={(v: any) => onUpdate('particleSpeed', v * 5)} 
              />
              <Slider 
                label="Amount" icon={Sparkles} 
                value={visuals.particleCount / 2} min="0.1" max="2" step="0.1" 
                onChange={(v: any) => onUpdate('particleCount', v * 2)} 
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <span className="text-[8px] uppercase tracking-widest font-bold opacity-30">Active Particles</span>
              <button 
                onClick={() => onUpdate('showParticles', !visuals.showParticles)}
                className={`w-8 h-4 rounded-full transition-all flex items-center px-0.5 ${visuals.showParticles ? 'bg-white' : 'bg-white/10'}`}
              >
                <div className={`w-3 h-3 rounded-full transition-all ${visuals.showParticles ? 'bg-black translate-x-4' : 'bg-white/40'}`} />
              </button>
            </div>
          </ControlGroup>
        </div>
      </div>
    </div>
  );
};

export default Settings;


export default Settings;
