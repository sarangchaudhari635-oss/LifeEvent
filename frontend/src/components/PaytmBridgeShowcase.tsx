"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Receipt
} from "lucide-react";

export function PaytmBridgeShowcase() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      time: "8 Seconds",
      badge: "Instant Approval",
      title: "Immediate Admission Clearance",
      desc: "Emergency counter demands ₹50,000 caution deposit before transferring patient to ICU. Paytm UPI authorizes payment instantly without family debt stress.",
    },
    {
      num: "02",
      time: "Zero Interest",
      badge: "Subvention Partner",
      title: "30-Day Floating Liquidity",
      desc: "Zero-cost bridge financing while the insurer TPA processes formal pre-authorization. Zero fees if cleared upon claim settlement.",
    },
    {
      num: "03",
      time: "Automated",
      badge: "Counter #4 HIMS",
      title: "Direct Hospital Ledger Reconciliation",
      desc: "Digital receipt and UTR automatically transmitted to Sample City Hospital insurance desk, eliminating physical paper slips at 2:00 AM.",
    },
    {
      num: "04",
      time: "DPDP 2023",
      badge: "100% Redacted",
      title: "Zero-Knowledge Credit Check",
      desc: "Aadhaar number verified on device using Verhoeff check-digit without persisting unmasked identity documents or storing biometric data.",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200/80 bg-white">
      <div className="space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-[11px] font-mono uppercase text-paytm-navy font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-paytm-navy" />
            <span className="tracking-widest">[ 04 // PAYTM EMERGENCY LIQUIDITY RAIL ]</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
            Instant Caution Deposit & Emergency Bridge
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Hospitals routinely demand caution deposits before ICU bed allocation. LifeEvent AI integrates directly with Paytm UPI to bridge initial out-of-pocket liabilities in under 10 seconds.
          </p>
        </div>

        {/* 4-Step Interactive Narrative Engine */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive 4-Stage Step Stack */}
          <div className="lg:col-span-6 space-y-3">
            {steps.map((s, idx) => {
              const isSelected = activeStep === idx;
              return (
                <div
                  key={s.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-neutral-950 text-white border-neutral-950 shadow-md ring-1 ring-neutral-800"
                      : "bg-white text-neutral-900 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className={`flex items-center justify-between text-[11px] font-mono mb-1 ${
                    isSelected ? "text-neutral-400" : "text-neutral-500"
                  }`}>
                    <span className={`font-bold ${isSelected ? "text-paytm-cyan" : "text-paytm-navy"}`}>{s.num} &bull; {s.time}</span>
                    <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                      isSelected ? "bg-neutral-900 border border-neutral-800 text-neutral-200" : "bg-neutral-100 border border-neutral-200 text-neutral-700"
                    }`}>
                      {s.badge}
                    </span>
                  </div>
                  <h3 className={`text-sm sm:text-base font-bold mt-1 ${
                    isSelected ? "text-white" : "text-neutral-900"
                  }`}>
                    {s.title}
                  </h3>
                  <p className={`text-xs mt-1 leading-relaxed ${
                    isSelected ? "text-neutral-300" : "text-neutral-600"
                  }`}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Column: Luminous Paytm UPI Transaction Mockup */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,41,112,0.06)] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Receipt Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#002970] to-[#001744] flex items-center justify-center font-bold text-white text-xs shadow-xs">
                    P
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Paytm Emergency Caution Bridge
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      TXN ID: PYTM-2026-9812-74
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>DISBURSED (8.2s)</span>
                </div>
              </div>

              {/* Amount Display */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-center mb-6">
                <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
                  DISBURSED EMERGENCY AMOUNT
                </span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 font-mono mt-1 block">
                  ₹1,20,000.00
                </span>
                <span className="text-[11px] text-emerald-700 mt-1 block font-mono font-semibold">
                  &bull; 0% Interest for 30 Days &bull; Backed by Verified Policy
                </span>
              </div>

              {/* Breakdown Details */}
              <div className="space-y-2.5 text-xs font-mono mb-6">
                <div className="flex items-center justify-between text-slate-600 pb-2 border-b border-slate-100">
                  <span>Beneficiary Hospital</span>
                  <span className="text-slate-900 font-bold">Apollo Hospitals Main ER</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 pb-2 border-b border-slate-100">
                  <span>Merchant UPI VPA</span>
                  <span className="text-slate-900 font-mono">apollo.emergency@paytm</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 pb-2 border-b border-slate-100">
                  <span>Patient Admission #</span>
                  <span className="text-slate-900">IPD-2026-CARD-084</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Reconciliation Policy</span>
                  <span className="text-[#002970] font-bold">Auto-Return at TPA Final Clearance</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                Direct Integration via Paytm UPI Gateway
              </span>
              <Link
                href="/journey/demo-journey-cardiac-01/funding"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002970] hover:underline transition-colors"
              >
                <span>Simulate UPI Payment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
