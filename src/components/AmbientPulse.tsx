import React from 'react';

interface AmbientPulseProps {
  scale: number;
}

const AmbientPulse: React.FC<AmbientPulseProps> = ({ scale }) => {
  // scale typically goes from 1 to 1.4 based on frequency data
  const pulseOpacity = (scale - 1) * 2; // Map to roughly 0 - 0.8 range
  
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Primary Glow */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full transition-all duration-300 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          transform: `scale(${scale * 1.5})`,
          opacity: 0.2 + pulseOpacity
        }}
      />
      
      {/* Center Soft Light */}
      <div 
        className="absolute w-[300px] h-[300px] rounded-full transition-all duration-500 ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%)',
          transform: `scale(${scale})`,
          opacity: 0.1 + pulseOpacity * 0.5
        }}
      />
    </div>
  );
};

export default AmbientPulse;
