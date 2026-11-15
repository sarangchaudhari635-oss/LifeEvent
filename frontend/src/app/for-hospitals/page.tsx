"use client";

import { useState } from "react";
import Image from "next/image";
import NextLink from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  Building2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  Send,
  Zap,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  FileCheck2,
  Coins
} from "lucide-react";

export default function ForHospitalsPage() {
  const [hospitalName, setHospitalName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bedCount, setBedCount] = useState("150-300");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/pilot-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospital_name: hospitalName,
          contact_name: contactName,
          email,
          phone,
          bed_count: bedCount,
        }),
      });
      setSubmitted(true);
    } catch {
      // Offline fallback
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 flex flex-col font-sans selection:bg-[#002970] selection:text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <NextLink
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-[#002970] transition-colors group mb-4"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Overview</span>
          </NextLink>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-neutral-200">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#002970]/5 border border-[#002970]/20 text-[11px] font-mono uppercase text-[#002970] font-semibold">
                <Building2 className="w-3.5 h-3.5 text-[#00baf2]" />
                <span>Hospital Network Partnership // Pune & Maharashtra Pilot</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 leading-tight">
                Eliminate Counter Disputes. Accelerate Cashless Approvals to 45 Minutes.
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
                LifeEvent AI equips your hospital billing and TPA desks with real-time patient readiness tracking, automated Aadhaar redaction, and instant payment reconciliation.
              </p>
            </div>

            <div className="lg:col-span-5 relative h-64 sm:h-72 rounded-2xl overflow-hidden border border-neutral-200 shadow-xl group">
              <Image
                src="/images/hospital-facility.jpg"
                alt="Modern Hospital Facility"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent flex items-end p-5">
                <div className="text-white">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#00baf2] block">Certified Enterprise Node</span>
                  <span className="text-sm font-bold">Tertiary Care Hospital Network Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 hover:border-neutral-950 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#002970] text-white flex items-center justify-center mb-4">
              <Clock className="w-5 h-5 text-[#00baf2]" />
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-2">45-Minute Cashless Approvals</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Standard TPA cycles average 4.5 hours due to query ping-pong. LifeEvent AI pre-screens claims against insurer guidelines before submission.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 hover:border-neutral-950 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#002970] text-white flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-2">Zero Counter Bitterness</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Families receive transparent, clause-verified cost breakdowns on their phones, eliminating tense arguments over room rent proportional cuts.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 hover:border-neutral-950 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#002970] text-white flex items-center justify-center mb-4">
              <Coins className="w-5 h-5 text-[#00baf2]" />
            </div>
            <h3 className="text-base font-bold text-neutral-950 mb-2">Instant Caution Reconciliation</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Real-time Paytm UPI gateway bridges initial caution deposits directly into your hospital accounting ledger with automatic digital receipts.
            </p>
          </div>
        </div>

        {/* Pilot Onboarding Form Section */}
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-10 mb-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-mono uppercase tracking-widest text-[#002970] font-bold block mb-1">
                Institutional Access
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">
                Request a 30-Day Hospital Pilot
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mt-2">
                Join our Pune tertiary care cohort. Zero infrastructure changes required; integrates via existing TPA email feeds or HL7/FHIR connectors.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-white border border-emerald-200 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-950">Pilot Application Received</h3>
                <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-neutral-950">{contactName || "Doctor"}</strong>. Our Pune clinical integration lead will contact you at <strong className="text-neutral-950">{email || "your email"}</strong> within 4 business hours to deploy the counselor sandbox.
                </p>
                <div className="pt-2">
                  <NextLink
                    href="/counselor"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-bold bg-[#002970] text-white hover:bg-[#001d52] transition-colors"
                  >
                    <span>Preview Counselor Console</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </NextLink>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                      Hospital / Network Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sahyadri Super Speciality"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002970] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                      Primary Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Sharma (Billing Head)"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002970] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="billing@hospital.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002970] transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002970] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                    Operational Bed Capacity
                  </label>
                  <select
                    value={bedCount}
                    onChange={(e) => setBedCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002970] transition-all bg-white"
                  >
                    <option value="50-150">50 - 150 Beds (Nursing Home / Day Care)</option>
                    <option value="150-300">150 - 300 Beds (Mid-size Tertiary Care)</option>
                    <option value="300+">300+ Beds (Multi-Speciality Medical Campus)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 rounded-xl text-xs font-mono uppercase tracking-wider font-bold bg-[#002970] text-white hover:bg-[#001d52] transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Hospital Pilot Application</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
