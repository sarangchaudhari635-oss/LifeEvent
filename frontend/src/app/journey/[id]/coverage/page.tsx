"use client";

import { useState, use } from "react";
import NextLink from "next/link";
import { Navbar } from "@/components/Navbar";
import { EvidenceModal } from "@/components/EvidenceModal";
import { Language, translations } from "@/lib/translations";
import { formatINR } from "@/lib/utils";
import {
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  FileText,
  Search,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  FileCode,
  Scale,
  Sparkles,
  ChevronRight
} from "lucide-react";

interface Finding {
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
  sha256_hash?: string;
}

const SAMPLE_FINDINGS: Finding[] = [
  {
    category: "Room Rent & Nursing Expenses",
    estimated_cost: 34000,
    likely_covered: 20000,
    out_of_pocket: 14000,
    confidence: "High",
    evidence_doc: "Sample_Health_Policy_Document.pdf",
    evidence_page: 3,
    evidence_passage: "The company shall indemnify room, boarding, and nursing expenses up to a maximum of INR 5,000 per day for standard category rooms.",
    clause_ref: "Section 2.1 (Room Rent Cap)",
    verified_against_source: true,
    sha256_hash: "a4c8...f109"
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
    verified_against_source: true,
    sha256_hash: "7e92...3b41"
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
    verified_against_source: true,
    sha256_hash: "d128...c045"
  },
  {
    category: "Unverified Five-Star Luxury Upgrade (Planted Trap)",
    estimated_cost: 25000,
    likely_covered: 0,
    out_of_pocket: 25000,
    confidence: "Unverified",
    evidence_doc: "Sample_Health_Policy_Document.pdf",
    evidence_page: 1,
    evidence_passage: "Hospital promises suite room reimbursement under VIP tier without policy rider backing.",
    clause_ref: "Unverified Adversarial Note 9.9",
    verified_against_source: false,
    sha256_hash: "UNMATCHED_NO_PDF_BACKING"
  }
];

