import React, { useEffect, useRef } from 'react';
import type { ParticleMode } from '../types';

interface Particle {
  x: number;
  y: number;
  size: number;
  baseX: number;
  baseY: number;
  density: number;
  color: string;
  vx: number;
  vy: number;
  angle: number;
  distance: number;
}

interface ParticleCanvasProps {
  mode: ParticleMode;
  speed: number;
  count: number;
  frequencyData: Uint8Array;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ mode, speed, count, frequencyData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0, radius: 200 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const getAudioScale = () => {
      const sum = frequencyData.reduce((a, b) => a + b, 0);
      const avg = sum / (frequencyData.length || 1);
      return avg / 255; // 0 to 1
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      particles = [];
      const particleCount = (canvas.width * canvas.height) / (8000 / count);
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const distance = Math.random() * Math.max(canvas.width, canvas.height);
        
        let color = 'rgba(255, 255, 255, 0.1)';
        let size = Math.random() * 1.5 + 0.5;

        if (mode === 'sakura') {
          color = `rgba(255, ${180 + Math.random() * 40}, ${200 + Math.random() * 30}, ${0.2 + Math.random() * 0.2})`;
          size = Math.random() * 4 + 2;
        } else if (mode === 'fireflies') {
          color = `rgba(255, 255, ${150 + Math.random() * 105}, ${0.3 + Math.random() * 0.4})`;
          size = Math.random() * 2 + 1;
        } else if (mode === 'dust') {
          color = `rgba(255, 255, 255, ${Math.random() * 0.15})`;
          size = Math.random() * 1.5 + 0.5;
        } else if (mode === 'rain') {
          color = 'rgba(255, 255, 255, 0.15)';
          size = Math.random() * 1 + 0.5;
        }

        particles.push({
          x, y, baseX: x, baseY: y,
          size,
          density: (Math.random() * 10) + 1,
          color,
          vx: mode === 'rain' ? 0 : (Math.random() - 0.5) * speed,
          vy: mode === 'rain' ? (Math.random() * 10 + 5) * speed : (Math.random() - 0.5) * speed,
          angle: Math.random() * Math.PI * 2,
          distance
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const audioScale = getAudioScale();
      const reactiveSpeed = speed * (1 + audioScale * 2);
      
      if (mode === 'grain') {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const val = Math.random() * 255;
          data[i] = val;
          data[i+1] = val;
          data[i+2] = val;
          data[i+3] = (10 + audioScale * 40) * speed;
        }
        ctx.putImageData(imageData, 0, 0);
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        if (mode === 'sakura') {
          p.x += (Math.sin(p.angle) + 1) * reactiveSpeed;
          p.y += (Math.cos(p.angle) + 2) * reactiveSpeed;
          p.angle += 0.01;
        } else if (mode === 'rain') {
          p.y += p.vy * (1 + audioScale);
          p.x += Math.sin(Date.now() * 0.001) * 0.5;
        } else if (mode === 'fireflies') {
          p.x += Math.sin(Date.now() * 0.001 + i) * reactiveSpeed;
          p.y += Math.cos(Date.now() * 0.001 + i) * reactiveSpeed;
          p.size = (Math.sin(Date.now() * 0.005 + i) + 1) * (1.5 + audioScale * 2);
        } else if (mode === 'dust') {
          p.x += p.vx * 0.2 * (1 + audioScale * 3);
          p.y += p.vy * 0.2 * (1 + audioScale * 3);
        } else {
          p.x += p.vx * 0.5 * (1 + audioScale);
          p.y += p.vy * 0.5 * (1 + audioScale);
        }

        // Wrap around
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (mode === 'sakura') {
          // Draw petal shape
          ctx.ellipse(p.x, p.y, p.size, p.size / 2, p.angle, 0, Math.PI * 2);
        } else if (mode === 'rain') {
          ctx.rect(p.x, p.y, 1, p.size * 20);
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fill();
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    });

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, speed, count]);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1]" />
  );
};

export default ParticleCanvas;
