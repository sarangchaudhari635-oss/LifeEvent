"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldAlert,
  FileSearch,
  Calculator,
  Zap,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BadgeAlert,
  MapPin
} from "lucide-react";

interface QuestionItem {
  id: string;
  num: string;
  title: string;
  timeContext: string;
  problem: string;
  solutionTitle: string;
  solutionSummary: string;
  formulaOrClause: {
    label: string;
    code: string;
    impact: string;
  };
  metrics: { label: string; value: string; note: string }[];
  routeLink: string;
  routeLabel: string;
}

export function CrisisQuestionsLedger() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const questions: QuestionItem[] = [
    {
      id: "coverage",
      num: "01",
      title: "What is actually covered right now?",
      timeContext: "T+02 mins • Hospital Admission Desk",
      problem:
        "The desk demands an immediate cashless card or a ₹1,50,000 cash deposit. You don't know your policy exclusions, sub-limits, or waiting periods.",
      solutionTitle: "Verbatim Policy Parsing & Instant Eligibility Breakdown",
      solutionSummary:
        "LifeEvent AI extracts your 42-page policy PDF in 4 seconds. It isolates the exact medical condition, validates sum insured, and flags pre-existing disease (PED) clauses before the hospital desk submits to the TPA.",
      formulaOrClause: {
        label: "REGULATORY REFERENCE",
        code: "IRDAI/HLT/REG/2024/11 • Clause 4.2.1",
        impact: "Mandatory 30-day waiting period waiver for emergency acute coronary syndrome verified.",
      },
      metrics: [
        { label: "SUM INSURED", value: "₹5,00,000", note: "Active Family Floater" },
        { label: "DEDUCTIBLE", value: "₹0", note: "Nil Co-pay Applied" },
        { label: "EMPANELMENT", value: "Tier 1 Cashless", note: "Green Channel Active" },
      ],
      routeLink: "/journey/demo-journey-cardiac-01/coverage",
      routeLabel: "Inspect Policy Clauses & Evidence",
    },
    {
      id: "preauth",
      num: "02",
      title: "Why is cashless pre-authorization taking hours?",
      timeContext: "T+15 mins • Emergency Observation",
      problem:
        "Pre-auth coordination typically takes 4 to 6 hours due to missing doctor signatures, incomplete diagnostic reports, and opaque TPA back-and-forth.",
      solutionTitle: "Document-Readiness Engine & Automated Form Coordination",
      solutionSummary:
        "Our system audits your hospital admission papers against TPA pre-auth requirements in real time. It highlights exactly what doctor signature or test report is missing before submission, avoiding query letters.",
      formulaOrClause: {
        label: "READINESS AUDIT",
        code: "ABDM Pre-Auth Schema v2.1 • Section C",
        impact: "Treating Cardiologist clinical summary attached. Zero rejection risk detected.",
      },
      metrics: [
        { label: "READINESS SCORE", value: "98/100", note: "Pre-Auth Pack Complete" },
        { label: "AVG DELAY REDUCTION", value: "-78%", note: "From 4.5h to 22 mins" },
        { label: "DOCUMENTS SYNCED", value: "4 of 4", note: "Signed & Redacted" },
      ],
      routeLink: "/documents",
      routeLabel: "View Document Hub & Redactor",
    },
    {
      id: "gap",
      num: "03",
      title: "What is our real out-of-pocket financial gap?",
      timeContext: "T+25 mins • TPA Initial Approval Arrives",
      problem:
        "TPA approves ₹1,80,000 on a ₹3,50,000 hospital estimate. Families assume ₹1,70,000 is non-payable, but opaque room rent penalties secretly inflate deductions.",
      solutionTitle: "Deterministic Room-Rent Proportional Deduction Engine",
      solutionSummary:
        "We calculate the exact mathematical gap using IRDAI 2024 regulations. If you take a ₹8,500/day room against a ₹5,000/day cap, the 41.2% penalty is legally barred from medical consumables and stent devices.",
      formulaOrClause: {
        label: "PROPORTION FORMULA",
        code: "Penalty = (₹8,500 - ₹5,000) / ₹8,500 = 41.17%",
        impact: "Legally defended against ₹38,400 unlawful consumable deductions under IRDAI 2024 circular.",
      },
      metrics: [
        { label: "TOTAL ESTIMATE", value: "₹3,50,000", note: "Hospital Pro-forma" },
        { label: "TPA INITIAL PASS", value: "₹2,10,000", note: "Cashless Approved" },
        { label: "TRUE OUT-OF-POCKET", value: "₹65,000", note: "After Penalty Defense" },
      ],
      routeLink: "/journey/demo-journey-cardiac-01",
      routeLabel: "View Dynamic Gap Modeling",
    },
    {
      id: "funding",
      num: "04",
      title: "How do we pay the hospital caution deposit right now?",
      timeContext: "T+30 mins • Billing Counter Standoff",
      problem:
        "Hospitals refuse to wheel the patient into the cath lab without an upfront ₹1,00,000 caution deposit, even when a health policy exists.",
      solutionTitle: "Paytm Instant 1-Tap UPI Hospital Deposit Bridge",
      solutionSummary:
        "LifeEvent AI unlocks an instant Paytm emergency liquidity bridge based on your verified policy evidence. Funds are disbursed directly to the hospital billing merchant UPI VPA in 8 seconds, automatically reconciling on discharge.",
      formulaOrClause: {
        label: "SETTLEMENT PROTOCOL",
        code: "Paytm UPI Merchant Bridge • 8-Sec Payout",
        impact: "Zero delay at billing counter. Patient moved to OT without personal cash depletion.",
      },
      metrics: [
        { label: "CAUTION DEPOSIT", value: "₹1,20,000", note: "Billed by Hospital" },
        { label: "PAYTM BRIDGE", value: "₹1,20,000", note: "Instant Disbursed" },
        { label: "DISBURSEMENT SPEED", value: "7.8s", note: "Direct to Hospital VPA" },
      ],
      routeLink: "/journey/demo-journey-cardiac-01/funding",
      routeLabel: "Explore Paytm Emergency Bridge",
    },
    {
      id: "replan",
      num: "05",
      title: "What happens when things change mid-treatment?",
      timeContext: "T+18 hrs • Post-Procedure ICU",
      problem:
        "An unexpected ICU day is added or the doctor prescribes non-formulary medication. Static hospital checklists break down completely.",
      solutionTitle: "Living Journey Line: Dynamic State Machine via SSE",
      solutionSummary:
        "As supplemental bills, TPA replies, and discharge summaries arrive, our state machine continuously recalculates your out-of-pocket gap and coordinates next steps across family and hospital counselors.",
      formulaOrClause: {
        label: "STATE RE-PLANNER",
        code: "SSE Event Stream • State: ICU_EXTENSION",
        impact: "Dynamic enhancement request of ₹60,000 auto-formatted for TPA review.",
      },
      metrics: [
        { label: "STATE ENGINE", value: "Living SSE", note: "Real-time Recalculation" },
        { label: "COUNSELOR SYNC", value: "Active", note: "Hospital File Updated" },
        { label: "DISCHARGE READY", value: "On Track", note: "Zero Stoppage" },
      ],
      routeLink: "/demo-script",
      routeLabel: "Review 3-Minute Presentation Script",
    },
  ];

  const current = questions[activeTab];

  return (
    <section className="relative w-full bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-paytm-navy" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-paytm-navy">
              [ 01 // CRISIS RESPONSE ARCHITECTURE ]
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
            When an emergency strikes, families face five terrifying questions in thirty seconds.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
            At the hospital admission desk, panic and financial opacity collide. LifeEvent AI replaces confusion with mathematical certainty, verbatim regulatory citations, and instant liquidity.
          </p>
        </div>

        {/* Master-Detail Interactive Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 5 Questions Navigation Stack */}
          <div className="lg:col-span-5 space-y-3">
            {questions.map((q, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-all duration-200 flex items-start gap-4 ${
                    isActive
                      ? "bg-neutral-950 text-white border-neutral-950 shadow-md ring-1 ring-neutral-800"
                      : "bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/80"
                  }`}
                >
                  <span
                    className={`font-mono text-sm font-bold mt-0.5 px-2 py-0.5 rounded ${
                      isActive
                        ? "bg-neutral-800 text-paytm-cyan"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {q.num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider ${
                          isActive ? "text-neutral-400" : "text-neutral-500"
                        }`}
                      >
                        {q.timeContext}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-paytm-cyan animate-pulse" />
                      )}
                    </div>
                    <h3
                      className={`text-sm sm:text-base font-bold mt-1 leading-snug ${
                        isActive ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {q.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: LifeEvent AI Resolution Terminal */}
          <div className="lg:col-span-7 bg-neutral-50 rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              {/* Terminal Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-neutral-200/80 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-white border border-neutral-200 text-paytm-navy">
                    CASE STUDY: QUESTION {current.num} OF 05
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    STATUS: RESOLVED IN ENGINE
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Deterministic</span>
                </div>
              </div>

              {/* Authentic Clinical Context Photo */}
              <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden mb-6 border border-neutral-200/80 shadow-sm">
                <Image
                  src={
                    activeTab % 2 === 0
                      ? "/images/doctor-consultation.jpg"
                      : "/images/hospital-desk.jpg"
                  }
                  alt="Clinical Emergency Coordination"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={activeTab === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-mono">
                  <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/20 font-bold">
                    [ CLINICAL EVIDENCE: IPD-8941 • CARDIAC ]
                  </span>
                  <span className="bg-paytm-navy/90 backdrop-blur-md text-paytm-cyan px-2.5 py-1 rounded border border-paytm-cyan/30 text-[10px] font-bold">
                    AI COORDINATED
                  </span>
                </div>
              </div>

              {/* The Crisis Trigger */}
              <div className="mb-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>THE HOSPITAL COUNTER PROBLEM:</span>
                </div>
                <p className="text-sm text-amber-950/80 leading-relaxed">
                  {current.problem}
                </p>
              </div>

              {/* The LifeEvent Solution */}
              <div className="mb-6">
                <h4 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">
                  {current.solutionTitle}
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {current.solutionSummary}
                </p>
              </div>

              {/* Verbatim Code / Regulatory Reference Box (Subtle Dark Obsidian Terminal) */}
              <div className="p-4 rounded-xl bg-neutral-950 text-white border border-neutral-800 font-mono text-xs mb-6 shadow-sm">
                <div className="flex items-center justify-between text-neutral-400 text-[10px] uppercase tracking-wider mb-1.5">
                  <span>{current.formulaOrClause.label}</span>
                  <span className="text-paytm-cyan font-bold">ZERO HALLUCINATION • SHA-256</span>
                </div>
                <div className="text-paytm-cyan font-semibold mb-1 font-mono text-xs sm:text-sm">
                  {current.formulaOrClause.code}
                </div>
                <div className="text-neutral-300 text-[11px]">
                  &rarr; {current.formulaOrClause.impact}
                </div>
              </div>

              {/* Real Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {current.metrics.map((m, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-lg bg-white border border-neutral-200"
                  >
                    <span className="block text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                      {m.label}
                    </span>
                    <span className="block text-lg font-black text-neutral-900 mt-0.5">
                      {m.value}
                    </span>
                    <span className="block text-[11px] text-neutral-500 mt-0.5">
                      {m.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Link to live system demo */}
            <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs text-neutral-500 font-mono">
                Real-time execution available in live journey instance
              </span>
              <Link
                href={current.routeLink}
                className="inline-flex items-center gap-2 text-xs font-bold text-paytm-navy hover:text-paytm-cyan transition-colors"
              >
                <span>{current.routeLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
