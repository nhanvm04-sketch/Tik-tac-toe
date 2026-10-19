import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'rect' | 'circle' | 'ribbon';
}

interface ConfettiProps {
  active: boolean;
  winnerColor?: 'cyan' | 'amber' | 'emerald';
}

export const ConfettiCanvas: React.FC<ConfettiProps> = ({ active, winnerColor = 'cyan' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors =
      winnerColor === 'cyan'
        ? ['#06b6d4', '#22d3ee', '#38bdf8', '#60a5fa', '#a855f7', '#ffffff']
        : winnerColor === 'amber'
        ? ['#f59e0b', '#fbbf24', '#f97316', '#fb7185', '#ec4899', '#ffffff']
        : ['#10b981', '#34d399', '#6ee7b7', '#3b82f6', '#f59e0b', '#ffffff'];

    const particles: Particle[] = [];
    const count = Math.min(120, Math.floor(width / 8));

    // Spawn burst from top center / dual bursts
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI) - Math.PI / 2; // fan upwards
      const speed = 7 + Math.random() * 12;
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 100,
        y: height * 0.45 + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1) * 0.8,
        vy: -Math.abs(Math.sin(angle) * speed) - 4,
        size: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.18,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : Math.random() > 0.5 ? 'circle' : 'ribbon',
      });
    }

    let start = performance.now();

    const loop = (time: number) => {
      const elapsed = (time - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.985; // air drag
        p.rotation += p.rotationSpeed;

        if (elapsed > 1.8) {
          p.opacity = Math.max(0, p.opacity - 0.02);
        }

        if (p.opacity > 0 && p.y < height + 50) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(-p.size * 0.7, -p.size * 0.25, p.size * 1.4, p.size * 0.5);
          }
          ctx.restore();
        }
      }

      if (alive && elapsed < 4) {
        animId = requestAnimationFrame(loop);
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, winnerColor]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 w-full h-full"
    />
  );
};
