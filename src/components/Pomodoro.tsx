import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Moon, Heart } from 'lucide-react';
import type { TimerStyle } from '../types';

interface PomodoroProps {
  style?: TimerStyle;
  showUI: boolean;
}

type Mode = 'focus' | 'short' | 'long';

const MODES: Record<Mode, { label: string; time: number; icon: any }> = {
  focus: { label: 'Focus', time: 25 * 60, icon: Brain },
  short: { label: 'Short Break', time: 5 * 60, icon: Coffee },
  long: { label: 'Long Break', time: 15 * 60, icon: Moon },
};

const Pomodoro: React.FC<PomodoroProps> = ({ style = 'minimal', showUI }) => {
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.time);
  const [isActive, setIsActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const chimeRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    chimeRef.current = new Audio('https://www.gstatic.com/voice_delight/sounds/long/notification_simple-01.mp3');
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      chimeRef.current?.play().catch(() => {});
      if (timerRef.current) window.clearInterval(timerRef.current);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].time);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode].time);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / MODES[mode].time;

  if (style === 'none') return null;

  const renderControls = () => (
    <div className={`flex items-center gap-4 transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
      <button onClick={toggleTimer} className="p-2 rounded-full hover:bg-white/10 transition-colors">
        {isActive ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button onClick={resetTimer} className="p-2 rounded-full hover:bg-white/10 transition-colors">
        <RotateCcw size={18} />
      </button>
      <div className="w-px h-4 bg-white/10 mx-1" />
      {(Object.keys(MODES) as Mode[]).map(m => (
        <button 
          key={m}
          onClick={() => switchMode(m)}
          className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg transition-all ${mode === m ? 'bg-white text-black' : 'opacity-40 hover:opacity-100'}`}
        >
          {m === 'focus' ? 'Work' : m === 'short' ? 'Rest' : 'Break'}
        </button>
      ))}
    </div>
  );

  return (
    <div 
      className={`fixed top-12 right-12 z-[100] transition-all duration-1000 ${showUI ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-end gap-6">
        {style === 'minimal' && (
          <div className="text-right">
            <span className="text-6xl md:text-7xl font-sans font-extralight tracking-tighter opacity-80">
              {formatTime(timeLeft)}
            </span>
            <div className="mt-2 flex items-center justify-end gap-2 opacity-20">
              {React.createElement(MODES[mode].icon, { size: 12 })}
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{MODES[mode].label}</span>
            </div>
          </div>
        )}

        {style === 'circular' && (
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle 
                cx="64" cy="64" r="60" 
                fill="transparent" 
                stroke="currentColor" 
                strokeWidth="2" 
                className="text-white/5"
              />
              <circle 
                cx="64" cy="64" r="60" 
                fill="transparent" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeDasharray={377}
                strokeDashoffset={377 * progress}
                className="text-white transition-all duration-1000"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-2xl font-sans font-light opacity-80">
              {formatTime(timeLeft)}
            </span>
          </div>
        )}

        {style === 'pill' && (
          <div className="boutique-glass px-8 py-4 rounded-full border border-white/5 flex items-center gap-5 shadow-2xl">
            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_white] animate-pulse" />
            <span className="text-2xl font-sans font-light tracking-wider">
              {formatTime(timeLeft)}
            </span>
          </div>
        )}

        {style === 'cute' && (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-[2.5rem] blur opacity-40 group-hover:opacity-100 transition duration-1000" />
            <div className="relative boutique-glass px-8 py-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 mb-1">
                <Heart size={16} className="text-pink-400 fill-pink-400 animate-bounce" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-pink-200/60">Focus Time</span>
              </div>
              <span className="text-4xl font-sans font-medium tracking-tight text-white/90">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}

        {renderControls()}
      </div>
    </div>
  );
};

export default Pomodoro;
