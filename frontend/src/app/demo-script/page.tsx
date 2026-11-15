"use client";

import NextLink from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  Mic,
  Activity,
  FileCheck2,
  RefreshCw,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ExternalLink,
  Layers,
  ChevronRight
} from "lucide-react";

export default function DemoScriptPage() {
  const steps = [
    {
      time: "00:00 - 00:30",
      title: "1. The Hospital Counter Crisis & 5 Urgent Questions",
      screen: "Landing Page (paytm-lifeevent-ai.vercel.app)",
      narrative:
        "Judges, imagine it's 2:00 AM. Your 58-year-old father has been rushed to Ruby Hall Clinic ICU with acute chest pain. Standing at the counter, you face five terrifying questions: What does insurance pay? What documents are missing? What is the real gap? Where do we get emergency cash? What is our single next best action right now? Disconnected silos leave families desperate. LifeEvent AI turns this crisis into a calm, evidence-backed action plan.",
      actionLabel: "View Landing Page",
      actionHref: "/",
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
      tag: "The Crisis & Master Ledger",
    },
    {
      time: "00:30 - 01:00",
      title: "2. Multilingual Voice Intake & Verhoeff Aadhaar Masking",
      screen: "Emergency Intake (/intake)",
      narrative:
        "The attendant speaks naturally in Hindi, Marathi, or English. Notice the Aadhaar number entered. Instead of naive regex, our system runs the mathematical Verhoeff checksum algorithm client-side, instantly masking to XXXX-XXXX-2346 before any data touches the network or LLM. Zero PII leakage.",
      actionLabel: "Open Emergency Intake",
      actionHref: "/intake",
      icon: <Mic className="w-5 h-5 text-[#00baf2]" />,
      tag: "Zero-PII Ingestion",
    },
    {
      time: "01:00 - 01:45",
      title: "3. Living Dashboard & Honest Gap Range (IRDAI Math)",
      screen: "Living Dashboard (/journey/demo-journey-cardiac-01)",
      narrative:
        "Within 2.8 seconds, ingestion completes. Look at our gap card: we NEVER show a single fake exact number. We show an honest range: ₹87,600 Low, ₹99,600 Expected, ₹1,20,600 High. Why? Our deterministic Python engine factors in ₹42,000 non-payable consumables, a ₹49,350 room-rent proportional penalty, and a 10% co-pay.",
      actionLabel: "Open Cardiac Dashboard",
      actionHref: "/journey/demo-journey-cardiac-01",
      icon: <Activity className="w-5 h-5 text-emerald-600" />,
      tag: "Deterministic Math",
    },
    {
      time: "01:45 - 02:15",
      title: "4. Evidence Inspector & Planted Hallucination Trap",
      screen: "Clause Inspector (/journey/demo-journey-cardiac-01/coverage)",
      narrative:
        "Every covered rupee points to an exact verbatim sentence in the policy contract with page and clause reference. Notice our planted adversarial prompt trap: 'Hospital Five-Star Luxury Living Claim'. Our Citation Gate verified the page text, found no match, flagged it Unverified, and forced covered amount to exactly ₹0. Absolute trust by construction.",
      actionLabel: "Inspect Clause Grounding",
      actionHref: "/journey/demo-journey-cardiac-01/coverage",
      icon: <FileCheck2 className="w-5 h-5 text-[#002970]" />,
      tag: "Citation Verification",
    },
    {
      time: "02:15 - 02:40",
      title: "5. Dynamic TPA Re-planning (Live SSE Mutation)",
      screen: "Live Re-plan Trigger (/journey/demo-journey-cardiac-01)",
      narrative:
        "Real emergencies are living workflows. When the TPA insurer queries for a baseline ECG strip, watch the Financial Journey Graph mutate dynamically: the urgent task 'Collect Casualty Admission ECG Strip' is prepended to the top of the checklist, and the Next Best Action updates in real time on mobile.",
      actionLabel: "Trigger TPA Re-plan",
      actionHref: "/journey/demo-journey-cardiac-01",
      icon: <RefreshCw className="w-5 h-5 text-neutral-900" />,
      tag: "State Machine Graph",
    },
    {
      time: "02:40 - 03:00",
      title: "6. Paytm UPI Caution Deposit & Customer Approval Gateway",
      screen: "Paytm Bridge Funding (/journey/demo-journey-cardiac-01/funding)",
      narrative:
        "Finally, the hospital demands ₹50,000 caution money before moving the patient to the Cath Lab. Through our direct Paytm UPI Bridge, the family authorizes deposit in 8 seconds with auto-reconciliation directly to the hospital's TPA counter. The bed is secured. Zero admission delay. LifeEvent AI transforms the worst day of a family's life into a calm, resolved journey.",
      actionLabel: "Launch Paytm UPI Bridge",
      actionHref: "/journey/demo-journey-cardiac-01/funding",
      icon: <CreditCard className="w-5 h-5 text-cyan-600" />,
      tag: "Paytm Ecosystem Bridge",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 flex flex-col font-sans selection:bg-[#002970] selection:text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <NextLink
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-[#002970] transition-colors group mb-4"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Overview</span>
          </NextLink>

          <div className="pb-6 border-b border-neutral-200">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#002970]/5 border border-[#002970]/20 text-[11px] font-mono uppercase text-[#002970] font-semibold mb-2">
              <Award className="w-3.5 h-3.5 text-[#00baf2]" />
              <span>Official Judge Runbook // 3-Minute Demo Sequence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950">
              Executive Presentation Teleprompter & Runbook
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mt-2 leading-relaxed">
              Step-by-step 3-minute presentation script with direct one-click launchers for each live screen.
              Designed for live stage delivery and judge evaluation.
            </p>
          </div>
        </div>

        {/* Presentation Timeline */}
        <div className="space-y-6 mb-16">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl border border-slate-200 bg-white hover:border-[#002970] hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#002970] border border-blue-200">
                        {step.time}
                      </span>
                      <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#002970]">
                        {step.tag}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-950 mt-1">
                      {step.title}
                    </h2>
                  </div>
                </div>

                <NextLink
                  href={step.actionHref}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-bold bg-[#002970] text-white hover:bg-[#001d52] transition-colors self-start sm:self-auto shadow-sm flex-shrink-0"
                >
                  <span>{step.actionLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#00baf2]" />
                </NextLink>
              </div>

              <div className="pl-0 sm:pl-13 space-y-3">
                <p className="text-xs font-mono text-neutral-400">
                  Target Route: <code className="text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded">{step.screen}</code>
                </p>

                <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/80 font-serif text-xs sm:text-sm text-neutral-800 leading-relaxed italic">
                  &ldquo;{step.narrative}&rdquo;
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
