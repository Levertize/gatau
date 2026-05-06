import React from 'react';
import { CloudRain, Wind, Waves, Trees, X } from 'lucide-react';

interface NatureMixerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSounds: Record<string, boolean>;
  toggleSound: (id: string) => void;
  volumes: Record<string, number>;
  onVolumeChange: (id: string, val: number) => void;
}

const AMBIENCE_DATA = [
  { id: 'rain', icon: CloudRain, label: 'Rain' },
  { id: 'wind', icon: Wind, label: 'Wind' },
  { id: 'waves', icon: Waves, label: 'Waves' },
  { id: 'forest', icon: Trees, label: 'Forest' },
];

const NatureMixer: React.FC<NatureMixerProps> = ({ 
  isOpen, onClose, activeSounds, toggleSound, volumes, onVolumeChange 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-3xl">
      <div className="boutique-glass w-full max-w-sm p-10 rounded-[3rem] relative border border-white/10 shadow-2xl">
        <button onClick={onClose} className="absolute top-8 right-8 opacity-20 hover:opacity-100 transition-all z-50">
          <X size={20} />
        </button>

        <h2 className="serif-title text-xl italic opacity-40 mb-10 text-center tracking-[0.2em]">Atmosphere</h2>

        <div className="space-y-4">
          {AMBIENCE_DATA.map((sound) => {
            const Icon = sound.icon;
            const isActive = activeSounds[sound.id];
            
            return (
              <div 
                key={sound.id}
                className={`p-6 rounded-2xl border transition-all duration-500 ${isActive ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 opacity-40 hover:opacity-100'}`}
              >
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => toggleSound(sound.id)}
                    className="flex items-center gap-5 flex-1"
                  >
                    <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-white text-black' : 'bg-white/5 text-white'}`}>
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{sound.label}</span>
                  </button>
                  
                  {isActive && (
                    <input 
                      type="range" 
                      min="0" max="1" step="0.01" 
                      value={volumes[sound.id]} 
                      onChange={(e) => onVolumeChange(sound.id, parseFloat(e.target.value))}
                      className="w-16 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white ml-4"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NatureMixer;
