"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertOctagon,
  Copy,
  ExternalLink
} from "lucide-react";

export function EvidenceTrapInspector() {
  const [trapInjected, setTrapInjected] = useState<boolean>(false);

  return (
    <section className="relative w-full bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-paytm-navy" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-paytm-navy">
              [ 03 // ZERO-HALLUCINATION DEFENSE ]
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
            Never trust a hallucinating LLM with your family&apos;s life savings.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Generic AI models invent policy exclusions that do not exist, costing families lakhs in wrongful out-of-pocket payments. LifeEvent AI enforces line-by-line verbatim grounding against filed IRDAI policy documents.
          </p>
        </div>

        {/* Interactive Evidence Terminal */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 shadow-sm">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
            <div>
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">
                POLICY CONTRACT &bull; STAR COMPREHENSIVE FLOATER V.24
              </span>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 mt-0.5">
                Evidence Inspector: Acute Coronary Stent & Consumables
              </h3>
            </div>

            {/* Trap Injection Simulator Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neutral-600 font-semibold">
                Planted Trap Test:
              </span>
              <button
                type="button"
                onClick={() => setTrapInjected(!trapInjected)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                  trapInjected
                    ? "bg-rose-600 text-white shadow-sm ring-2 ring-rose-300"
                    : "bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-100"
                }`}
              >
                {trapInjected ? (
                  <>
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>TRAP ACTIVE (SIMULATED TPA DEDUCTION)</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5 text-neutral-500" />
                    <span>INJECT FAKE EXCLUSION TRAP</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Inspection Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Left Column: Verbatim Policy Snippet */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-5 rounded-xl bg-neutral-950 text-white border border-neutral-800 shadow-sm">
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pb-2 mb-3 border-b border-neutral-800">
                  <span>OFFICIAL POLICY EXTRACT &bull; PAGE 22, SECTION 12.3</span>
                  <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded font-bold">
                    VERIFIED EVIDENCE
                  </span>
                </div>
                <blockquote className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-serif italic border-l-2 border-paytm-cyan pl-4 my-2">
                  &ldquo;12.3 Proportional Deduction Limitation: Where the insured occupies a room category higher than the eligible limit, proportionate deductions shall apply exclusively to associate medical expenses (doctor fees, nursing, operation theatre charges).
                  <strong className="text-amber-200 not-italic bg-amber-950/60 border border-amber-800/50 px-1 mx-0.5 font-sans font-bold">
                    Under no circumstances shall proportionate deductions be applied to the cost of medicines, pharmaceuticals, implants, consumables, or medical devices.
                  </strong>&rdquo;
                </blockquote>
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-3 mt-3 border-t border-neutral-800">
                  <span>CITING: IRDAI MASTER CIRCULAR 2024</span>
                  <span className="text-paytm-cyan">DOC HASH: SHA-256: 8f4b2...c91a</span>
                </div>
              </div>

              {/* Trap Evaluation Result Card */}
              {trapInjected ? (
                <div className="p-5 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-950">
                        PLANTED REGULATORY TRAP DETECTED & NEUTRALIZED
                      </h4>
                      <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                        TPA desk cited fictitious &ldquo;Clause 99.4: Stent Balloon Catheter Consumables Co-pay (₹38,000)&rdquo;.
                        LifeEvent AI cross-checked the policy index and confirmed Clause 99.4 does not exist.
                        The family was issued an instant statutory objection citing IRDAI Master Circular Clause 12.3.
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs font-mono font-bold text-rose-700 bg-white p-2 rounded border border-rose-200">
                        <span>FAMILY SAVINGS DEFENDED:</span>
                        <span className="text-emerald-700 font-black">+₹38,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">
                        CLEAN EVIDENCE AUDIT PASSED
                      </h4>
                      <p className="text-xs text-emerald-900 mt-1 leading-relaxed">
                        All billed items matched against filed IRDAI policy terms. No arbitrary non-payable deductions detected in pre-authorization draft.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Comparative AI Defense Matrix */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block mb-3">
                  ARCHITECTURE BENCHMARK
                </span>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-900 mb-1">
                      <span>Naive LLM Chatbot (ChatGPT)</span>
                      <span className="text-rose-600 text-[10px] font-mono">FAILS TRAP</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-snug">
                      Agrees with fake TPA exclusions and suggests patient pay ₹38,000 out of pocket. Hallucinates non-existent IRDAI guidelines.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-900 mb-1">
                      <span>Hospital Billing Portal (HIMS)</span>
                      <span className="text-amber-600 text-[10px] font-mono">PASSIVE LEDGER</span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-snug">
                      Passes insurer deductions directly onto patient invoice without auditing regulatory legality or policy wording.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center justify-between text-xs font-bold text-paytm-navy mb-1">
                      <span>LifeEvent AI Engine</span>
                      <span className="text-emerald-700 text-[10px] font-mono font-bold">100% GROUNDED</span>
                    </div>
                    <p className="text-[11px] text-neutral-700 leading-snug">
                      Deterministic parsing with statutory citations, verbatim page references, and automated dispute drafting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-500">
                  Inspect in Live Journey
                </span>
                <Link
                  href="/journey/demo-journey-cardiac-01/coverage"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-paytm-navy hover:text-paytm-cyan transition-colors"
                >
                  <span>Open Evidence Inspector</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
