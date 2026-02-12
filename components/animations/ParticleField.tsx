import React, { useEffect, useRef } from 'react';

const PI2 = Math.PI * 2;

export const ParticleField: React.FC<{ count?: number }> = ({ count = 30 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId: number;

    interface Particle {
      type: 'heart' | 'petal';
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      swing: number;
      swingStep: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = ['#FDA4AF', '#FECDD3', '#F43F5E', '#FFFFFF']; // Pink, Light Pink, Rose, White

    const createParticle = (resetY?: boolean): Particle => {
      const type = Math.random() > 0.6 ? 'heart' : 'petal';
      return {
        type,
        x: Math.random() * width,
        y: resetY
          ? (type === 'heart' ? height + 50 : -50)
          : Math.random() * height,
        size: type === 'heart' ? Math.random() * 15 + 10 : Math.random() * 8 + 5,
        speedY: type === 'heart' ? Math.random() * 0.5 + 0.2 : Math.random() * 1 + 0.5,
        speedX: 0,
        opacity: Math.random() * 0.5 + 0.3,
        swing: Math.random() * Math.PI * 2,
        swingStep: Math.random() * 0.02 + 0.005,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    };

    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }

    // Optimized Draw Functions
    const drawHeart = (x: number, y: number, size: number, opacity: number) => {
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      // Simplified Heart
      const s = size / 2;
      ctx.moveTo(x, y + s * 0.3);
      ctx.bezierCurveTo(x, y, x - s, y, x - s, y + s * 0.3);
      ctx.bezierCurveTo(x - s, y + s * 1.3, x, y + s * 1.6, x, y + s * 2);
      ctx.bezierCurveTo(x, y + s * 1.6, x + s, y + s * 1.3, x + s, y + s * 0.3);
      ctx.bezierCurveTo(x + s, y, x, y, x, y + s * 0.3);
      ctx.fill();
    };

    const drawPetal = (x: number, y: number, size: number, rotation: number, color: string, opacity: number) => {
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, size / 2, size, rotation, 0, PI2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        if (p.type === 'heart') {
          p.y -= p.speedY;
          p.swing += p.swingStep;
          p.x += Math.sin(p.swing) * 0.5;
        } else {
          // Petal physics (fall down)
          p.y += p.speedY;
          p.rotation += p.rotationSpeed;
          p.swing += p.swingStep;
          p.x += Math.sin(p.swing) * 1;
        }

        // Draw based on type
        if (p.type === 'heart') {
          drawHeart(p.x, p.y, p.size, p.opacity);
        } else {
          drawPetal(p.x, p.y, p.size, p.rotation, p.color, p.opacity);
        }

        // Reset if out of view
        const isHeart = p.type === 'heart';
        const isOut = isHeart ? p.y < -50 : p.y > height + 50;

        if (isOut) {
          particles[i] = createParticle(true);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none w-full h-full z-0 opacity-60" />;
};