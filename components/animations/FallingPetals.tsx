import React, { useEffect, useRef } from 'react';

export const FloatingLetters: React.FC<{ count?: number }> = ({ count = 25 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    interface FloatingItem {
      type: 'heart' | 'envelope';
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      swayRange: number;
      swaySpeed: number;
      swayOffset: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      color: string;
      scale: number;
      scaleSpeed: number;
    }

    const envelopeColors = ['#FFFFFF', '#FFF1F2', '#FFE4E6'];
    const heartColors = ['#E11D48', '#F472B6', '#FDA4AF', '#FB7185'];

    const createItem = (initialY?: number): FloatingItem => {
      const type = Math.random() > 0.4 ? 'envelope' : 'heart';
      return {
        type,
        x: Math.random() * width,
        y: initialY ?? (height + 50), // Start off the bottom
        size: type === 'envelope' ? Math.random() * 12 + 10 : Math.random() * 8 + 8, // sizes
        speedY: -(Math.random() * 1.0 + 0.5), // Move upwards
        speedX: (Math.random() - 0.5) * 0.5,
        swayRange: Math.random() * 30 + 10,
        swaySpeed: Math.random() * 0.01 + 0.005,
        swayOffset: Math.random() * Math.PI * 2,
        rotation: (Math.random() - 0.5) * 45, // Mild angle rotation
        rotationSpeed: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3, // Opacity
        color: type === 'envelope' 
          ? envelopeColors[Math.floor(Math.random() * envelopeColors.length)]
          : heartColors[Math.floor(Math.random() * heartColors.length)],
        scale: Math.random() * 0.3 + 0.85,
        scaleSpeed: Math.random() * 0.02
      };
    };

    const items: FloatingItem[] = [];
    // Pre-populate particles across the screen height
    for (let i = 0; i < count; i++) {
      items.push(createItem(Math.random() * (height + 100) - 50));
    }

    let animationFrameId: number;

    const drawHeart = (c: CanvasRenderingContext2D, size: number) => {
      c.beginPath();
      const s = size * 0.8;
      c.moveTo(0, -s * 0.3);
      c.bezierCurveTo(-s * 0.5, -s * 0.8, -s, -s * 0.4, -s, 0);
      c.bezierCurveTo(-s, s * 0.5, -s * 0.2, s * 0.9, 0, s * 1.3);
      c.bezierCurveTo(s * 0.2, s * 0.9, s, s * 0.5, s, 0);
      c.bezierCurveTo(s, -s * 0.4, s * 0.5, -s * 0.8, 0, -s * 0.3);
      c.closePath();
      c.fill();
    };

    const drawEnvelope = (c: CanvasRenderingContext2D, size: number, color: string) => {
      const w = size * 1.5;
      const h = size;

      // Base body
      c.fillStyle = color;
      c.strokeStyle = '#FDA4AF';
      c.lineWidth = 1.5;
      c.beginPath();
      c.roundRect(-w / 2, -h / 2, w, h, 2);
      c.fill();
      c.stroke();

      // Inside flap
      c.fillStyle = '#FFE4E6';
      c.beginPath();
      c.moveTo(-w / 2, -h / 2);
      c.lineTo(0, h / 8);
      c.lineTo(w / 2, -h / 2);
      c.closePath();
      c.fill();
      c.stroke();

      // Tiny heart seal at center
      c.fillStyle = '#E11D48';
      c.beginPath();
      const hs = size * 0.22;
      c.moveTo(0, -hs * 0.3);
      c.bezierCurveTo(-hs * 0.5, -hs * 0.8, -hs, -hs * 0.4, -hs, 0);
      c.bezierCurveTo(-hs, hs * 0.5, -hs * 0.2, hs * 0.9, 0, hs * 1.3);
      c.bezierCurveTo(hs * 0.2, hs * 0.9, hs, hs * 0.5, hs, 0);
      c.bezierCurveTo(hs, -hs * 0.4, hs * 0.5, -hs * 0.8, 0, -hs * 0.3);
      c.closePath();
      c.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      items.forEach((p, i) => {
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.swayOffset += p.swaySpeed;

        const currentX = p.x + Math.sin(p.swayOffset) * p.swayRange;

        // Reset if floats off the top
        if (p.y < -50) {
          items[i] = createItem();
        }

        ctx.save();

        // Calculate fade-in at bottom and fade-out at top
        let currentOpacity = p.opacity;
        if (p.y < 100) {
          currentOpacity = Math.max(0, p.opacity * (p.y / 100));
        } else if (p.y > height - 100) {
          currentOpacity = Math.max(0, p.opacity * ((height - p.y) / 100));
        }

        ctx.globalAlpha = currentOpacity;

        // Draw item
        ctx.translate(currentX, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.scale(p.scale, p.scale);

        if (p.type === 'heart') {
          ctx.fillStyle = p.color;
          drawHeart(ctx, p.size);
        } else {
          drawEnvelope(ctx, p.size, p.color);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none w-full h-full z-20" />;
};