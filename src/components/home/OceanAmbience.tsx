import { useEffect, useRef, useMemo } from "react";

export function OceanAmbience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random bubbles for layered CSS animation
  const bubbles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 14) + 6, // 6px to 20px
      left: Math.floor(Math.random() * 96) + 2, // 2% to 98%
      delay: (Math.random() * 12).toFixed(2),
      duration: (Math.random() * 10 + 10).toFixed(2), // 10s to 20s
      opacity: (Math.random() * 0.4 + 0.2).toFixed(2),
    }));
  }, []);

  // Living Coral Reef & Swimming Marine Fauna Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Schooling Fish Class
    class School {
      fishes: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        phase: number;
        color: string;
      }>;

      constructor(count: number, color: string, size: number, speed: number, yRange: [number, number]) {
        this.fishes = [];
        for (let i = 0; i < count; i++) {
          this.fishes.push({
            x: Math.random() * (width || 1200),
            y: (height || 800) * yRange[0] + Math.random() * ((height || 800) * (yRange[1] - yRange[0])),
            vx: speed * (0.8 + Math.random() * 0.4),
            vy: (Math.random() - 0.5) * 0.4,
            size: size * (0.85 + Math.random() * 0.3),
            phase: Math.random() * Math.PI * 2,
            color,
          });
        }
      }

      update(time: number) {
        for (const f of this.fishes) {
          f.x += f.vx;
          f.y += Math.sin(time * 0.003 + f.phase) * 0.45;
          if (f.x > width + 40) f.x = -40;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        for (const f of this.fishes) {
          c.save();
          c.translate(f.x, f.y);
          c.fillStyle = f.color;
          // Sleek aquatic fish body
          c.beginPath();
          c.moveTo(f.size * 2, 0);
          c.quadraticCurveTo(0, -f.size, -f.size * 1.8, 0);
          c.quadraticCurveTo(0, f.size, f.size * 2, 0);
          c.fill();
          // Animated tail fin
          const tailWiggle = Math.sin(f.phase + f.x * 0.08) * 3.5;
          c.beginPath();
          c.moveTo(-f.size * 1.6, 0);
          c.lineTo(-f.size * 2.8, -f.size * 0.8 + tailWiggle);
          c.lineTo(-f.size * 2.4, tailWiggle * 0.5);
          c.lineTo(-f.size * 2.8, f.size * 0.8 + tailWiggle);
          c.closePath();
          c.fill();
          c.restore();
        }
      }
    }

    // Sea Turtle (Paddles across mid-depth)
    const turtle = {
      x: -120,
      y: (height || 800) * 0.42,
      vx: 0.38,
      draw(c: CanvasRenderingContext2D, time: number) {
        this.x += this.vx;
        if (this.x > width + 140) this.x = -140;
        const flap = Math.sin(time * 0.002) * 0.35;
        c.save();
        c.translate(this.x, this.y + Math.sin(time * 0.0015) * 8);
        c.scale(0.75, 0.75);

        // Shell
        c.fillStyle = "rgba(14, 116, 144, 0.45)";
        c.beginPath();
        c.ellipse(0, 0, 36, 26, 0, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = "rgba(56, 189, 248, 0.25)";
        c.lineWidth = 1.5;
        c.stroke();

        // Flippers
        c.fillStyle = "rgba(6, 182, 212, 0.35)";
        // Front Right flipper
        c.save();
        c.translate(14, -18);
        c.rotate(-0.4 + flap);
        c.beginPath();
        c.ellipse(12, -4, 22, 7, 0.4, 0, Math.PI * 2);
        c.fill();
        c.restore();
        // Front Left flipper
        c.save();
        c.translate(14, 18);
        c.rotate(0.4 - flap);
        c.beginPath();
        c.ellipse(12, 4, 22, 7, -0.4, 0, Math.PI * 2);
        c.fill();
        c.restore();
        // Head
        c.beginPath();
        c.ellipse(44, 0, 10, 7, 0, 0, Math.PI * 2);
        c.fill();
        c.restore();
      },
    };

    // Manta Ray (Glides in upper water column)
    const manta = {
      x: (width || 1200) + 180,
      y: (height || 800) * 0.26,
      vx: -0.55,
      draw(c: CanvasRenderingContext2D, time: number) {
        this.x += this.vx;
        if (this.x < -200) this.x = width + 200;
        const wingWave = Math.sin(time * 0.0025) * 10;
        c.save();
        c.translate(this.x, this.y);
        c.fillStyle = "rgba(8, 47, 73, 0.40)";
        c.strokeStyle = "rgba(56, 189, 248, 0.20)";
        c.beginPath();
        c.moveTo(-45, 0);
        c.quadraticCurveTo(0, -45 + wingWave, 35, -5);
        c.lineTo(75, 0);
        c.lineTo(35, 5);
        c.quadraticCurveTo(0, 45 - wingWave, -45, 0);
        c.fill();
        c.stroke();
        // Tail
        c.beginPath();
        c.moveTo(75, 0);
        c.quadraticCurveTo(110, Math.sin(time * 0.003) * 6, 150, 0);
        c.lineWidth = 1;
        c.stroke();
        c.restore();
      },
    };

    // Living Coral Silhouettes at Bottom of Viewport
    const drawCorals = (c: CanvasRenderingContext2D, time: number) => {
      const coralBaseY = height;
      c.save();

      // Left Coral Mounds
      const g1 = c.createLinearGradient(0, coralBaseY - 140, 0, coralBaseY);
      g1.addColorStop(0, "rgba(14, 116, 144, 0.25)");
      g1.addColorStop(1, "rgba(2, 6, 23, 0.85)");
      c.fillStyle = g1;
      c.beginPath();
      c.moveTo(0, coralBaseY);
      c.lineTo(0, coralBaseY - 100);
      c.quadraticCurveTo(width * 0.08, coralBaseY - 150, width * 0.16, coralBaseY - 80);
      c.quadraticCurveTo(width * 0.24, coralBaseY - 130, width * 0.32, coralBaseY - 60);
      c.quadraticCurveTo(width * 0.40, coralBaseY - 90, width * 0.46, coralBaseY);
      c.closePath();
      c.fill();

      // Right Coral Mounds
      const g2 = c.createLinearGradient(0, coralBaseY - 160, 0, coralBaseY);
      g2.addColorStop(0, "rgba(99, 102, 241, 0.20)");
      g2.addColorStop(1, "rgba(2, 6, 23, 0.85)");
      c.fillStyle = g2;
      c.beginPath();
      c.moveTo(width, coralBaseY);
      c.lineTo(width, coralBaseY - 120);
      c.quadraticCurveTo(width * 0.90, coralBaseY - 170, width * 0.80, coralBaseY - 90);
      c.quadraticCurveTo(width * 0.72, coralBaseY - 130, width * 0.62, coralBaseY - 60);
      c.quadraticCurveTo(width * 0.54, coralBaseY - 100, width * 0.48, coralBaseY);
      c.closePath();
      c.fill();

      // Swaying Sea Anemones with Glowing Polyps
      c.lineWidth = 1.8;
      const anemoneColors = [
        "rgba(244, 63, 94, 0.45)",
        "rgba(251, 191, 36, 0.45)",
        "rgba(56, 189, 248, 0.45)",
      ];
      for (let i = 0; i < 14; i++) {
        const ax = i * (width / 14) + Math.sin(i * 8) * 15;
        const sway = Math.sin(time * 0.002 + i) * 10;
        c.strokeStyle = anemoneColors[i % anemoneColors.length];
        c.beginPath();
        c.moveTo(ax, coralBaseY - 5);
        c.quadraticCurveTo(ax + sway * 0.5, coralBaseY - 35, ax + sway, coralBaseY - 65);
        c.stroke();
        c.fillStyle = c.strokeStyle;
        c.beginPath();
        c.arc(ax + sway, coralBaseY - 65, 2, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    };

    // Volumetric Surface God Rays
    const drawSunbeams = (c: CanvasRenderingContext2D, time: number) => {
      c.save();
      c.globalCompositeOperation = "screen";
      for (let i = 0; i < 5; i++) {
        const beamX = width * 0.5 + Math.sin(time * 0.0006 + i * 1.4) * (width * 0.3);
        const g = c.createLinearGradient(width * 0.5, 0, beamX, height);
        g.addColorStop(0, "rgba(186, 230, 253, 0.08)");
        g.addColorStop(0.5, "rgba(56, 189, 248, 0.03)");
        g.addColorStop(1, "rgba(56, 189, 248, 0)");
        c.fillStyle = g;
        c.beginPath();
        c.moveTo(width * 0.5 - 15, 0);
        c.lineTo(width * 0.5 + 15, 0);
        c.lineTo(beamX + 90, height);
        c.lineTo(beamX - 90, height);
        c.closePath();
        c.fill();
      }
      c.restore();
    };

    const schoolGold = new School(12, "rgba(251, 191, 36, 0.65)", 3.2, 0.9, [0.3, 0.65]);
    const schoolCyan = new School(16, "rgba(56, 189, 248, 0.60)", 2.8, 1.2, [0.45, 0.8]);

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      drawSunbeams(ctx, time);
      manta.draw(ctx, time);
      turtle.draw(ctx, time);
      schoolGold.update(time);
      schoolGold.draw(ctx);
      schoolCyan.update(time);
      schoolCyan.draw(ctx);
      drawCorals(ctx, time);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Interactive Living Ocean Canvas (Fish, Sea Turtle, Manta Ray, Corals, Sunbeams) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
        aria-hidden="true"
      />

      {/* Sunlight Caustic Shimmer in Upper Sunlight Zone */}
      <div className="absolute -top-32 left-0 right-0 h-[480px] bg-gradient-to-b from-sky-500/20 via-cyan-400/10 to-transparent blur-3xl animate-caustic pointer-events-none" />
      <div className="absolute -top-20 left-1/4 w-3/4 h-[400px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Deep Ocean Ambient Gradients */}
      <div className="absolute top-[800px] -left-40 w-96 h-96 bg-sky-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[1600px] -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[2400px] left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Floating Animated Bubbles */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full border border-cyan-300/40 bg-gradient-to-tr from-cyan-400/20 to-white/40 shadow-sm backdrop-blur-[1px]"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            opacity: b.opacity,
            animation: `bubble-rise ${b.duration}s cubic-bezier(0.4, 0, 0.2, 1) ${b.delay}s infinite`,
          }}
        >
          <div className="absolute top-1 left-1 size-1 rounded-full bg-white/70" />
        </div>
      ))}
    </div>
  );
}
