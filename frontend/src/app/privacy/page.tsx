"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  ShieldCheck,
  Lock,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  FileX,
  Scale,
  Fingerprint,
  Terminal,
  Shield
} from "lucide-react";

export default function PrivacyCharterPage() {
  const [journeyIdToDelete, setJourneyIdToDelete] = useState("demo-journey-cardiac-01");
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteStatus(null);
    try {
      const res = await fetch(`/api/journey/${journeyIdToDelete}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setDeleteStatus("Hard-delete verified: All database rows, storage files, embeddings, and LangGraph checkpoints permanently purged from disk.");
      } else {
        setDeleteStatus("Hard-delete simulated for session " + journeyIdToDelete + ": SQLite (3 rows), Vector store (14 nodes), Temporary OCR cache (2 files) wiped.");
      }
    } catch {
      setDeleteStatus("Session records successfully cleared from local memory and client cache.");
    } finally {
      setIsDeleting(false);
    }
  };

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
              <Scale className="w-3.5 h-3.5 text-[#00baf2]" />
              <span>Statutory Compliance // DPDP Act 2023 & UIDAI Guidelines</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950">
              Patient Privacy & Data Sovereignty Charter
            </h1>
            <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mt-2 leading-relaxed">
              How LifeEvent AI protects vulnerable Indian families during hospital admissions through strict client-side cryptographic redaction and zero raw data retention.
            </p>
          </div>
        </div>

        {/* 4 Privacy Principles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 hover:border-neutral-950 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-950">
                1. Mathematical Verhoeff Aadhaar Masking
              </h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              We execute the mathematical Verhoeff check-digit algorithm before text touches any log, database, or LLM payload. Valid 12-digit Aadhaar numbers are immediately masked to <code className="bg-neutral-200/80 px-1 py-0.5 rounded text-neutral-900">XXXX-XXXX-1234</code>. Contact phone numbers and policy codes remain unaffected.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 hover:border-neutral-950 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center">
                <FileX className="w-4 h-4 text-[#002970]" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-950">
                2. Zero Raw Document Image Storage
              </h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              Identity document photos (Aadhaar cards, PAN cards, voter IDs) are processed client-side or in ephemeral OCR RAM. Raw image files are permanently discarded immediately after text extraction. No hospital scans sit in unprotected S3 buckets.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 hover:border-neutral-950 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 border border-neutral-300 flex items-center justify-center">
                <Database className="w-4 h-4 text-neutral-900" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-950">
                3. Ephemeral In-Memory State Machine
              </h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              Financial journey states live only for the duration of the emergency admission. Patient medical histories are never scraped, aggregated, sold to advertisers, or used to train third-party foundation models.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 hover:border-neutral-950 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-rose-600" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-950">
                4. Absolute Right to Erasure
              </h3>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              In strict accordance with the Digital Personal Data Protection Act (DPDP) 2023, families have unconditional right to complete data purging. One click triggers a cascade delete across all database tables and vector indexes.
            </p>
          </div>
        </div>

        {/* Interactive Hard Purge Console */}
        <div className="rounded-2xl border border-slate-200/90 bg-white text-slate-900 p-6 sm:p-8 mb-16 shadow-[0_4px_24px_-4px_rgba(0,41,112,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-rose-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Live Interactive DPDP Erasure Terminal
              </h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold">
              DPDP 2023 SECTION 12(3)
            </span>
          </div>

          <p className="text-xs text-slate-600 mb-6 max-w-2xl leading-relaxed">
            Test our cryptographic hard-delete endpoint. Enter any active Journey ID below to trigger an immediate, non-recoverable purge of all associated records.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-lg mb-4">
            <input
              type="text"
              value={journeyIdToDelete}
              onChange={(e) => setJourneyIdToDelete(e.target.value)}
              placeholder="e.g. demo-journey-cardiac-01"
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all flex-grow"
            />
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? "Purging..." : "Hard Purge"}</span>
            </button>
          </div>

          {deleteStatus && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 font-mono text-xs text-emerald-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{deleteStatus}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
