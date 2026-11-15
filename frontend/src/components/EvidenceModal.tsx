"use client";

import { X, CheckCircle2, AlertTriangle, FileText, ExternalLink, ShieldCheck } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface ClaimEvidence {
  category: string;
  estimated_cost: number;
  likely_covered: number;
  out_of_pocket: number;
  confidence: string;
  evidence_doc: string;
  evidence_page: number;
  evidence_passage: string;
  clause_ref: string;
  is_verified: boolean;
}

interface EvidenceModalProps {
  claim: ClaimEvidence | null;
  onClose: () => void;
}

export function EvidenceModal({ claim, onClose }: EvidenceModalProps) {
  if (!claim) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-paytm-navy text-white p-4.5 flex items-center justify-between border-b border-paytm-navyDark">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-paytm-navyDark rounded-md text-paytm-cyan">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">{claim.category}</h3>
              <p className="text-[11px] text-slate-300">Evidence Verification & Clause Audit</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm">
          {/* Numbers Grid */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight block">
                Billed Estimate
              </span>
              <span className="text-sm font-bold text-slate-900">{formatINR(claim.estimated_cost)}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight block">
                Likely Covered
              </span>
              <span className="text-sm font-bold text-emerald-700">{formatINR(claim.likely_covered)}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-tight block">
                Out-of-Pocket
              </span>
              <span className="text-sm font-bold text-paytm-warning">{formatINR(claim.out_of_pocket)}</span>
            </div>
          </div>

          {/* Verification Status Badge */}
          <div
            className={`p-3.5 rounded-lg border flex items-start gap-2.5 ${
              claim.is_verified
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            {claim.is_verified ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold text-xs uppercase tracking-wider block">
                {claim.is_verified ? "Matches text read from your document" : "Needs TPA Confirmation"}
              </span>
              <p className="text-xs mt-0.5 leading-relaxed">
                {claim.is_verified
                  ? "This coverage rule was directly matched against the policy excerpt provided."
                  : "This claim could not be verified in the uploaded pages. Confirm with your hospital insurance desk."}
              </p>
            </div>
          </div>

          {/* Cited Passage Box */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-paytm-navy" />
                <span>Exact Cited Policy Excerpt</span>
              </span>
              <span className="text-slate-500 font-mono">
                {claim.evidence_doc} (Page {claim.evidence_page})
              </span>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-lg border-l-4 border-paytm-navy text-slate-800 text-xs sm:text-sm font-mono leading-relaxed italic bg-white shadow-inner">
              "{claim.evidence_passage}"
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <span>Clause Identifier: {claim.clause_ref}</span>
              <span className="text-slate-400">Audited via Anti-Hallucination Matcher</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-paytm-navy text-white text-xs font-bold rounded hover:bg-paytm-navyDark transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}

