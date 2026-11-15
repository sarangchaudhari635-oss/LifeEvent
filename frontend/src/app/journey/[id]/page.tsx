"use client";

import { useEffect, useState, use } from "react";
import NextLink from "next/link";
import { Navbar } from "@/components/Navbar";
import { LivingJourneyLine } from "@/components/LivingJourneyLine";
import { EvidenceModal } from "@/components/EvidenceModal";
import { Language, translations } from "@/lib/translations";
import { formatINR } from "@/lib/utils";
import {
  ShieldAlert,
  ArrowRight,
  FileText,
  CreditCard,
  RefreshCw,
  CheckCircle2,
  Clock,
  Building2,
  HeartPulse,
  Info,
  ShieldCheck,
  Zap,
  Lock,
  QrCode,
  ChevronRight,
  Trash2,
  SlidersHorizontal,
  FileCheck,
  Camera,
  AlertCircle
} from "lucide-react";

interface JourneyData {
  id: string;
  intake: {
    patient_name: string;
    hospital_name: string;
    condition_description: string;
    urgency: string;
    estimated_amount: number;
    known_insurer: string;
  };
  documents?: Array<{
    name: string;
    type: string;
    status?: string;
    preview?: string | null;
  }>;
  coverage_findings: Array<{
    category: string;
    estimated_cost: number;
    likely_covered: number;
    out_of_pocket: number;
    confidence: string;
    evidence_doc: string;
    evidence_page: number;
    evidence_passage: string;
    clause_ref: string;
    verified_against_source: boolean;
  }>;
  gap: {
    estimated_total_cost: number;
    likely_covered_total: number;
    gap_expected: number;
    gap_low: number;
    gap_high: number;
    non_payable_consumables: number;
    room_rent_penalty: number;
    copay_amount: number;
    assumptions: string[];
  };
  checklist: Array<{
    id: string;
    title: string;
    responsible_party: string;
    status: string;
    deadline_minutes: number;
    required_doc: string;
  }>;
  funding_options: Array<any>;
  timeline_events: Array<{
    id: string;
    timestamp: string;
    title: string;
    description: string;
    actor: string;
    status: "completed" | "done" | "in_progress" | "pending";
  }>;
  current_stage: string;
  next_best_action: string;
  is_demo: boolean;
}

