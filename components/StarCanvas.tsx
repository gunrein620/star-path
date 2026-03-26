"use client";
import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  pulseOffset: number;
  pulseSpeed: number;
}

const PARTICLE_COLORS = ["#F0D090", "#C8AA7E", "#C77DFF", "#ffffff", "#E0AAFF", "#9D4EDD", "#FFF5CC"];

function draw4Star(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  rotation: number
) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i / 8) * Math.PI * 2 + rotation;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export default function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initStars = () => {
      const count = Math.min(Math.max(Math.floor((canvas.width * canvas.height) / 3500), 80), 260);
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.2 + 0.3,
        alpha: Math.random() * 0.65 + 0.2,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 2 + 0.5,
      }));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = time * 0.001;

      starsRef.current.forEach((star) => {
        const pulse = Math.sin(t * star.pulseSpeed + star.pulseOffset) * 0.5 + 0.5;
        const alpha = star.alpha * (0.2 + pulse * 0.8);
        const size = star.size * (0.85 + pulse * 0.3);

        if (star.size > 1.2) {
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, size * 5);
          gradient.addColorStop(0, `rgba(255, 245, 220, ${alpha * 0.7})`);
          gradient.addColorStop(1, "rgba(255, 245, 220, 0)");
          ctx.beginPath();
          ctx.arc(star.x, star.y, size * 5, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          if (star.size > 1.6) {
            const len = size * 6;
            ctx.save();
            ctx.strokeStyle = `rgba(255, 248, 230, ${alpha * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(star.x - len, star.y);
            ctx.lineTo(star.x + len, star.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(star.x, star.y - len * 0.7);
            ctx.lineTo(star.x, star.y + len * 0.7);
            ctx.stroke();
            ctx.restore();
          }
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 250, 240, ${alpha})`;
        ctx.fill();
      });

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      if (mx > 0 && my > 0 && time - lastSpawnRef.current > 22) {
        lastSpawnRef.current = time;
        const count = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: mx + (Math.random() - 0.5) * 10,
            y: my + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 2.2,
            vy: (Math.random() - 0.5) * 1.8 - 1.2,
            alpha: 0.95,
            size: Math.random() * 5.5 + 2,
            color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.14,
          });
        }
        if (particlesRef.current.length > 140) {
          particlesRef.current = particlesRef.current.slice(-140);
        }
      }

      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0.02);
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.055;
        p.alpha *= 0.93;
        p.rotation += p.rotationSpeed;
        p.size *= 0.977;

        ctx.save();
        ctx.globalAlpha = p.alpha;

        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 5;
        draw4Star(ctx, p.x, p.y, p.size, p.size * 0.33, p.rotation);
        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.shadowBlur = 0;
        draw4Star(ctx, p.x, p.y, p.size * 0.42, p.size * 0.1, p.rotation);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.restore();
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
