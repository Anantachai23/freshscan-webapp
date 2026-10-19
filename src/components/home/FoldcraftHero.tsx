import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { name: "Home", href: "#home" },
  { name: "Projects", href: "#projects" },
  { name: "Studio", href: "#studio" },
  { name: "Reach Us", href: "#contact" },
];

export function FoldcraftHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black font-geist">
      {/* Video Background sits behind all content (no z-index) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-[70%_center] pointer-events-none"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4"
          type="video/mp4"
        />
      </video>

      {/* Subtle darkening overlay if needed for contrast */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Navbar (z-30) */}
      <header className="relative z-30 flex items-center justify-between px-6 py-5 md:px-12 lg:px-16">
        {/* Left Side: Logo + Desktop Links */}
        <div className="flex items-center gap-10">
          <a
            href="#home"
            className="text-lg font-semibold tracking-tight text-white sm:text-xl select-none"
          >
            Foldcraft
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-white/80 transition-colors hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Side (Desktop): Let's Talk CTA */}
        <div className="hidden md:block">
          <button
            type="button"
            className="rounded-lg bg-white px-5 py-2 text-sm font-medium text-black transition-transform hover:scale-105 active:scale-95"
          >
            Let's Talk
          </button>
        </div>

        {/* Right Side (Mobile): Animated Hamburger Toggle Button (40x40, z-50) */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg text-white transition-transform active:scale-90 md:hidden focus:outline-none"
        >
          <div className="relative h-6 w-6">
            <Menu
              className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                mobileMenuOpen
                  ? "rotate-90 scale-75 opacity-0 pointer-events-none"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                mobileMenuOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-75 opacity-0 pointer-events-none"
              }`}
            />
          </div>
        </button>
      </header>

      {/* Mobile Menu Overlay (z-20) */}
      <div
        className={`absolute inset-x-0 top-0 z-20 overflow-hidden bg-black/98 backdrop-blur-xl transition-[height,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileMenuOpen
            ? "h-screen opacity-100"
            : "h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`flex h-full flex-col justify-center px-8 transition-all duration-500 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            mobileMenuOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-medium text-white/90 transition-colors hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-6 w-fit rounded-full bg-white px-8 py-3.5 text-base font-medium text-black transition-transform hover:scale-105 active:scale-95"
          >
            Let's Talk
          </button>
        </div>
      </div>

      {/* Hero Content (z-10) */}
      <main className="relative z-10 flex h-[calc(100vh-80px)] flex-col justify-between px-6 pb-8 md:px-12 md:pb-12 lg:px-16">
        {/* Top Section */}
        <div className="pt-6 sm:pt-10 md:pt-14">
          <span
            className="inline-block text-xs font-medium uppercase tracking-widest text-white/70 md:text-sm animate-fade-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            Brand & Visual Storytelling
          </span>
          <h1
            className="mt-4 text-4xl font-light tracking-tight text-white leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl animate-fade-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            Shaping visual<br />
            narratives,<br />
            one pixel at a time.
          </h1>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p
            className="max-w-md text-sm leading-relaxed text-white/70 md:text-base animate-fade-slide-up"
            style={{ animationDelay: "0.7s" }}
          >
            We are an independent creative studio crafting high-fidelity digital
            products, tactile brand expressions, and bespoke motion systems.
          </p>

          <div>
            <button
              type="button"
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:scale-105 active:scale-95 animate-fade-slide-up"
              style={{ animationDelay: "0.9s" }}
            >
              <span>Explore Work</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FoldcraftHero;