const FALLBACK_JOURNEY: JourneyData = {
  id: "demo-journey-cardiac-01",
  intake: {
    patient_name: "Ramesh Kulkarni",
    hospital_name: "Sample City Hospital (Apollo Pune Network)",
    condition_description: "Acute chest pain, acute coronary syndrome, immediate angioplasty recommended.",
    urgency: "critical",
    estimated_amount: 420000,
    known_insurer: "Sample Health Insurance Co."
  },
  coverage_findings: [
    {
      category: "Room Rent & Nursing Expenses",
      estimated_cost: 34000,
      likely_covered: 20000,
      out_of_pocket: 14000,
      confidence: "High",
      evidence_doc: "Sample_Health_Policy_Document.pdf",
      evidence_page: 3,
      evidence_passage: "The company shall indemnify room, boarding, and nursing expenses up to a maximum of INR 5,000 per day for standard category rooms.",
      clause_ref: "Section 2.1",
      verified_against_source: true
    },
    {
      category: "Cath Lab, Angioplasty & Stent Hardware",
      estimated_cost: 240000,
      likely_covered: 240000,
      out_of_pocket: 0,
      confidence: "High",
      evidence_doc: "Hospital_PreAuth_Estimate.pdf",
      evidence_page: 1,
      evidence_passage: "Treatment Plan: PTCA with Drug Eluting Stent. Total Estimated Cost: INR 4,20,000.",
      clause_ref: "Clinical Estimate 1.1",
      verified_against_source: true
    },
    {
      category: "Hospital Non-Payable Consumables & Admin Kits",
      estimated_cost: 42000,
      likely_covered: 0,
      out_of_pocket: 42000,
      confidence: "Medium",
      evidence_doc: "Sample_Health_Policy_Document.pdf",
      evidence_page: 7,
      evidence_passage: "Expenses incurred on non-medical items such as gloves, cotton, sanitizer, thermometers, and administrative files are not payable under this policy schedule.",
      clause_ref: "General Exclusions 4.8",
      verified_against_source: true
    },
    {
      category: "Unverified Five-Star Luxury Upgrade",
      estimated_cost: 25000,
      likely_covered: 0,
      out_of_pocket: 25000,
      confidence: "Unverified",
      evidence_doc: "Sample_Health_Policy_Document.pdf",
      evidence_page: 1,
      evidence_passage: "Hospital promises suite room reimbursement under VIP tier.",
      clause_ref: "Unverified Note 9.9",
      verified_against_source: false
    }
  ],
  gap: {
    estimated_total_cost: 420000,
    likely_covered_total: 260000,
    gap_expected: 160000,
    gap_low: 140000,
    gap_high: 185000,
    non_payable_consumables: 42000,
    room_rent_penalty: 49350,
    copay_amount: 0,
    assumptions: [
      "Room rent capped at ₹5,000/day. Patient admitted to ₹8,500/day Deluxe room triggers 41% proportional cut across associated doctors & ICU charges.",
      "Consumables (gloves, syringes, drapes, administrative files) not payable under IRDAI 2024 Schedule.",
      "Stent hardware qualified under CGHS ceiling cap."
    ]
  },
  checklist: [
    {
      id: "task-01",
      title: "Submit Patient Aadhaar and Signed Form Part B to Hospital Insurance Desk (Counter #4)",
      responsible_party: "Family Attendant",
      status: "pending",
      deadline_minutes: 20,
      required_doc: "Form Part B & Masked Aadhaar"
    },
    {
      id: "task-02",
      title: "Confirm Room Category Allocation (Twin Sharing vs Deluxe) with Admissions Office",
      responsible_party: "Family Attendant",
      status: "done",
      deadline_minutes: 45,
      required_doc: "Room Category Undertaking"
    },
    {
      id: "task-03",
      title: "Collect Pre-Authorization Sanction Letter from TPA Desk",
      responsible_party: "Hospital TPA Desk",
      status: "pending",
      deadline_minutes: 60,
      required_doc: "TPA Initial Sanction Approval"
    }
  ],
  funding_options: [
    {
      id: "offer-paytm-credit",
      provider: "Paytm Health Credit",
      type: "Direct Hospital Disbursal",
      amount_limit: 150000,
      tenure_months: 6,
      monthly_emi: 25000,
      interest_rate_annual: 0.0,
      disbursal_speed_minutes: 10,
      required_docs: ["Aadhaar OTP", "Bank Account Statement"]
    }
  ],
  timeline_events: [
    {
      id: "evt-01",
      timestamp: "10:30 AM",
      title: "Emergency Casualty Admission",
      description: "Patient Ramesh Kulkarni arrived at casualty triage with acute chest pain. Vitals recorded.",
      actor: "Casualty Desk",
      status: "completed"
    },
    {
      id: "evt-02",
      timestamp: "10:42 AM",
      title: "Initial Pre-Auth Documents Ingested",
      description: "Policy Schedule PDF and Hospital Pre-Auth form parsed. Verhoeff Aadhaar redaction applied.",
      actor: "LifeEvent AI Engine",
      status: "completed"
    },
    {
      id: "evt-03",
      timestamp: "10:48 AM",
      title: "TPA Cashless Query Pending",
      description: "Awaiting submission of signed Part B form to Hospital Insurance Desk (Counter #4).",
      actor: "Hospital Counter #4",
      status: "in_progress"
    }
  ],
  current_stage: "preauth_pending",
  next_best_action: "Submit Patient Aadhaar and Signed Form Part B to Hospital Insurance Desk (Counter #4)",
  is_demo: true
};

