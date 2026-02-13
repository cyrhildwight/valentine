import React, { useEffect, useRef } from 'react';

export const FallingPetals: React.FC<{ count?: number }> = ({ count = 50 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    interface Petal {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      color: string;
      flip: number;
      flipSpeed: number;
    }

    // Deep rose, soft pink, champagne/pale, white
    const colors = ['#E11D48', '#F472B6', '#FBCFE8', '#FFF1F2'];

    const createPetal = (initialY?: number): Petal => ({
      x: Math.random() * width,
      y: initialY ?? -20,
      size: Math.random() * 6 + 6, // 6-12px
      speedY: Math.random() * 1.5 + 0.8,
      speedX: (Math.random() - 0.5) * 1.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.4 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      flip: Math.random() * Math.PI,
      flipSpeed: Math.random() * 0.03 + 0.01
    });

    const petals: Petal[] = [];
    // Pre-populate particles across the screen height so it doesn't start empty
    for (let i = 0; i < count; i++) {
      petals.push(createPetal(Math.random() * height));
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p, i) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.005) * 0.5 + p.speedX; // Gentle sway
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        // Reset if falls off bottom
        if (p.y > height + 20) {
          petals[i] = createPetal();
        }

        ctx.save();

        // Calculate dynamic opacity for fade out at bottom (last 150px)
        const fadeStart = height - 150;
        let currentOpacity = p.opacity;
        if (p.y > fadeStart) {
          const fadeProgress = (p.y - fadeStart) / 150;
          currentOpacity = Math.max(0, p.opacity * (1 - fadeProgress));
        }

        ctx.globalAlpha = currentOpacity;
        ctx.fillStyle = p.color;

        // Move to position
        ctx.translate(p.x, p.y);
        // Rotate in 2D
        ctx.rotate(p.rotation * Math.PI / 180);
        // Simulate 3D flip
        ctx.scale(1, Math.abs(Math.cos(p.flip)));

        // Draw Petal Shape
        ctx.beginPath();
        ctx.moveTo(0, -p.size); // Top tip
        ctx.bezierCurveTo(p.size * 0.5, -p.size * 0.5, p.size * 0.5, p.size * 0.5, 0, p.size); // Right curve
        ctx.bezierCurveTo(-p.size * 0.5, p.size * 0.5, -p.size * 0.5, -p.size * 0.5, 0, -p.size); // Left curve
        ctx.fill();

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