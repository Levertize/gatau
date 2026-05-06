import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, FileAudio, X, Radio, Music, Link } from 'lucide-react';

interface AudioPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  onFrequencyData: (data: Uint8Array) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  activeSource: 'yt' | 'local' | null;
  setActiveSource: (source: 'yt' | 'local' | null) => void;
  videoId: string | null;
  setVideoId: (id: string | null) => void;
  localAudio: string | null;
  setLocalAudio: (url: string | null) => void;
  volume: number;
}

const LOFI_PRESETS = [
  { id: 'study', label: '1 A.M Study Session', videoId: 'lTRiuFIWV54' },
  { id: 'gaming', label: 'Lofi Video Game Beats', videoId: '5jaT_8hy3Vg' },
  { id: 'sleep', label: 'Beats to Sleep/Chill', videoId: 'DWcJFNfaw9c' },
  { id: 'classic', label: 'Lofi Girl - Essentials', videoId: 'jfKfPfyJRdk' }
];

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  isOpen, onClose, onFrequencyData, isPlaying, setIsPlaying, 
  activeSource, setActiveSource, videoId, setVideoId, localAudio, setLocalAudio,
  volume
}) => {
  const [ytUrl, setYtUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync volume for YouTube
  useEffect(() => {
    if (ytPlayerRef.current && activeSource === 'yt') {
      ytPlayerRef.current.setVolume(volume * 100);
    }
  }, [volume, activeSource]);

  // Sync volume for Local Audio
  useEffect(() => {
    if (audioRef.current && activeSource === 'local') {
      audioRef.current.volume = volume;
    }
  }, [volume, activeSource]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (localAudio && audioRef.current && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      filterRef.current = audioContextRef.current.createBiquadFilter();
      
      // Lofi Low-Pass Filter settings
      filterRef.current.type = 'lowpass';
      filterRef.current.frequency.setValueAtTime(2500, audioContextRef.current.currentTime);
      filterRef.current.Q.setValueAtTime(1, audioContextRef.current.currentTime);

      const source = audioContextRef.current.createMediaElementSource(audioRef.current);
      
      // Chain: Source -> Filter -> Analyser -> Destination
      source.connect(filterRef.current);
      filterRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      analyserRef.current.fftSize = 64;
    }

    if (isPlaying && analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      const update = () => {
        analyserRef.current!.getByteFrequencyData(dataArray);
        onFrequencyData(new Uint8Array(dataArray));
        animationRef.current = requestAnimationFrame(update);
      };
      update();
    } else {
      cancelAnimationFrame(animationRef.current!);
    }
    return () => cancelAnimationFrame(animationRef.current!);
  }, [localAudio, isPlaying]);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleYtSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    
    const id = extractVideoId(ytUrl);
    if (id) {
      setVideoId(id);
      setLocalAudio(null);
      setActiveSource('yt');
      setIsPlaying(true);
      setYtUrl('');
    } else {
      setError('Invalid YouTube link. Please check again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handlePresetSelect = (id: string) => {
    setError(null);
    setVideoId(id);
    setLocalAudio(null);
    setActiveSource('yt');
    setIsPlaying(true);
    setYtUrl('');
  };

  const handleLocalFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoId(null);
      const url = URL.createObjectURL(file);
      setLocalAudio(url);
      setActiveSource('local');
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (activeSource === 'yt' && ytPlayerRef.current) {
      if (isPlaying) ytPlayerRef.current.pauseVideo();
      else ytPlayerRef.current.playVideo();
    } else if (activeSource === 'local' && audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <div className="hidden">
        {videoId && (
          <YouTube 
            videoId={videoId} 
            opts={{ 
              height: '0', 
              width: '0', 
              host: 'https://www.youtube-nocookie.com',
              playerVars: { 
                autoplay: 1,
                origin: window.location.origin
              } 
            }}
            onReady={(e) => ytPlayerRef.current = e.target}
            onPlay={() => { setIsPlaying(true); setActiveSource('yt'); }}
            onPause={() => setIsPlaying(false)}
          />
        )}
        {localAudio && (
          <audio 
            ref={audioRef}
            src={localAudio} 
            autoPlay 
            crossOrigin="anonymous"
            onPlay={() => { setIsPlaying(true); setActiveSource('local'); }}
            onPause={() => setIsPlaying(false)}
          />
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-3xl">
          <div className="boutique-glass w-full max-w-sm p-8 md:p-12 rounded-[3rem] relative border border-white/5 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button onClick={onClose} className="absolute top-6 right-6 md:top-8 md:right-8 opacity-20 hover:opacity-100 transition-opacity">
              <X size={20} />
            </button>

            <div className="flex flex-col items-center gap-2 mb-10">
              <Radio size={24} className="opacity-20 animate-pulse" />
              <h2 className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-30">Soundtrack</h2>
            </div>

            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center justify-between opacity-20">
                  <span className="text-[9px] uppercase tracking-widest font-bold">Radio Stations</span>
                  <Music size={12} />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {LOFI_PRESETS.map(preset => (
                    <button 
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset.videoId)}
                      className={`py-3 px-4 rounded-xl text-[9px] uppercase tracking-widest border transition-all text-center ${videoId === preset.videoId ? 'bg-white text-black border-white boutique-glow-active' : 'bg-white/5 border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 border-t border-white/5 pt-10">
                <div className="flex items-center justify-between opacity-20">
                  <span className="text-[9px] uppercase tracking-widest font-bold">Custom URL</span>
                  <Link size={12} />
                </div>

                <form onSubmit={handleYtSubmit} className="space-y-4">
                  <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 focus-within:border-white/20 transition-colors">
                    <Link size={14} className="opacity-20 mr-3 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Paste YouTube Link (e.g. youtube.com/watch?v=...)" 
                      className="w-full bg-transparent py-4 text-[11px] focus:outline-none placeholder:opacity-10"
                      value={ytUrl}
                      onChange={(e) => {
                        setYtUrl(e.target.value);
                        if (error) setError(null);
                      }}
                    />
                    {ytUrl && (
                      <button 
                        type="submit"
                        className="ml-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-[8px] uppercase tracking-widest font-bold transition-all shrink-0"
                      >
                        Load
                      </button>
                    )}
                  </div>
                  {error && (
                    <div className="text-[8px] text-red-500/60 uppercase tracking-widest text-center animate-pulse">
                      {error}
                    </div>
                  )}
                </form>

                <div className="relative group cursor-pointer">
                  <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={handleLocalFile} 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                  <div className="w-full py-4 border border-dashed border-white/10 rounded-2xl flex items-center justify-center gap-3 opacity-30 group-hover:opacity-60 transition-opacity bg-white/5">
                    <FileAudio size={16} />
                    <span className="text-[9px] uppercase tracking-widest">Upload Local MP3</span>
                  </div>
                </div>

                {(videoId || localAudio) && (
                  <div className="pt-4 flex flex-col items-center gap-6">
                    <div className="w-px h-8 bg-white/10" />
                    <button onClick={togglePlay} className="w-20 h-20 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-90">
                      {isPlaying ? <Pause size={28} className="opacity-60" /> : <Play size={28} className="opacity-60 translate-x-1" />}
                    </button>
                    <span className="text-[9px] uppercase tracking-[0.3em] opacity-20 italic">
                      {activeSource === 'yt' ? 'Streaming from YouTube' : 'Playing Local File'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AudioPlayer;
