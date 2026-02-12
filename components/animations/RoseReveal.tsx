import React, { useEffect, useRef, useState } from 'react';

interface RoseRevealProps {
  src: string;
  alt: string;
  className?: string;
}

export const RoseReveal: React.FC<RoseRevealProps> = ({ src, alt, className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  // Load Image
  useEffect(() => {
    const img = new Image();
    // Set crossOrigin BEFORE src to ensure it's respected
    img.crossOrigin = "Anonymous";
    img.onload = () => setImage(img);
    img.onerror = (e) => console.error("Failed to load rose image", e);
    img.src = src;
  }, [src]);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = performance.now();

    const drawPetal = (ctx: CanvasRenderingContext2D, scale: number, rotation: number) => {
        ctx.save();
        ctx.rotate(rotation * Math.PI / 180);
        ctx.scale(scale, scale);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Petal shape curve
        ctx.bezierCurveTo(-10, -10, -25, -25, 0, -45);
        ctx.bezierCurveTo(25, -25, 10, -10, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    };

    const render = (now: number) => {
      const progress = (now - startTime) / 1000; // seconds

      // Handle Canvas Resize
      const width = canvas.parentElement?.offsetWidth || 300;
      const height = canvas.parentElement?.offsetHeight || 300;
      
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // --- 1. Draw Mask Shapes (The Bloom) ---
      // We draw opaque shapes on a transparent canvas.
      ctx.save();
      const cx = width / 2;
      const cy = height / 2;
      ctx.translate(cx, cy);
      ctx.fillStyle = '#000000'; // Color doesn't matter for masking, opacity does
      
      // Calculate generic scale based on screen size
      const maxDim = Math.max(width, height);
      // Base scale: 45 units (petal length) should eventually cover half the screen + margin
      const baseScale = (maxDim / 2) / 35; 

      // Layer 1 (Inner)
      [0, 120, 240].forEach((angle, i) => {
         const delay = 0.2 + (i * 0.1);
         let p = Math.max(0, progress - delay);
         let scale = Math.min(1, p * 1.5); // Speed
         // Ease Out Cubic
         scale = 1 - Math.pow(1 - scale, 3);
         if (scale > 0) drawPetal(ctx, scale * baseScale * 0.5, angle);
      });

      // Layer 2 (Mid)
       [0, 72, 144, 216, 288].forEach((angle, i) => {
         const delay = 0.6 + (i * 0.1);
         let p = Math.max(0, progress - delay);
         let scale = Math.min(1, p * 1.2); 
         scale = 1 - Math.pow(1 - scale, 3);
         if (scale > 0) drawPetal(ctx, scale * baseScale * 0.8, angle + 36);
      });

      // Layer 3 (Outer)
       [0, 45, 90, 135, 180, 225, 270, 315].forEach((angle, i) => {
         const delay = 0.9 + (i * 0.05);
         let p = Math.max(0, progress - delay);
         let scale = Math.min(1, p * 1.0); 
         scale = 1 - Math.pow(1 - scale, 3);
         if (scale > 0) drawPetal(ctx, scale * baseScale * 1.3, angle);
      });
      
      // Final Expansion Circle to clear edges
      const circleDelay = 1.8;
      let cp = Math.max(0, progress - circleDelay);
      if (cp > 0) {
          let r = cp * maxDim * 1.2; 
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
      }
      ctx.restore();

      // --- 2. Composite Image ---
      // This tells the canvas to keep only the parts of the source (the image we are about to draw)
      // that overlap with the destination (the petals we just drew).
      ctx.globalCompositeOperation = 'source-in';
      
      // Calculate Object Fit: Cover
      const imgRatio = image.width / image.height;
      const canvasRatio = width / height;
      let drawW, drawH, offsetX, offsetY;

      if (canvasRatio > imgRatio) {
        drawW = width;
        drawH = width / imgRatio;
        offsetX = 0;
        offsetY = (height - drawH) / 2;
      } else {
        drawH = height;
        drawW = height * imgRatio;
        offsetX = (width - drawW) / 2;
        offsetY = 0;
      }
      
      ctx.drawImage(image, offsetX, offsetY, drawW, drawH);
      
      // Reset composite operation for next frame
      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [image]);

  return (
    <div className={`relative w-full h-full bg-dark/5 overflow-hidden ${className}`}>
        {/* Loading State */}
        {!image && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
             <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};