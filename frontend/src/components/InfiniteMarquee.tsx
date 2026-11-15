"use client";

import { Activity, ShieldCheck, Zap, Lock, Landmark, CheckCircle2 } from "lucide-react";

export function InfiniteMarquee() {
  const networks = [
    { name: "Apollo Hospitals", tag: "Cashless Desk Active", type: "hospital" },
    { name: "Star Health & Allied", tag: "Auto-Clause Parser", type: "tpa" },
    { name: "Fortis Healthcare", tag: "Fast-track Empaneled", type: "hospital" },
    { name: "HDFC ERGO", tag: "Direct API Bridge", type: "tpa" },
    { name: "Max Super Speciality", tag: "Direct HIMS Hook", type: "hospital" },
    { name: "ICICI Lombard", tag: "ABDM Compliant", type: "tpa" },
    { name: "Manipal Hospitals", tag: "E-PreAuth Live", type: "hospital" },
    { name: "Care Health Insurance", tag: "IRDAI 2024 Rules", type: "tpa" },
    { name: "Narayana Health", tag: "Cardiac Unit Vetted", type: "hospital" },
    { name: "Medi Assist TPA", tag: "Instant Clearance", type: "tpa" },
    { name: "Medanta The Medicity", tag: "Zero-Deposit Node", type: "hospital" },
    { name: "Vidal Health TPA", tag: "Live Bridge Gateway", type: "tpa" },
  ];

  const guarantees = [
    { label: "PRIVACY GUARANTEE", text: "100% Client-Side Verhoeff Masking for Aadhaar & Clinical PII", icon: Lock },
    { label: "REGULATORY COMPLIANCE", text: "IRDAI Master Circular 2024 Mandatory Clause Enforcement", icon: ShieldCheck },
    { label: "MATHEMATICAL RIGOR", text: "Deterministic Room-Rent Proportion Penalty Calculation Engine", icon: Landmark },
    { label: "INSTANT LIQUIDITY", text: "Sub-Second Paytm UPI Emergency Hospital Caution Deposit Rail", icon: Zap },
    { label: "ANTI-HALLUCINATION", text: "Planted Regulatory Trap Defense (Zero Fictitious Insurer Exclusions)", icon: CheckCircle2 },
    { label: "NATIONAL INTEROPERABILITY", text: "ABDM Milestone 1-3 & National Health Claims Exchange (NHCX) Standard", icon: Activity },
  ];

  // Double items for seamless infinite loop
  const doubleNetworks = [...networks, ...networks];
  const doubleGuarantees = [...guarantees, ...guarantees];

  return (
    <section className="relative w-full bg-white border-y-2 border-neutral-200 overflow-hidden py-8 sm:py-10 select-none">
      {/* Top micro telemetry bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-5 flex flex-wrap items-center justify-between text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-neutral-600">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-neutral-950 font-black">LIVE INTEGRATION MESH</span>
          <span className="text-neutral-300">|</span>
          <span className="hidden sm:inline text-neutral-600 font-semibold">Tier-1 Hospital HIMS & TPA Gateways</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-neutral-500 font-semibold">
          <span>LATENCY: &lt;140ms</span>
          <span>&bull;</span>
          <span>UPTIME: 99.98%</span>
          <span>&bull;</span>
          <span className="text-paytm-navy font-black tracking-widest bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            PAYTM UPI ENGINE READY
          </span>
        </div>
      </div>

      {/* Track 1: Networks & TPAs (Leftwards Infinite - Large & Prominent Clean White Cards) */}
      <div className="marquee-mask relative overflow-hidden py-2.5">
        <div className="animate-marquee gap-5 flex items-center">
          {doubleNetworks.map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-4 px-6 py-3.5 rounded-2xl bg-white border-2 border-neutral-200 shadow-sm hover:border-paytm-navy hover:shadow-md transition-all cursor-default"
            >
              <span
                className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  item.type === "hospital" ? "bg-paytm-navy" : "bg-paytm-cyan"
                }`}
              />
              <span className="text-base sm:text-lg font-black text-neutral-900 whitespace-nowrap tracking-tight">
                {item.name}
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200 whitespace-nowrap">
                {item.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Track 2: Guarantees & Engine Specs (Rightwards Infinite - Bold Black Aesthetic) */}
      <div className="marquee-mask relative overflow-hidden pt-4 pb-2">
        <div className="animate-marquee-reverse gap-5 flex items-center">
          {doubleGuarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-neutral-950 text-white border border-neutral-800 hover:border-paytm-cyan shadow-md transition-all cursor-default group"
              >
                <Icon className="w-4 h-4 text-paytm-cyan flex-shrink-0" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-paytm-cyan">
                  {item.label}
                </span>
                <span className="text-xs sm:text-sm font-medium text-neutral-200 whitespace-nowrap">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
