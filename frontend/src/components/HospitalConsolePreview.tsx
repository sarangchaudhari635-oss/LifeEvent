"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  FileCheck2,
  Users
} from "lucide-react";

export function HospitalConsolePreview() {
  const patientQueue = [
    {
      id: "IPD-8941",
      patient: "Ramesh Kumar",
      unit: "Cardiac Care / OT-2",
      readiness: "98%",
      status: "Ready for Cashless",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      action: "Doctor Form Signed",
    },
    {
      id: "IPD-8942",
      patient: "Priya Sharma",
      unit: "Orthopedic / Daycare",
      readiness: "92%",
      status: "TPA Query Answered",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      action: "Pre-Auth Enhanced",
    },
    {
      id: "IPD-8943",
      patient: "Devendra Patel",
      unit: "Neurology / Ward 4",
      readiness: "74%",
      status: "Missing Implant Invoice",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      action: "Auto-Prompt Counselor",
    },
  ];

  return (
    <section className="relative w-full bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-paytm-navy" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-paytm-navy">
              [ 05 // INSTITUTIONAL SAAS COCKPIT ]
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.12]">
            For Hospitals: Slash admission delays and pre-auth rejections.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed">
            Hospital billing desks spend 65% of their time chasing missing clinical summaries and defending against arbitrary insurer query letters. LifeEvent AI provides an automated document readiness queue.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-2">
              <span>PRE-AUTH CYCLE TIME</span>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-neutral-900 font-mono">
              18 mins
            </div>
            <p className="text-xs text-neutral-600 mt-2">
              Down from industry average of 4.2 hours. Zero admission bottlenecks at billing desks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-2">
              <span>CLAIM DENIAL RATE</span>
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-neutral-900 font-mono">
              0.6%
            </div>
            <p className="text-xs text-neutral-600 mt-2">
              Reduced from 14.8% by automatically validating documentation against TPA checklists.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-2">
              <span>DEPOSIT DISPUTES</span>
              <CheckCircle2 className="w-4 h-4 text-paytm-navy" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-neutral-900 font-mono">
              Zero
            </div>
            <p className="text-xs text-neutral-600 mt-2">
              Backed by instant 8-second Paytm UPI Caution Deposit liquidity bridges.
            </p>
          </div>
        </div>

        {/* Live Counselor Dashboard Mockup */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold uppercase text-neutral-300">
                  Hospital Financial Counselor Console &bull; Live Patient Admission Queue
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                City Super Speciality Hospital &bull; Cashless Insurance Desk #03
              </p>
            </div>
            <Link
              href="/counselor"
              className="px-4 py-2 rounded-lg bg-paytm-cyan text-paytm-navy text-xs font-black hover:bg-white transition-all flex items-center gap-2 shadow-sm"
            >
              <Users className="w-3.5 h-3.5 text-paytm-navy" />
              <span>Open Counselor View</span>
            </Link>
          </div>

          {/* Hospital Campus Visual Banner */}
          <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden mt-6 border border-neutral-800 shadow-inner">
            <Image
              src="/images/hospital-facility.jpg"
              alt="Hospital Cashless Empaneled Network"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/60 to-transparent" />
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <span className="text-paytm-cyan font-mono text-[10px] font-bold uppercase tracking-widest">
                INTEGRATED HIMS & TPA GREEN CHANNEL
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                Automated ABDM Document Sync Across 420+ Partner Hospitals
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Pre-authorization forms auto-audited against IRDAI criteria before human submission.
              </p>
            </div>
          </div>

          {/* Queue Table */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-neutral-400 border-b border-neutral-800 pb-2">
                  <th className="py-2.5 font-bold">IPD ID</th>
                  <th className="py-2.5 font-bold">Patient Name</th>
                  <th className="py-2.5 font-bold">Clinical Unit</th>
                  <th className="py-2.5 font-bold">Readiness Score</th>
                  <th className="py-2.5 font-bold">Status</th>
                  <th className="py-2.5 font-bold text-right">Auto Next Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {patientQueue.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 text-neutral-400">{p.id}</td>
                    <td className="py-3.5 font-bold text-white font-sans">{p.patient}</td>
                    <td className="py-3.5 text-neutral-400">{p.unit}</td>
                    <td className="py-3.5 font-bold text-emerald-400">{p.readiness}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-paytm-cyan font-bold">{p.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-6 mt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="text-[11px] font-mono text-neutral-400">
              ABDM M1, M2, M3 Compliant &bull; HL7 FHIR Standard
            </span>
            <Link
              href="/for-hospitals"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-paytm-cyan hover:text-white transition-colors"
            >
              <span>Explore Hospital Enterprise Pilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
