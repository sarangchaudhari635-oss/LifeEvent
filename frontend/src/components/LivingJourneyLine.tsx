"use client";

import { CheckCircle2, Clock, AlertTriangle, ArrowRight, User, Building2, Bot } from "lucide-react";

export interface TimelineItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  status: "completed" | "done" | "in_progress" | "pending";
}

interface LivingJourneyLineProps {
  events: TimelineItem[];
  nextAction?: string;
  onSimulateReplan?: () => void;
  onReplan?: () => void;
  isReplanning?: boolean;
}

export function LivingJourneyLine({
  events,
  nextAction,
  onSimulateReplan,
  onReplan,
  isReplanning = false,
}: LivingJourneyLineProps) {
  const triggerReplan = onSimulateReplan || onReplan;
  const getActorIcon = (actor: string) => {
    if (actor.toLowerCase().includes("family")) {
      return <User className="w-3.5 h-3.5 text-blue-600" />;
    }
    if (actor.toLowerCase().includes("hospital") || actor.toLowerCase().includes("tpa")) {
      return <Building2 className="w-3.5 h-3.5 text-amber-600" />;
    }
    return <Bot className="w-3.5 h-3.5 text-paytm-cyan" />;
  };

  return (
    <div className="bg-white rounded-lg p-5 sm:p-6 shadow-sm border border-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-paytm-navy flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-paytm-cyan animate-pulse"></span>
            The Living Journey Line
          </h3>
          <p className="text-xs text-slate-500">
            A dynamic timeline that adapts live as new documents and approvals arrive
          </p>
        </div>

        {triggerReplan && (
          <button
            type="button"
            onClick={triggerReplan}
            disabled={isReplanning}
            className="w-full sm:w-auto px-3.5 py-2 text-xs font-bold rounded bg-paytm-cyan text-paytm-navy hover:bg-paytm-navy hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Clock className={`w-3.5 h-3.5 ${isReplanning ? "animate-spin" : ""}`} />
            <span>{isReplanning ? "Re-planning Journey..." : "Simulate: TPA Query Arrives (Re-plan)"}</span>
          </button>
        )}
      </div>

      {/* Prominent Next Best Action Card */}
      {nextAction && (
        <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-md text-paytm-warning mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-paytm-warning">
              Priority Next Action
            </span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{nextAction}</p>
          </div>
        </div>
      )}

      {/* Vertical Spine */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((evt, idx) => {
          const isDone = evt.status === "completed" || evt.status === "done";
          const isInProgress = evt.status === "in_progress";

          return (
            <div key={evt.id || idx} className="relative group">
              {/* Dot */}
              <div
                className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white ${
                  isDone
                    ? "border-emerald-500 text-emerald-600"
                    : isInProgress
                    ? "border-paytm-cyan text-paytm-cyan animate-bounce"
                    : "border-slate-300 text-slate-400"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-paytm-cyan" />
                )}
              </div>

              {/* Event Body */}
              <div className="bg-slate-50 hover:bg-blue-50/50 p-3.5 rounded-lg border border-slate-100 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-900">{evt.title}</span>
                  <span className="text-[11px] font-mono text-slate-500">{evt.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 mb-2 leading-relaxed">{evt.description}</p>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 font-medium text-slate-700">
                    {getActorIcon(evt.actor)}
                    <span>{evt.actor}</span>
                  </span>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isDone
                        ? "bg-emerald-100 text-emerald-800"
                        : isInProgress
                        ? "bg-cyan-100 text-cyan-900"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {isDone ? "Completed" : isInProgress ? "In Progress" : "Pending"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
