"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Shield,
  Activity,
  Menu,
  X,
  ArrowRight,
  Zap,
  Lock,
  Building2,
  FileText,
  Sparkles,
  Trophy,
  Scale,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { Language, translations } from "@/lib/translations";

interface NavbarProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export function Navbar({ currentLang = "en", onLanguageChange }: NavbarProps) {
  const [lang, setLang] = useState<Language>(currentLang);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang] || translations.en;

  // Dedicated navigation handler ensuring 100% clean redirect to the original white landing page
  const handleHomeRedirect = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  useEffect(() => {
    setLang(currentLang);
  }, [currentLang]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLangSelect = (newLang: Language) => {
    setLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  // Curated, uncluttered primary navigation
  const primaryLinks = [
    { href: "/intake", label: "Emergency Intake" },
    { href: "/journey/demo-journey-cardiac-01", label: "Living Journey" },
    { href: "/journey/demo-journey-cardiac-01/coverage", label: "Evidence Auditor" },
    { href: "/journey/demo-journey-cardiac-01/funding", label: "Paytm Bridge" },
    { href: "/counselor", label: "Hospital Desk" },
  ];

  const drawerSections = [
    {
      title: "Patient & Family Flow",
      links: [
        { href: "/intake", label: "Emergency Crisis Intake", desc: "Voice or text plain-language triage with zero-knowledge Aadhaar masking" },
        { href: "/journey/demo-journey-cardiac-01", label: "Living Journey State Machine", desc: "Real-time task sequencing, SSE live updates & honest IRDAI gap range" },
        { href: "/journey/demo-journey-cardiac-01/coverage", label: "Forensic Evidence Chamber", desc: "Verbatim policy clause proof with character-by-character SHA-256 checks" },
        { href: "/journey/demo-journey-cardiac-01/funding", label: "Paytm UPI Caution Deposit", desc: "Instant 8-second caution money bridge directly to hospital Counter #4" },
      ]
    },
    {
      title: "Hospital & Institutional Network",
      links: [
        { href: "/counselor", label: "Hospital Counselor Cockpit", desc: "B2B emergency admission triage queue & TPA clearance telemetry" },
        { href: "/for-hospitals", label: "Institutional Pilot Partnership", desc: "45-min cashless approval SLA & zero counter friction onboarding" },
        { href: "/how-it-works", label: "System Architecture Blueprint", desc: "5-stage deterministic pipeline & LangGraph state machine flow" },
      ]
    },
    {
      title: "Compliance, Privacy & Evaluation",
      links: [
        { href: "/documents", label: "Document Ingestion & Redactor Lab", desc: "Dihedral D5 Verhoeff algorithm playground & ABDM corpus" },
        { href: "/privacy", label: "DPDP 2023 Data Sovereignty Charter", desc: "Zero raw image storage & one-click hard-purge verification" },
        { href: "/demo-script", label: "Judge 3-Minute Presentation Script", desc: "Live stage teleprompter with direct feature launchers" },
        { href: "https://github.com/sarangchaudhari635-oss/LifeEvent", label: "GitHub Source Repository", desc: "Complete hackathon repository & open-source Python/Next.js architecture" },
      ]
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logotype */}
          <Link
            href="/"
            onClick={handleHomeRedirect}
            className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 cursor-pointer"
            aria-label="Navigate to LifeEvent AI Homepage"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#002970] to-[#001744] flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:shadow-md transition-all">
              <span className="text-[#00baf2] font-mono text-sm sm:text-base">L</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 flex items-center gap-1.5 group-hover:text-[#002970] transition-colors">
                LifeEvent AI
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-[11px] font-medium text-slate-500 -mt-0.5 hidden sm:inline">
                Medical Financial Coordination
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Clean, Uncluttered, Spaced) */}
          <nav className="hidden lg:flex items-center gap-6 lg:gap-8 text-[13px] font-medium text-slate-600">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#002970] transition-colors py-1 relative hover:font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Utility Group */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Minimalist Pill Language Switcher */}
            <div className="flex items-center bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/70 text-[11px] sm:text-xs font-mono font-medium">
              <button
                type="button"
                onClick={() => handleLangSelect("en")}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md transition-all ${lang === "en"
                    ? "bg-white text-[#002970] font-bold shadow-xs border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLangSelect("hi")}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md transition-all ${lang === "hi"
                    ? "bg-white text-[#002970] font-bold shadow-xs border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                हिं
              </button>
              <button
                type="button"
                onClick={() => handleLangSelect("mr")}
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md transition-all ${lang === "mr"
                    ? "bg-white text-[#002970] font-bold shadow-xs border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                  }`}
              >
                मरा
              </button>
            </div>

            {/* GitHub Source Code Icon Button */}
            <a
              href="https://github.com/sarangchaudhari635-oss/LifeEvent"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source code on GitHub"
              className="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200/80 bg-white text-slate-700 hover:text-[#002970] hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            {/* Primary Action Button */}
            <Link
              href="/intake"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#002970] text-white text-xs font-semibold hover:bg-[#001d52] transition-all shadow-sm hover:shadow active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 text-[#00baf2]" />
              <span>Start Intake</span>
            </Link>

            {/* Menu Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/70"
              aria-label="Open Navigation Directory"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-over Full Route Directory Modal */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <Link
                href="/"
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleHomeRedirect(e);
                }}
                className="flex items-center gap-2.5 group cursor-pointer"
                aria-label="Navigate to LifeEvent AI Homepage"
              >
                <div className="w-7 h-7 rounded-lg bg-[#002970] flex items-center justify-center text-white font-bold text-xs group-hover:bg-[#001744] transition-colors">
                  L
                </div>
                <span className="font-extrabold text-sm text-slate-900 group-hover:text-[#002970] transition-colors">
                  LifeEvent AI
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-grow">
              {drawerSections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-2">
                    {sec.title}
                  </h3>
                  <div className="space-y-1">
                    {sec.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="group flex flex-col p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200/60"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-[#002970] transition-colors">
                            {link.label}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#002970] group-hover:translate-x-0.5 transition-all" />
                        </div>
                        <span className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {link.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Drawer Footer CTA */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/60">
              <Link
                href="/intake"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#002970] text-white text-xs font-semibold shadow-sm hover:bg-[#001d52] transition-colors"
              >
                <Zap className="w-4 h-4 text-[#00baf2]" />
                <span>Launch Emergency Intake</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
