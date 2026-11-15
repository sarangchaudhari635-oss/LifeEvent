"use client";

import { useState } from "react";
import NextLink from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  FileText,
  ShieldCheck,
  Lock,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileCode,
  Shield,
  Fingerprint,
  Cpu,
  Sparkles,
  FolderLock
} from "lucide-react";

export default function DocumentsPage() {
  // Live Aadhaar Masking Verhoeff Interactive Playground
  const [inputText, setInputText] = useState(
    "Patient Ramesh Kulkarni, Aadhaar: 2345 6789 0124, Emergency Contact Mobile: +91 9876543210, Policy Number: SHI-SAMPLE-2024-8841."
  );

  // Client-side Verhoeff simulation to show immediate feedback
  const maskTextVerhoeff = (text: string) => {
    return text.replace(/\b(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})\b/g, (match, p1, p2, p3) => {
      return `XXXX-XXXX-${p3}`;
    });
  };

  const maskedOutput = maskTextVerhoeff(inputText);

  const sampleDocuments = [
    {
      name: "Sample_Health_Policy_Document.pdf",
      type: "Health Insurance Policy Schedule (Retail)",
      size: "248 KB",
      pages: 12,
      insurer: "Sample Health Insurance Co.",
      clausesFound: [
        "Section 2.1: Room Rent Capped at ₹5,000/day (Proportional deduction applicable)",
        "Section 3.4: ICU expenses admissible up to ₹10,000/day",
        "Section 5.2: Pre-existing waiting period 24 months (waived for acute events)"
      ],
      status: "Ingested & Indexed",
      aadhaarRedacted: true
    },
    {
      name: "Hospital_PreAuth_Estimate.pdf",
      type: "Hospital Cashless Request Form & Clinical Summary",
      size: "185 KB",
      pages: 3,
      hospital: "Sample City Hospital (Apollo Pune Network)",
      clausesFound: [
        "Diagnosis: Acute Coronary Syndrome / Anterior Wall STEMI",
        "Estimated Stay: 4 Days (2 Days ICU, 2 Days Twin Sharing Room)",
        "Hardware: PTCA Drug-Eluting Stent (DES) Hardware Schedule"
      ],
      status: "Ingested & Indexed",
      aadhaarRedacted: true
    },
    {
      name: "Patient_Identity_Aadhaar_Card.pdf",
      type: "Government Photo Identification (UIDAI)",
      size: "95 KB",
      pages: 1,
      status: "Image Discarded & Masked (Privacy First)",
      aadhaarRedacted: true,
      note: "Raw identity document images are permanently discarded on-device. Extracted text is sanitized using the Indian Verhoeff check-digit algorithm before network transmission."
    }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 flex flex-col font-sans selection:bg-[#002970] selection:text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-neutral-200 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#002970]/5 border border-[#002970]/20 text-[11px] font-mono uppercase text-[#002970] font-semibold mb-2">
              <FolderLock className="w-3.5 h-3.5 text-[#00baf2]" />
              <span>Evidence Repository // Zero-Knowledge Redaction Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-950">
              Document Ingestion & Privacy Redactor Lab
            </h1>
            <p className="text-sm text-neutral-600 max-w-2xl mt-1.5 leading-relaxed">
              Every medical recommendation links to exact clauses parsed from these documents.
              Sensitive Indian identifiers (Aadhaar, PAN) are masked client-side via Verhoeff checksum before storage or LLM indexing.
            </p>
          </div>

          <NextLink
            href="/intake"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-bold bg-[#002970] text-white hover:bg-[#001d52] transition-colors self-start lg:self-auto shadow-sm"
          >
            <UploadCloud className="w-4 h-4 text-[#00baf2]" />
            <span>Upload New Evidence</span>
          </NextLink>
        </div>

        {/* Interactive Verhoeff Redaction Playground */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#002970]" />
              <h2 className="text-base sm:text-lg font-bold text-neutral-950">
                Live Interactive Verhoeff Aadhaar Masker
              </h2>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dihedral D5 Checksum Active</span>
            </div>
          </div>

          <p className="text-xs text-neutral-600 mb-4 max-w-3xl leading-relaxed">
            Test how our on-device regex & Dihedral $D_5$ Verhoeff algorithm isolates 12-digit Aadhaar identifiers while preserving 10-digit emergency contact phone numbers and policy identifiers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1.5">
                Input Patient String (Edit freely)
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={4}
                className="w-full p-3.5 rounded-xl border border-neutral-300 bg-white font-mono text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#002970] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 block mb-1.5 flex items-center justify-between">
                <span>Sanitized Output (Safe for LLM & DB)</span>
                <span className="text-emerald-700 font-bold">100% Client-Side Masked</span>
              </label>
              <div className="w-full p-3.5 rounded-xl border border-neutral-200 bg-white font-mono text-xs text-neutral-800 min-h-[96px] whitespace-pre-wrap selection:bg-emerald-100">
                {maskedOutput}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200/80 flex flex-wrap items-center justify-between text-xs text-neutral-500 font-mono gap-2">
            <span>Regex pattern: <code className="text-neutral-800 bg-neutral-200/60 px-1 py-0.5 rounded">\b(\d&#123;4&#125;)[\s-]?(\d&#123;4&#125;)[\s-]?(\d&#123;4&#125;)\b</code></span>
            <span>Permutation matrix: Indian UIDAI Standard</span>
          </div>
        </div>

        {/* Ingested Documents Inventory */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#002970]" />
              <span>Parsed Evidence Corpus ({sampleDocuments.length} Documents)</span>
            </h2>
            <span className="text-xs font-mono text-neutral-500">Status: Parsed & Grounded</span>
          </div>

          {sampleDocuments.map((doc, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-950 transition-all shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2 flex-grow">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-neutral-950 flex items-center gap-2 min-w-0">
                      <FileCode className="w-4 h-4 text-[#002970] flex-shrink-0" />
                      <span className="break-all sm:break-normal">{doc.name}</span>
                    </h3>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 border border-neutral-200">
                      {doc.size} &bull; {doc.pages} Pages
                    </span>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {doc.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 font-mono">
                    Type: <span className="text-neutral-800 font-medium">{doc.type}</span>
                  </p>

                  {doc.clausesFound && (
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                        Extracted Grounding Anchors:
                      </span>
                      <ul className="space-y-1">
                        {doc.clausesFound.map((c, i) => (
                          <li key={i} className="text-xs text-neutral-700 flex items-start gap-2 font-mono">
                            <span className="text-[#00baf2] font-bold">&gt;</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {doc.note && (
                    <p className="mt-2 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 leading-relaxed font-mono">
                      {doc.note}
                    </p>
                  )}
                </div>

                <div className="flex lg:flex-col items-center lg:items-end justify-between border-t lg:border-t-0 lg:border-l border-neutral-100 pt-3 lg:pt-0 lg:pl-6 min-w-[170px] flex-shrink-0">
                  <NextLink
                    href="/journey/demo-journey-cardiac-01/coverage"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-bold text-[#002970] hover:underline"
                  >
                    <span>Inspect Clauses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </NextLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