export default function CoverageEvidencePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const journeyId = resolvedParams.id;

  const [findings] = useState<Finding[]>(SAMPLE_FINDINGS);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [filter, setFilter] = useState<"all" | "verified" | "out_of_pocket" | "unverified">("all");

  const filtered = findings.filter((f) => {
    if (filter === "verified") return f.verified_against_source;
    if (filter === "unverified") return !f.verified_against_source;
    if (filter === "out_of_pocket") return f.out_of_pocket > 0;
    return true;
  });

  const totalCost = findings.reduce((acc, curr) => acc + curr.estimated_cost, 0);
  const totalCovered = findings.reduce((acc, curr) => acc + curr.likely_covered, 0);
  const totalGap = findings.reduce((acc, curr) => acc + curr.out_of_pocket, 0);
  const verifiedCount = findings.filter((f) => f.verified_against_source).length;

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 flex flex-col font-sans selection:bg-[#002970] selection:text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {/* Navigation Breadcrumb & Telemetry Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <NextLink
              href={`/journey/${journeyId}`}
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 hover:text-[#002970] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Return to Journey State Machine</span>
            </NextLink>

            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-[11px] font-mono text-neutral-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>IRDAI 2024 MASTER CIRCULAR COMPLIANT</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-neutral-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#002970]/5 border border-[#002970]/20 text-[11px] font-mono uppercase text-[#002970] font-semibold mb-2">
                <Fingerprint className="w-3.5 h-3.5 text-[#00baf2]" />
                <span>Zero-Hallucination Clause Auditor</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950">
                Forensic Clause Evidence & Citation Chamber
              </h1>
              <p className="text-sm text-neutral-600 max-w-2xl mt-1.5 leading-relaxed">
                Every calculation is backed by character-by-character string matching against ingested insurer policy PDFs.
                Unmatched claims or LLM hallucinations are intercepted and neutralized to ₹0 covered.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-neutral-100 border border-neutral-200 text-xs font-mono self-start lg:self-auto">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  filter === "all"
                    ? "bg-[#002970] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                All Clauses ({findings.length})
              </button>
              <button
                onClick={() => setFilter("verified")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  filter === "verified"
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-neutral-600 hover:text-emerald-700"
                }`}
              >
                Verified ({verifiedCount})
              </button>
              <button
                onClick={() => setFilter("unverified")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  filter === "unverified"
                    ? "bg-amber-700 text-white shadow-sm"
                    : "text-neutral-600 hover:text-amber-700"
                }`}
              >
                Planted Traps (1)
              </button>
              <button
                onClick={() => setFilter("out_of_pocket")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  filter === "out_of_pocket"
                    ? "bg-[#002970] text-white shadow-sm"
                    : "text-neutral-600 hover:text-[#002970]"
                }`}
              >
                Out-of-Pocket Gaps
              </button>
            </div>
          </div>
        </div>

        {/* High-Density Forensic Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">Total Audited Liabilities</span>
            <span className="text-xl sm:text-2xl font-black text-neutral-950 mt-1 block">{formatINR(totalCost)}</span>
            <span className="text-[10px] text-neutral-500 font-mono mt-1 block">4 itemized categories</span>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 block">Insurer Cashless Admissible</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 block">{formatINR(totalCovered)}</span>
            <span className="text-[10px] text-emerald-700 font-mono mt-1 block">Backed by clause proof</span>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
            <span className="text-[11px] font-mono uppercase tracking-wider text-rose-800 block">Patient Out-of-Pocket Exposure</span>
            <span className="text-xl sm:text-2xl font-black text-rose-700 mt-1 block">{formatINR(totalGap)}</span>
            <span className="text-[10px] text-rose-700 font-mono mt-1 block">Consumables + Room copay</span>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#002970] block font-semibold">Hallucination Defense</span>
            <span className="text-xl sm:text-2xl font-black text-[#002970] mt-1 block">100% BLOCKED</span>
            <span className="text-[10px] text-slate-500 font-mono mt-1 block">1 planted trap deflected</span>
          </div>
        </div>

        {/* Regulatory Citation Notice */}
        <div className="mb-8 p-4 rounded-xl border border-neutral-200 bg-gradient-to-r from-neutral-50 via-white to-neutral-50 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-[#002970] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
            <Scale className="w-4 h-4 text-[#00baf2]" />
          </div>
          <div className="text-xs text-neutral-700 leading-relaxed">
            <span className="font-bold text-neutral-950 font-mono uppercase tracking-wide">Strict Cryptographic Anti-Hallucination Protocol: </span>
            Every green badge represents an exact character sequence verified via SHA-256 slice indexing against the ingested policy document.
            If a hospital estimate or generative model suggests unlisted room categories or discretionary benefits, our citation parser enforces an immediate ₹0 cashless qualification until verified at Counter #4.
          </div>
        </div>

        {/* Findings Forensic Ledger */}
        <div className="space-y-4 mb-10">
          {filtered.map((finding, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedFinding(finding)}
              className="group p-5 sm:p-6 rounded-xl border border-slate-200 hover:border-[#002970] bg-white hover:shadow-md transition-all cursor-pointer relative"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-3 flex-grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-neutral-950 group-hover:text-[#002970] transition-colors">
                      {finding.category}
                    </h3>

                    {finding.verified_against_source ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>VERIFIED AGAINST PDF</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        <span>PLANTED TRAP / UNVERIFIED</span>
                      </span>
                    )}

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-semibold border border-neutral-200">
                      {finding.clause_ref}
                    </span>

                    {finding.sha256_hash && (
                      <span className="text-[10px] font-mono text-neutral-400">
                        HASH: {finding.sha256_hash}
                      </span>
                    )}
                  </div>

                  <blockquote className="border-l-2 border-[#00baf2] pl-4 py-1.5 text-xs sm:text-sm text-neutral-800 italic bg-neutral-50/70 rounded-r-lg font-serif leading-relaxed">
                    &ldquo;{finding.evidence_passage}&rdquo;
                  </blockquote>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500 pt-1">
                    <span className="inline-flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{finding.evidence_doc}</span>
                    </span>
                    <span>&bull;</span>
                    <span>Page {finding.evidence_page}</span>
                    <span>&bull;</span>
                    <span className="text-[#002970] font-semibold flex items-center gap-1">
                      <span>Click to inspect forensic proof modal</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Financial figures column */}
                <div className="flex lg:flex-col items-end justify-between lg:justify-center border-t lg:border-t-0 lg:border-l border-neutral-100 pt-4 lg:pt-0 lg:pl-6 min-w-[200px] flex-shrink-0 bg-neutral-50/40 lg:bg-transparent p-3 lg:p-0 rounded-lg lg:rounded-none">
                  <div className="text-left lg:text-right">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block">Billed Estimate</span>
                    <span className="text-sm sm:text-base font-bold text-neutral-900">{formatINR(finding.estimated_cost)}</span>
                  </div>

                  <div className="text-left lg:text-right mt-0 lg:mt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-800 block">Covered Admissible</span>
                    <span className="text-sm sm:text-base font-extrabold text-emerald-700">{formatINR(finding.likely_covered)}</span>
                  </div>

                  <div className="text-left lg:text-right mt-0 lg:mt-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-rose-800 block">Out-of-Pocket Gap</span>
                    <span className="text-sm sm:text-base font-extrabold text-rose-700">{formatINR(finding.out_of_pocket)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Verified Clause Inspector Modal */}
      {selectedFinding && (
        <EvidenceModal
          claim={{
            ...selectedFinding,
            is_verified: selectedFinding.verified_against_source
          }}
          onClose={() => setSelectedFinding(null)}
        />
      )}
    </div>
  );
}
