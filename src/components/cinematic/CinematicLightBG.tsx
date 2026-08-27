import { useEffect, useRef } from "react";

/**
 * Cinematic animated light shader - large soft moving lights
 * Re-engineered from heavy Three.js WebGL to a high-performance 2D Canvas
 * to eliminate initial loading weight. Runs at 60 FPS on both mobile and desktop.
 */
const CinematicLightBG = ({ accentColor = "#E8B4B8" }: { accentColor?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Helper to convert hex string to RGB object
    const hexToRgb = (hex: string) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : { r: 232, g: 180, b: 184 };
    };

    const rgb = hexToRgb(accentColor);

    // Create a 128x128 static noise pattern canvas once for performance
    const noiseCanvas = document.createElement("canvas");
    noiseCanvas.width = 128;
    noiseCanvas.height = 128;
    const noiseCtx = noiseCanvas.getContext("2d");
    if (noiseCtx) {
      const imgData = noiseCtx.createImageData(128, 128);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const pixel = i / 4;
        const val = (pixel * 37 + Math.floor(pixel / 128) * 17) % 255;
        imgData.data[i] = val;     // R
        imgData.data[i + 1] = val; // G
        imgData.data[i + 2] = val; // B
        imgData.data[i + 3] = 12;  // Alpha (very subtle grain overlay, ~4.7% opacity)
      }
      noiseCtx.putImageData(imgData, 0, 0);
    }
    const noisePattern = ctx.createPattern(noiseCanvas, "repeat");

    const render = (time: number) => {
      const t = time * 0.0006; // Time factor (calibrated for slow, organic movement)
      ctx.clearRect(0, 0, width, height);

      // Draw the moving light balls using screen composite operation
      ctx.globalCompositeOperation = "screen";

      // Simple pulsing intensity factor
      const pulse = 1.0 + 0.1 * Math.sin(t * 3.0);
      const maxRadius = Math.min(width, height) * 0.55;

      // Radial Light Ball 1
      const x1 = (0.3 + 0.2 * Math.sin(t * 1.2)) * width;
      const y1 = (0.4 + 0.2 * Math.cos(t)) * height;
      const r1 = maxRadius * pulse;
      const grad1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1);
      grad1.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.55 * 1.1})`);
      grad1.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.2})`);
      grad1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Radial Light Ball 2
      const x2 = (0.7 + 0.2 * Math.cos(t * 0.9)) * width;
      const y2 = (0.6 + 0.15 * Math.sin(t * 1.3)) * height;
      const r2 = maxRadius * 0.9 * pulse;
      const grad2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2);
      grad2.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.5 * 1.1})`);
      grad2.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.18})`);
      grad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // Radial Light Ball 3
      const x3 = (0.5 + 0.3 * Math.sin(t * 0.6)) * width;
      const y3 = (0.2 + 0.2 * Math.cos(t * 0.7)) * height;
      const r3 = maxRadius * 0.8 * pulse;
      const grad3 = ctx.createRadialGradient(x3, y3, 0, x3, y3, r3);
      grad3.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.45 * 1.1})`);
      grad3.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.15})`);
      grad3.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle noise grain overlay
      if (noisePattern) {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = noisePattern;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [accentColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[1] w-full h-full"
      style={{ mixBlendMode: "screen", opacity: 0.95 }}
    />
  );
};

export default CinematicLightBG;
