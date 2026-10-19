import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";

export function NeuralOceanHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 1. Reduced Motion Sync
    const q = window.matchMedia && window.matchMedia("(prefers-reduced-motion:reduce)");
    const v = videoRef.current;
    let reduced = false;

    const syncMotion = () => {
      if (q && q.matches) {
        reduced = true;
        if (v) v.pause();
      } else {
        reduced = false;
        if (v) {
          const p = v.play();
          if (p) p.catch(() => {});
        }
      }
    };
    syncMotion();
    if (q) {
      if (q.addEventListener) q.addEventListener("change", syncMotion);
      else q.addListener(syncMotion);
    }

    // 2. Entrance Retirement Listener
    const f = document.getElementById("foot2");
    const done = () => {
      clearTimeout(timer);
      if (f) f.removeEventListener("animationend", done);
      document.documentElement.classList.add("is-entered");
    };
    const timer = setTimeout(done, 4000);
    if (f) f.addEventListener("animationend", done);

    // 3. Living Coral Reef & Marine Wildlife 60fps Canvas Simulation
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

    // Tropical Fish Class
    class FishSchool {
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
          c.beginPath();
          c.moveTo(f.size * 2, 0);
          c.quadraticCurveTo(0, -f.size, -f.size * 1.8, 0);
          c.quadraticCurveTo(0, f.size, f.size * 2, 0);
          c.fill();

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

    // Sea Turtle
    const turtle = {
      x: -120,
      y: (height || 800) * 0.40,
      vx: 0.38,
      draw(c: CanvasRenderingContext2D, time: number) {
        this.x += this.vx;
        if (this.x > width + 140) this.x = -140;
        const flap = Math.sin(time * 0.002) * 0.35;
        c.save();
        c.translate(this.x, this.y + Math.sin(time * 0.0015) * 8);
        c.scale(0.85, 0.85);

        // Shell
        c.fillStyle = "rgba(15, 76, 92, 0.65)";
        c.beginPath();
        c.ellipse(0, 0, 36, 26, 0, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = "rgba(56, 189, 248, 0.35)";
        c.lineWidth = 1.5;
        c.stroke();

        // Flippers
        c.fillStyle = "rgba(20, 90, 110, 0.55)";
        c.save();
        c.translate(14, -18);
        c.rotate(-0.4 + flap);
        c.beginPath();
        c.ellipse(12, -4, 22, 7, 0.4, 0, Math.PI * 2);
        c.fill();
        c.restore();

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

    // Manta Ray
    const manta = {
      x: (width || 1200) + 180,
      y: (height || 800) * 0.24,
      vx: -0.65,
      draw(c: CanvasRenderingContext2D, time: number) {
        this.x += this.vx;
        if (this.x < -200) this.x = width + 200;
        const wingWave = Math.sin(time * 0.0025) * 12;
        c.save();
        c.translate(this.x, this.y);
        c.fillStyle = "rgba(8, 47, 73, 0.55)";
        c.strokeStyle = "rgba(56, 189, 248, 0.25)";
        c.beginPath();
        c.moveTo(-45, 0);
        c.quadraticCurveTo(0, -50 + wingWave, 35, -5);
        c.lineTo(75, 0);
        c.lineTo(35, 5);
        c.quadraticCurveTo(0, 50 - wingWave, -45, 0);
        c.fill();
        c.stroke();

        // Tail
        c.beginPath();
        c.moveTo(75, 0);
        c.quadraticCurveTo(110, Math.sin(time * 0.003) * 6, 160, 0);
        c.lineWidth = 1.2;
        c.stroke();
        c.restore();
      },
    };

    // Living Corals at the Seabed
    const drawCorals = (c: CanvasRenderingContext2D, time: number) => {
      const coralBaseY = height;
      c.save();

      // Left Coral Mounds
      const g1 = c.createLinearGradient(0, coralBaseY - 180, 0, coralBaseY);
      g1.addColorStop(0, "rgba(14, 116, 144, 0.40)");
      g1.addColorStop(1, "rgba(2, 6, 15, 0.95)");
      c.fillStyle = g1;
      c.beginPath();
      c.moveTo(0, coralBaseY);
      c.lineTo(0, coralBaseY - 140);
      c.quadraticCurveTo(width * 0.08, coralBaseY - 180, width * 0.16, coralBaseY - 110);
      c.quadraticCurveTo(width * 0.24, coralBaseY - 160, width * 0.32, coralBaseY - 80);
      c.quadraticCurveTo(width * 0.40, coralBaseY - 120, width * 0.48, coralBaseY);
      c.closePath();
      c.fill();

      // Right Coral Mounds
      const g2 = c.createLinearGradient(0, coralBaseY - 200, 0, coralBaseY);
      g2.addColorStop(0, "rgba(125, 39, 110, 0.35)");
      g2.addColorStop(1, "rgba(2, 6, 15, 0.95)");
      c.fillStyle = g2;
      c.beginPath();
      c.moveTo(width, coralBaseY);
      c.lineTo(width, coralBaseY - 160);
      c.quadraticCurveTo(width * 0.90, coralBaseY - 220, width * 0.80, coralBaseY - 130);
      c.quadraticCurveTo(width * 0.72, coralBaseY - 170, width * 0.62, coralBaseY - 90);
      c.quadraticCurveTo(width * 0.54, coralBaseY - 130, width * 0.46, coralBaseY);
      c.closePath();
      c.fill();

      // Swaying Sea Anemone & Sea Fans with Glowing Polyps
      c.lineWidth = 2.2;
      const anemoneColors = [
        "rgba(244, 63, 94, 0.60)",
        "rgba(251, 191, 36, 0.60)",
        "rgba(56, 189, 248, 0.60)",
      ];
      for (let i = 0; i < 18; i++) {
        const ax = i * (width / 18) + Math.sin(i * 9) * 20;
        const sway = Math.sin(time * 0.002 + i) * 12;
        c.strokeStyle = anemoneColors[i % anemoneColors.length];
        c.beginPath();
        c.moveTo(ax, coralBaseY - 10);
        c.quadraticCurveTo(ax + sway * 0.5, coralBaseY - 50, ax + sway, coralBaseY - 85);
        c.stroke();
        c.fillStyle = c.strokeStyle;
        c.beginPath();
        c.arc(ax + sway, coralBaseY - 85, 2.5, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    };

    // Volumetric Surface God Rays
    const drawSunbeams = (c: CanvasRenderingContext2D, time: number) => {
      c.save();
      c.globalCompositeOperation = "screen";
      for (let i = 0; i < 6; i++) {
        const beamX = width * 0.5 + Math.sin(time * 0.0006 + i * 1.3) * (width * 0.28);
        const g = c.createLinearGradient(width * 0.5, 0, beamX, height);
        g.addColorStop(0, "rgba(186, 230, 253, 0.12)");
        g.addColorStop(0.4, "rgba(56, 189, 248, 0.05)");
        g.addColorStop(1, "rgba(56, 189, 248, 0)");
        c.fillStyle = g;
        c.beginPath();
        c.moveTo(width * 0.5 - 20, 0);
        c.lineTo(width * 0.5 + 20, 0);
        c.lineTo(beamX + 110, height);
        c.lineTo(beamX - 110, height);
        c.closePath();
        c.fill();
      }
      c.restore();
    };

    const bubbles: Array<{ x: number; y: number; r: number; speed: number; wobble: number }> = [];
    for (let b = 0; b < 38; b++) {
      bubbles.push({
        x: Math.random() * (width || 1200),
        y: Math.random() * (height || 800),
        r: 1 + Math.random() * 3.5,
        speed: 0.4 + Math.random() * 0.8,
        wobble: Math.random() * 6,
      });
    }

    const schoolGold = new FishSchool(14, "rgba(251, 191, 36, 0.80)", 3.6, 1.1, [0.35, 0.65]);
    const schoolCyan = new FishSchool(20, "rgba(56, 189, 248, 0.75)", 3.0, 1.4, [0.45, 0.80]);

    const render = (time: number) => {
      if (!reduced) {
        ctx.clearRect(0, 0, width, height);

        drawSunbeams(ctx, time);
        manta.draw(ctx, time);
        turtle.draw(ctx, time);
        schoolGold.update(time);
        schoolGold.draw(ctx);
        schoolCyan.update(time);
        schoolCyan.draw(ctx);
        drawCorals(ctx, time);

        // Rising Bubbles
        ctx.save();
        ctx.fillStyle = "rgba(224, 242, 254, 0.45)";
        ctx.strokeStyle = "rgba(186, 230, 253, 0.75)";
        ctx.lineWidth = 0.8;
        for (const b of bubbles) {
          b.y -= b.speed;
          b.x += Math.sin(time * 0.002 + b.wobble) * 0.3;
          if (b.y < -10) {
            b.y = height + 10;
            b.x = Math.random() * width;
          }
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (q && q.removeEventListener) q.removeEventListener("change", syncMotion);
      if (animId) cancelAnimationFrame(animId);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="neural-container relative w-full h-screen overflow-hidden select-none">
      {/* 1. Background Video Layer */}
      <video
        ref={videoRef}
        className="neural-art"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4"
      />

      {/* High-Performance GPU Canvas: Living Coral Reef & Marine Wildlife */}
      <canvas ref={canvasRef} id="neural-ocean-canvas" aria-hidden="true" />

      {/* 2. Volumetric Oceanic Scrim Veil */}
      <div className="neural-veil" />

      {/* 3. Navigation Header Bar */}
      <header className="neural-bar">
        <Link className="neural-brand" to="/">
          <svg viewBox="0 0 23 17" aria-hidden="true">
            <path d="M8.15 0.9 L4.55 0.9 L0.5 9.3 L4.1 9.3 Z" />
            <path d="M17.0 0 L13.4 0 L6.15 16.4 L9.75 16.4 Z" />
            <path d="M22.9 0 L19.3 0 L15.0 7.6 L18.6 7.6 Z" />
            <path d="M22.6 6.9 L19.0 6.9 L14.05 16.4 L17.65 16.4 Z" />
          </svg>
          <span id="word">FRESHSCAN</span>
        </Link>

        <input className="neural-navtoggle" type="checkbox" id="nav-open" />
        <label className="neural-scrim" htmlFor="nav-open" aria-hidden="true" />
        <label className="neural-burger" htmlFor="nav-open" aria-label="Menu">
          <svg viewBox="0 0 22 14">
            <path className="b1" d="M1 1 H21" />
            <path className="b2" d="M1 7 H21" />
            <path className="b3" d="M1 13 H21" />
          </svg>
        </label>

        <div className="neural-navpanel">
          <nav className="neural-menu">
            <Link to="/species">
              <span id="about">Species Guide</span>
            </Link>
            <Link to="/dataset">
              <span id="product">Dataset</span>
            </Link>
            <Link to="/analyze">
              <span id="solutions">Analyze</span>
              <svg className="neural-caret" viewBox="0 0 9 6" aria-hidden="true">
                <path d="M0.7 1.1 L4.5 4.6 L8.3 1.1" />
              </svg>
            </Link>
          </nav>
          <Link className="neural-login" to="/analyze">
            <span id="login">Start Scanning</span>
            <svg className="neural-navarrow" viewBox="0 0 10 9" aria-hidden="true">
              <path d="M0 4.5 H9.1 M5.4 0.9 L9.2 4.5 L5.4 8.1" />
            </svg>
          </Link>
          <Link className="neural-pill" to="/analyze">
            <span id="contact">Scan Now</span>
          </Link>
        </div>
      </header>

      {/* 4. Hero Content Section — FreshScan Marine */}
      <main className="neural-hero">
        <h1 className="neural-title">
          <span id="h1a">AI Seafood Freshness Scanner</span>
          <span id="h1b">Instant Quality Assessment.</span>
        </h1>
        <p className="neural-sub">
          <span id="sub1">Professional-grade freshness analysis for fish, shrimp, squid & shellfish.</span>
          <span id="sub2">Powered by QIM standards. Processed on-device.</span>
        </p>
        <Link className="neural-cta" to="/analyze">
          <span id="cta">Start Scanning</span>
          <svg className="arrow" viewBox="0 0 16 11" aria-hidden="true">
            <path d="M0 5.5 H14.6 M10.3 1.2 L14.9 5.5 L10.3 9.8" />
          </svg>
        </Link>
        <ul className="neural-feats">
          <li>
            <svg className="neural-chev" viewBox="0 0 11 20" aria-hidden="true">
              <path d="M1.15 1.15 L9.6 10 L1.15 18.85" />
            </svg>
            <span id="f1">QIM European standard</span>
          </li>
          <li>
            <svg className="neural-chev" viewBox="0 0 11 20" aria-hidden="true">
              <path d="M1.15 1.15 L9.6 10 L1.15 18.85" />
            </svg>
            <span id="f2">Edge-processed, 100% private</span>
          </li>
          <li>
            <svg className="neural-chev" viewBox="0 0 11 20" aria-hidden="true">
              <path d="M1.15 1.15 L9.6 10 L1.15 18.85" />
            </svg>
            <span id="f3">4 species: fish, shrimp, squid, shellfish</span>
          </li>
          <li>
            <svg className="neural-chev" viewBox="0 0 11 20" aria-hidden="true">
              <path d="M1.15 1.15 L9.6 10 L1.15 18.85" />
            </svg>
            <span id="f4">Grade A–D freshness rating</span>
          </li>
        </ul>
        <span className="neural-rule" aria-hidden="true" />
      </main>

      {/* 5. Footer */}
      <footer className="neural-foot">
        <span id="foot1">Empowering consumers and markets with reliable seafood quality assessment.</span>
        <span id="foot2">FreshScan Marine™ 2026</span>
      </footer>
    </div>
  );
}
