'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useLenis } from 'lenis/react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

/**
 * Canvas-based particle system for the banner.
 * Reads Lenis velocity each frame to influence particle drift.
 * Respects prefers-reduced-motion.
 */
export function BannerParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const animRef = useRef<number>(0);
  const velocityRef = useRef(0);

  // Track Lenis velocity in a ref (outside React render cycle)
  useLenis((lenis: { velocity: number }) => {
    velocityRef.current = lenis.velocity;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    // Theme-aware particle colors
    const getParticleColor = () => {
      if (theme === 'light') return 'rgba(217, 119, 6,';
      if (theme === 'mint') return 'rgba(42, 174, 138,';
      return 'rgba(99, 102, 241,';
    };

    // Create particles
    const count = Math.min(40, Math.floor(w() / 20));
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2 - 0.1,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, w(), h());
      const color = getParticleColor();

      // Velocity influence: fast scroll = particles scatter
      const velocityInfluence = Math.min(Math.abs(velocityRef.current) * 0.002, 0.8);

      for (const p of particles) {
        // Apply velocity to vertical drift
        const vyBoost = velocityRef.current * 0.001;
        p.x += p.vx;
        p.y += p.vy + vyBoost;

        if (p.x < 0) p.x = w();
        if (p.x > w()) p.x = 0;
        if (p.y < 0) p.y = h();
        if (p.y > h()) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${p.opacity})`;
        ctx.fill();
      }

      // Draw connections (thinner when scrolling fast)
      const connectionThreshold = 80 - velocityInfluence * 20;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionThreshold) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `${color}${0.08 * (1 - dist / connectionThreshold)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[1] h-full w-full" />
  );
}
