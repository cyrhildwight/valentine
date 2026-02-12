import React, { useEffect, useRef } from 'react';

export const ParticleField: React.FC<{ count?: number }> = ({ count = 50 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

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

    const createParticle = (): Particle => {
      const type = Math.random() > 0.6 ? 'heart' : 'petal';
      return {
        type,
        x: Math.random() * width,
        y: Math.random() * height,
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

    // Heart shape helper
    const drawHeart = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = '#E11D48';
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(x, y + topCurveHeight);
      ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size * 0.8) + topCurveHeight, x, y + size);
      ctx.bezierCurveTo(x, y + (size * 0.8) + topCurveHeight, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
      ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
      ctx.fill();
      ctx.restore();
    };

    // Petal shape helper
    const drawPetal = (x: number, y: number, size: number, rotation: number, color: string, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      // Simple oval petal
      ctx.ellipse(0, 0, size / 2, size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let animationFrameId: number;

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
          p.x += Math.sin(p.swing) * 1; // More sway for petals
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
          particles[i] = createParticle();
          // Reset position based on type
          if (particles[i].type === 'heart') {
            particles[i].y = height + 50;
          } else {
            particles[i].y = -50;
          }
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