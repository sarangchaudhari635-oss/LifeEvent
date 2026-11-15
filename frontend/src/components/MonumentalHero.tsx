"use client";

import { useEffect, useState, useRef } from "react";
import NextLink from "next/link";
import { ArrowRight, Sparkles, Shield, HeartPulse, Building2, ChevronRight, Activity } from "lucide-react";
import { Language, translations } from "@/lib/translations";
import { LiquidFluidCanvas } from "@/components/LiquidFluidCanvas";

interface MonumentalHeroProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function MonumentalHero({ currentLang = "en", onLanguageChange }: MonumentalHeroProps) {
  const [lang, setLang] = useState<Language>(currentLang);
  const t = translations[lang] || translations.en;

  const [isLoaded, setIsLoaded] = useState(false);
  const [curtainHidden, setCurtainHidden] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorTarget, setCursorTarget] = useState({ x: -100, y: -100 });
  const [isHoveredInteractive, setIsHoveredInteractive] = useState(false);
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);

  // Magnetic button pull offsets
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });
  const btnRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    setLang(currentLang);
  }, [currentLang]);

  // Page load sequence reverse-engineered from noth.in
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 250);

    const curtainTimer = setTimeout(() => {
      setCurtainHidden(true);
    }, 1100);

    return () => {
      clearTimeout(timer);
      clearTimeout(curtainTimer);
    };
  }, []);

  // Smooth lerp for cursor follower (matching noth.in o = 0.09 lerp)
  useEffect(() => {
    let rafId: number;
    let currX = cursorTarget.x;
    let currY = cursorTarget.y;

    const loop = () => {
      currX += (cursorTarget.x - currX) * 0.12;
      currY += (cursorTarget.y - currY) * 0.12;
      setCursorPos({ x: currX, y: currY });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [cursorTarget]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorTarget({ x, y });

    // Magnetic pull for primary CTA button
    if (btnRef.current) {
      const bRect = btnRef.current.getBoundingClientRect();
      const bCenterX = bRect.left + bRect.width / 2;
      const bCenterY = bRect.top + bRect.height / 2;
      const distX = e.clientX - bCenterX;
      const distY = e.clientY - bCenterY;
      const dist = Math.sqrt(distX * distX + distY * distY);

      if (dist < 100) {
        setBtnOffset({ x: distX * 0.22, y: distY * 0.22 });
      } else {
        setBtnOffset({ x: 0, y: 0 });
      }
    }
  };

  const handleLangSelect = (newLang: Language) => {
    setLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  // Letters of "LIFEEVENT" for individual randomized staggered entry
  const letters = ["L", "I", "F", "E", "E", "V", "E", "N", "T"];
  const staggerDelays = [0.18, 0.32, 0.12, 0.28, 0.40, 0.15, 0.35, 0.22, 0.45];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] w-full bg-[#fbfbfd] text-slate-900 overflow-hidden flex flex-col justify-between p-4 sm:p-8 select-none border-b border-slate-200 cursor-default"
    >
      {/* 1. Preloader Curtain Reveal (Reverse-engineered from noth.in) */}
      {!curtainHidden && (
        <div
          className={`fixed inset-0 z-50 bg-[#00173d] text-white flex flex-col items-center justify-center transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isLoaded ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-paytm-cyan animate-pulse" />
            <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-white uppercase">
              LIFEEVENT AI &bull; EMERGENCY FINANCIAL PROTOCOL
            </span>
          </div>
          <div className="w-48 h-0.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full bg-paytm-cyan transition-all duration-700 ease-out ${
                isLoaded ? "w-full" : "w-1/4"
              }`}
            />
          </div>
        </div>
      )}

      {/* 2. REAL-TIME NAVIER-STOKES GPU FLUID CANVAS */}
      <LiquidFluidCanvas />

      {/* 3. MAGNETIC FLUID FOLLOWER CURSOR */}
      <div
        className="pointer-events-none absolute z-40 rounded-full transition-transform duration-75 ease-out hidden md:block"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: `translate(-50%, -50%) scale(${isHoveredInteractive ? 2.4 : 1})`,
          width: isHoveredInteractive ? "44px" : "28px",
          height: isHoveredInteractive ? "44px" : "28px",
          border: isHoveredInteractive ? "1.5px solid rgba(0, 186, 242, 0.85)" : "1px solid rgba(0, 23, 61, 0.35)",
          backgroundColor: isHoveredInteractive ? "rgba(0, 186, 242, 0.12)" : "rgba(0, 186, 242, 0.04)",
          backdropFilter: isHoveredInteractive ? "blur(4px)" : "none",
        }}
      >
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-paytm-cyan"
          style={{ opacity: isHoveredInteractive ? 1 : 0.6 }}
        />
      </div>

      {/* 4. TOP PERIMETER: 4-Corner Swiss Layout */}
      <div className="w-full flex items-start justify-between gap-4 z-20">
        {/* Top-Left: Punchy Statement & High-Contrast Magnetic Pill CTA */}
        <div className="max-w-md space-y-3">
          <div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-paytm-navy block mb-0.5">
              Protocol PS-2 &bull; Build for India
            </span>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug tracking-tight">
              When a medical emergency strikes.
              <br />
              <span className="text-slate-500 font-normal">
                One guided financial journey connecting insurance, gaps & payments.
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <NextLink
              ref={btnRef}
              href="/intake"
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => {
                setIsHoveredInteractive(false);
                setBtnOffset({ x: 0, y: 0 });
              }}
              style={{
                transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)`,
                transition: "transform 0.18s ease-out",
              }}
              className="group relative inline-flex items-center gap-3 bg-paytm-navy hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-md hover:shadow-xl active:scale-95"
            >
              <span>Start Emergency Intake</span>
              <div className="relative w-5 h-5 rounded-full bg-paytm-cyan flex items-center justify-center text-paytm-navy transition-all duration-300 group-hover:scale-110">
                <ArrowRight className="w-3 h-3 font-bold transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </NextLink>

            <NextLink
              href="/journey/demo-journey-cardiac-01"
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => setIsHoveredInteractive(false)}
              className="text-xs font-semibold text-slate-600 hover:text-paytm-navy px-3 py-2 rounded-full hover:bg-slate-100 transition-colors hidden sm:inline"
            >
              Cardiac Demo Case
            </NextLink>
          </div>
        </div>

        {/* Top-Right: Hospital Console Status & Minimal Language Switcher */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5 sm:gap-3">
          <NextLink
            href="/how-it-works"
            onMouseEnter={() => setIsHoveredInteractive(true)}
            onMouseLeave={() => setIsHoveredInteractive(false)}
            className="text-xs font-semibold text-slate-600 hover:text-paytm-navy transition-colors hidden md:inline relative group"
          >
            <span>How It Works</span>
            <span className="absolute bottom-[-2px] left-0 w-0 h-[1.5px] bg-paytm-navy transition-all duration-300 group-hover:w-full" />
          </NextLink>

          <NextLink
            href="/documents"
            onMouseEnter={() => setIsHoveredInteractive(true)}
            onMouseLeave={() => setIsHoveredInteractive(false)}
            className="text-xs font-semibold text-slate-600 hover:text-paytm-navy transition-colors hidden lg:inline relative group"
          >
            <span>Documents Hub</span>
            <span className="absolute bottom-[-2px] left-0 w-0 h-[1.5px] bg-paytm-navy transition-all duration-300 group-hover:w-full" />
          </NextLink>

          <NextLink
            href="/counselor"
            onMouseEnter={() => setIsHoveredInteractive(true)}
            onMouseLeave={() => setIsHoveredInteractive(false)}
            className="text-xs font-bold text-slate-700 hover:text-paytm-navy flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm hover:border-paytm-cyan transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hospital Console</span>
          </NextLink>

          {/* Clean Segmented Language Pill */}
          <div className="inline-flex items-center bg-white/90 backdrop-blur-sm p-0.5 rounded-full border border-slate-200 shadow-sm text-[11px] font-bold">
            <button
              type="button"
              onClick={() => handleLangSelect("en")}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                lang === "en" ? "bg-paytm-navy text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => handleLangSelect("hi")}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                lang === "hi" ? "bg-paytm-navy text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              हिं
            </button>
            <button
              type="button"
              onClick={() => handleLangSelect("mr")}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                lang === "mr" ? "bg-paytm-navy text-white" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              मरा
            </button>
          </div>
        </div>
      </div>

      {/* 5. CENTER MONUMENTAL DISPLAY: "LIFEEVENT" Hero Typography with Interactive Liquid Hover Reactions */}
      <div className="my-auto py-8 sm:py-12 w-full flex flex-col items-center justify-center overflow-hidden z-20">
        <div className="w-full max-w-[1400px] mx-auto px-2 relative flex items-baseline justify-center">
          {/* Individual letter mask containers for rising staggered entry + interactive liquid physics */}
          <div className="w-full flex items-baseline justify-between overflow-hidden py-1 sm:py-2 font-black tracking-tight leading-none select-none text-slate-900 font-mono">
            {letters.map((char, idx) => {
              const isHovered = hoveredLetter === idx;
              return (
                <span
                  key={idx}
                  ref={(el) => {
                    letterRefs.current[idx] = el;
                  }}
                  onMouseEnter={() => {
                    setHoveredLetter(idx);
                    setIsHoveredInteractive(true);
                  }}
                  onMouseLeave={() => {
                    setHoveredLetter(null);
                    setIsHoveredInteractive(false);
                  }}
                  style={{
                    transform: isLoaded
                      ? isHovered
                        ? "translateY(-12px) scale(1.12) rotateZ(-3deg)"
                        : "translateY(0%) scale(1) rotateZ(0deg)"
                      : "translateY(120%)",
                    transition: isLoaded
                      ? "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.25s ease-out, text-shadow 0.25s ease-out"
                      : `transform 1.6s cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelays[idx]}s`,
                    textShadow: isHovered ? "0 10px 30px rgba(0, 186, 242, 0.45)" : "none",
                  }}
                  className={`inline-block text-[9.5vw] sm:text-[10vw] lg:text-[10.5vw] font-black cursor-pointer tracking-tighter ${
                    isHovered ? "text-paytm-cyan" : "text-slate-950"
                  }`}
                >
                  {char}
                </span>
              );
            })}

            {/* The Accent Element: Floating SuperScript "AI" with energetic spring entrance & hover bounce */}
            <span
              onMouseEnter={() => setIsHoveredInteractive(true)}
              onMouseLeave={() => setIsHoveredInteractive(false)}
              style={{
                transform: isLoaded ? "scale(1)" : "scale(0)",
                transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 1.2s",
              }}
              className="inline-block text-[3.2vw] sm:text-[3.5vw] font-black text-paytm-cyan bg-paytm-navy px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg ml-1 sm:ml-2 self-start shadow-md hover:scale-110 hover:shadow-cyan-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              AI
            </span>
          </div>
        </div>

        {/* Dynamic Subtle Subline with hover glow */}
        <p className="text-xs sm:text-sm font-mono text-slate-500 text-center tracking-widest uppercase mt-2">
          Emergency Health Insurance &bull; Out-of-Pocket Gap &bull; Instant UPI Settlement
        </p>
      </div>

      {/* 6. BOTTOM PERIMETER: Geographical & Platform Authority */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs z-20 pt-4 border-t border-slate-200/60">
        {/* Bottom-Left */}
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-paytm-cyan animate-pulse" />
          <span>Built for Indian Families in Medical Emergencies &bull; Pune, Maharashtra</span>
        </div>

        {/* Bottom-Right */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-500">
          <span className="text-slate-800 font-bold">100% Offline Resilient</span>
          <span>&bull;</span>
          <span>Zero-Knowledge Aadhaar Masking</span>
          <span>&bull;</span>
          <NextLink
            href="/how-it-works"
            onMouseEnter={() => setIsHoveredInteractive(true)}
            onMouseLeave={() => setIsHoveredInteractive(false)}
            className="hover:text-paytm-navy underline"
          >
            Architecture Specs
          </NextLink>
        </div>
      </div>
    </div>
  );
}