export default function JourneyDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const journeyId = resolvedParams.id;

  const [lang, setLang] = useState<Language>("en");
  const t = translations[lang] || translations.en;

  const [journey, setJourney] = useState<JourneyData>(FALLBACK_JOURNEY);
  const [activeTab, setActiveTab] = useState<"journey" | "breakdown" | "funding">("journey");
  const [isReplanning, setIsReplanning] = useState(false);
  const [replanNotice, setReplanNotice] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [depositPaid, setDepositPaid] = useState(false);

  useEffect(() => {
    fetch(`/api/journey/${journeyId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.gap) {
          setJourney(data);
        }
      })
      .catch(() => {
        // Fallback initialized
      });
  }, [journeyId]);

  const handleSimulateReplan = async () => {
    setIsReplanning(true);
    setReplanNotice(null);
    try {
      const res = await fetch(`/api/journey/${journeyId}/replan`, {
        method: "POST"
      });
      if (res.ok) {
        const updated = await res.json();
        setJourney(updated);
        setReplanNotice("Simulated TPA Query Ingested! Your journey timeline has adapted with urgent tasks.");
      } else {
        const updated = { ...journey };
        updated.checklist.unshift({
          id: "task-tpa-urgent",
          title: "URGENT: Submit Casualty Admission ECG Strip to Counter #4",
          responsible_party: "Family Attendant",
          status: "pending",
          deadline_minutes: 15,
          required_doc: "ECG Strip & Doctor Note"
        });
        updated.timeline_events.push({
          id: "evt-tpa-query",
          timestamp: "11:15 AM",
          title: "TPA Query: Admission ECG Strip Required",
          description: "Insurer TPA requested clear admission ECG strip before approving cashless sanction.",
          actor: "Insurer TPA Desk",
          status: "in_progress"
        });
        updated.next_best_action = "URGENT: Submit Casualty Admission ECG Strip to Insurance Desk (Counter #4)";
        setJourney(updated);
        setReplanNotice("Simulated TPA Query Ingested! Your journey timeline has adapted with urgent tasks.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReplanning(false);
    }
  };

  const gap = journey.gap || FALLBACK_JOURNEY.gap;
  const intake = journey.intake || FALLBACK_JOURNEY.intake;
  const coveragePercent = Math.round((gap.likely_covered_total / (gap.estimated_total_cost || 1)) * 100);

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 flex flex-col font-sans selection:bg-[#002970] selection:text-white">
      <Navbar currentLang={lang} onLanguageChange={setLang} />

      {/* Luminous, Reassuring Context Banner */}
      <div className="bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900 text-sm">{intake.patient_name}</span>
            <span className="text-slate-300">&bull;</span>
            <span className="text-slate-600">{intake.hospital_name}</span>
            <span className="hidden sm:inline text-slate-300">&bull;</span>
            <span className="hidden sm:inline px-2 py-0.5 rounded-md bg-blue-50 text-[#002970] font-mono font-semibold text-[11px] border border-blue-100">
              ACUTE CORONARY CARE
            </span>
          </div>

          <button
            onClick={handleSimulateReplan}
            disabled={isReplanning}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-white hover:bg-slate-50 text-[#002970] border border-slate-200 shadow-xs transition-all disabled:opacity-50"
            title="Simulates insurer TPA raising a clarification query to re-plan the living timeline"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReplanning ? "animate-spin" : ""}`} />
            <span>{isReplanning ? "Re-planning SSE..." : "Simulate TPA Query"}</span>
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 w-full flex-grow">
        {replanNotice && (
          <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs font-mono text-amber-900 flex items-center gap-3 shadow-xs animate-in fade-in duration-200">
            <Zap className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="font-semibold">{replanNotice}</span>
          </div>
        )}

        {/* 1. Calm, Luminous Financial Overview Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_4px_24px_-4px_rgba(0,41,112,0.06)] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-mono font-bold text-[#002970] uppercase tracking-wider block">
                Estimated Family Out-of-Pocket Liability
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">
                {formatINR(gap.gap_low)} &ndash; {formatINR(gap.gap_high)}
              </div>
              <span className="text-xs text-slate-500 mt-0.5 block">
                Deterministic IRDAI calculation based on room category & consumables
              </span>
            </div>

            <div className="sm:text-right p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70">
              <span className="text-[10px] font-mono text-amber-800 uppercase tracking-widest block font-semibold">
                Statistical Expected Gap
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-900 font-mono">
                ~{formatINR(gap.gap_expected)}
              </span>
            </div>
          </div>

          {/* Visual Split Bar */}
          <div className="space-y-2 mb-6">
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
              <div
                style={{ width: `${coveragePercent}%` }}
                className="bg-emerald-500 transition-all duration-500"
                title={`Likely Covered: ${formatINR(gap.likely_covered_total)}`}
              />
              <div
                style={{ width: `${100 - coveragePercent}%` }}
                className="bg-amber-400 transition-all duration-500"
                title={`Family Out-of-Pocket: ${formatINR(gap.gap_expected)}`}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-600">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Insurance Covers: <strong className="text-slate-900">{formatINR(gap.likely_covered_total)}</strong> ({coveragePercent}%)</span>
              </span>
              <span className="flex items-center gap-2 text-amber-900">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Family Arranges: <strong className="text-slate-900">~{formatINR(gap.gap_expected)}</strong></span>
              </span>
            </div>
          </div>

          {/* Why this range? */}
          <div className="bg-slate-50 rounded-xl p-4 text-xs font-mono text-slate-700 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 text-[#002970] flex-shrink-0" />
              <span>
                Based on Room Rent cap (₹5,000/day) & 10% non-payable hospital consumables (gloves, syringes).
              </span>
            </div>
            <button
              onClick={() => setActiveTab("breakdown")}
              className="text-[#002970] font-bold hover:underline flex-shrink-0 flex items-center gap-1 text-xs"
            >
              <span>See Clause Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Urgent Next Best Action (Clear, Serene Callout) */}
        <div className="bg-gradient-to-r from-blue-50/70 via-white to-white rounded-2xl p-6 sm:p-7 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-l-4 border-[#002970] border-y border-r border-slate-200/80">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-white text-[#002970] border border-blue-200 rounded-xl flex-shrink-0 mt-0.5 shadow-xs">
              <Clock className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#002970] uppercase tracking-wider block">
                Next Immediate Best Action
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                {journey.next_best_action || FALLBACK_JOURNEY.next_best_action}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Takes ~15 mins &bull; Required to secure cashless pre-authorization sanction from TPA
              </p>
            </div>
          </div>

          <NextLink
            href="/documents"
            className="inline-flex items-center justify-center gap-2 bg-[#002970] text-white px-5 py-3 rounded-xl text-xs font-semibold hover:bg-[#001d52] transition-all shadow-xs flex-shrink-0 self-start sm:self-auto active:scale-98"
          >
            <span>View Required IDs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NextLink>
        </div>

        {/* 3. Three Focused Tabs: Journey, Breakdown, Funding */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border border-slate-200 mb-8 bg-slate-100/70 rounded-xl p-1 gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveTab("journey")}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "journey"
                ? "bg-white text-[#002970] shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Clock className="w-4 h-4 text-[#00baf2]" />
            <span>Living Journey & Tasks</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
              {journey.checklist.filter((c) => c.status === "done" || c.status === "completed").length}/{journey.checklist.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("breakdown")}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "breakdown"
                ? "bg-white text-[#002970] shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <FileText className="w-4 h-4 text-[#00baf2]" />
            <span>Clause Evidence</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
              {journey.coverage_findings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("funding")}
            className={`flex-1 py-3 px-4 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeTab === "funding"
                ? "bg-white text-[#002970] shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#00baf2]" />
            <span>Payment & Deposit</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold">
              ₹50k Caution
            </span>
          </button>
        </div>

        {/* Tab 1: Journey Timeline & Checklist */}
        {activeTab === "journey" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Timeline of Events & Approvals</h3>
                  <p className="text-[11px] text-slate-500">Live synchronization with hospital counter and TPA desk</p>
                </div>
                <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Sync
                </span>
              </div>

              <LivingJourneyLine
                events={journey.timeline_events || FALLBACK_JOURNEY.timeline_events}
                onReplan={handleSimulateReplan}
                isReplanning={isReplanning}
              />
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Family Admission Checklist</h3>
              <div className="space-y-2.5">
                {journey.checklist.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                      item.title.includes("URGENT")
                        ? "bg-amber-50/80 border-amber-300 ring-1 ring-amber-300"
                        : "bg-slate-50/70 border-slate-200"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={item.status === "done" || item.status === "completed"}
                        readOnly
                        className="mt-0.5 rounded text-[#002970] focus:ring-0"
                      />
                      <div>
                        <p className={`font-bold ${item.title.includes("URGENT") ? "text-amber-900" : "text-slate-800"}`}>
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Responsible: <span className="font-semibold text-slate-700">{item.responsible_party}</span> &bull; Target: <span className="font-semibold text-slate-700">{item.deadline_minutes} mins</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 flex-shrink-0">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Clause Evidence */}
        {activeTab === "breakdown" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Clause-Verified Policy Coverage</h3>
              <p className="text-xs text-slate-500 mb-4">
                Click any line item to inspect the verbatim policy text extracted from your document.
              </p>

              <div className="space-y-3">
                {journey.coverage_findings.map((finding, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedClaim({ ...finding, is_verified: finding.verified_against_source })}
                    className="p-4 rounded-xl border border-slate-200 hover:border-[#002970] transition-all cursor-pointer bg-slate-50/40 hover:bg-blue-50/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{finding.category}</span>
                        {finding.verified_against_source ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                            Verified in Policy
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200">
                            Needs TPA Confirmation
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs font-semibold text-slate-500">
                        Clause {finding.clause_ref}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 italic border-l-2 border-[#00baf2] pl-2 mb-2 font-serif">
                      &ldquo;{finding.evidence_passage}&rdquo;
                    </p>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {finding.evidence_doc} &bull; Page {finding.evidence_page}
                      </span>
                      <span className="font-semibold text-slate-800">
                        Likely Covered: <strong className="text-emerald-700">{formatINR(finding.likely_covered)}</strong>
                        {finding.out_of_pocket > 0 && (
                          <span className="ml-2 text-amber-900">(Gap: {formatINR(finding.out_of_pocket)})</span>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Emergency Funding & Payments */}
        {activeTab === "funding" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Hospital Caution Deposit (₹50,000)</h3>
                  <p className="text-xs text-slate-500">Required by hospital admission counter for ICU bed allocation</p>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-200">
                  Urgent Clearance
                </span>
              </div>

              {depositPaid ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                  <div className="text-xs text-emerald-900">
                    <span className="font-bold">₹50,000 Deposit Acknowledged! </span>
                    <span>Digital receipt generated (TXN-88492019) and auto-reconciled with Counter #4.</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-[#002970] font-mono text-xs shadow-xs">
                      <QrCode className="w-7 h-7 text-[#002970]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Pay via Paytm UPI</span>
                      <span className="text-[11px] text-slate-500 font-mono">Instant direct hospital settlement</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setDepositPaid(true)}
                    className="w-full sm:w-auto bg-[#002970] text-white font-semibold px-4 py-2.5 rounded-lg text-xs hover:bg-[#001d52] shadow-xs transition-colors"
                  >
                    Simulate UPI Pay (₹50,000)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Verified Evidence Modal */}
      {selectedClaim && (
        <EvidenceModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
        />
      )}
    </div>
  );
}
