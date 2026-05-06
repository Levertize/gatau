import React from 'react';
import { CloudRain, Wind, Waves, Trees, X, Moon, Volume2 } from 'lucide-react';

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
  { id: 'night', icon: Moon, label: 'Night' },
  { id: 'waves', icon: Waves, label: 'Waves' },
  { id: 'forest', icon: Trees, label: 'Forest' },
];

const NatureMixer: React.FC<NatureMixerProps> = ({ 
  isOpen, onClose, activeSounds, toggleSound, volumes, onVolumeChange 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-3xl">
      <div className="boutique-glass w-full max-w-sm p-12 rounded-[3rem] relative border border-white/5 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-8 right-8 opacity-20 hover:opacity-100 transition-opacity">
          <X size={20} />
        </button>

        <div className="flex flex-col items-center gap-2 mb-10">
          <Volume2 size={24} className="opacity-20 animate-pulse" />
          <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-30">Ambience</h2>
        </div>

        <div className="space-y-3">
          {AMBIENCE_DATA.map((sound) => {
            const Icon = sound.icon;
            const isActive = activeSounds[sound.id];
            
            return (
              <div 
                key={sound.id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${isActive ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
              >
                <div className="p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => toggleSound(sound.id)}
                      className="flex items-center gap-4"
                    >
                      <div className={`p-2.5 rounded-xl transition-all duration-500 ${isActive ? 'bg-white/10 text-white boutique-glow-active' : 'bg-white/5 text-white/40 group-hover:text-white/60'}`}>
                        <Icon size={16} strokeWidth={1.5} />
                      </div>
                      <span className={`text-[10px] uppercase tracking-widest font-bold transition-opacity ${isActive ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`}>
                        {sound.label}
                      </span>
                    </button>
                    
                    {isActive && (
                      <span className="text-[8px] uppercase tracking-widest font-bold opacity-20 animate-pulse">
                        Active
                      </span>
                    )}
                  </div>

                  {isActive && (
                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
                      <Volume2 size={10} className="opacity-20" />
                      <input 
                        type="range" 
                        min="0" max="1" step="0.01" 
                        value={volumes[sound.id]} 
                        onChange={(e) => onVolumeChange(sound.id, parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
                      />
                    </div>
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
