import React from "react";
import { X, ShieldCheck, Cpu, Sparkles, AlertTriangle, Layers, HeartPulse } from "lucide-react";

export default function HowItWorksModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-slate-900 p-6 shadow-2xl ring-1 ring-white/10 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full bg-white/5 p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-200 transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-400/15 ring-1 ring-teal-400/30">
            <HeartPulse className="h-5 w-5 text-teal-300" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-slate-50">How Meridian Works</h2>
            <p className="text-xs text-slate-400">Architecture, Clinical Safety, and Triage Methodology</p>
          </div>
        </div>

        {/* Body Content */}
        <div className="mt-6 space-y-6 text-xs leading-relaxed text-slate-300 sm:text-sm">
          {/* Core Principle */}
          <div className="rounded-2xl bg-teal-500/10 p-4 ring-1 ring-teal-500/20">
            <div className="flex items-center gap-2 font-semibold text-teal-300">
              <ShieldCheck className="h-4 w-4" />
              <span>Core Principle: Route, Never Diagnose</span>
            </div>
            <p className="mt-1.5 text-xs text-slate-300">
              Diagnostic claims create severe patient safety risks and regulatory hazards. Meridian intentionally acts
              solely as an <strong>intelligent care navigator</strong>, routing plain-language symptom descriptions to the
              appropriate level of care and medical discipline.
            </p>
          </div>

          {/* Architecture Diagram */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-slate-100">
              <Cpu className="h-4 w-4 text-teal-400" />
              Hybrid Resilience Architecture
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
                <div className="flex items-center gap-2 font-medium text-slate-200">
                  <Sparkles className="h-4 w-4 text-teal-400" />
                  <span>Gemini 3.6 Flash AI</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  Extracts nuanced symptom context, classifies urgency, and formulates tailored questions for the
                  patient to ask during their clinical visit.
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
                <div className="flex items-center gap-2 font-medium text-slate-200">
                  <Layers className="h-4 w-4 text-cyan-400" />
                  <span>Fail-Safe Rule Engine</span>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  17 deterministic clinical clusters with weighted multi-phrase scoring. Activates instantly with zero
                  network dependencies if the API is offline or times out.
                </p>
              </div>
            </div>
          </div>

          {/* 4-Tier Urgency Matrix */}
          <div>
            <h3 className="flex items-center gap-2 font-display text-sm font-semibold text-slate-100">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              4-Tier Clinical Urgency Matrix
            </h3>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-start gap-2.5 rounded-xl bg-rose-500/10 p-2.5 text-rose-200 ring-1 ring-rose-500/20">
                <span className="rounded-md bg-rose-500/20 px-1.5 py-0.5 font-bold uppercase tracking-wider text-[10px]">
                  Emergency
                </span>
                <span>Immediate life-threat (cardiac, stroke, breathing distress, suicidal crisis). Calls 911 / 988.</span>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl bg-amber-500/10 p-2.5 text-amber-200 ring-1 ring-amber-500/20">
                <span className="rounded-md bg-amber-500/20 px-1.5 py-0.5 font-bold uppercase tracking-wider text-[10px]">
                  Soon (24–48h)
                </span>
                <span>Time-sensitive acute symptoms (persistent headache, acute ear/eye pain, high fever).</span>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl bg-teal-500/10 p-2.5 text-teal-200 ring-1 ring-teal-500/20">
                <span className="rounded-md bg-teal-500/20 px-1.5 py-0.5 font-bold uppercase tracking-wider text-[10px]">
                  Routine
                </span>
                <span>Subacute / chronic conditions (joint aches, localized skin rashes, scheduled counseling).</span>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl bg-slate-500/10 p-2.5 text-slate-300 ring-1 ring-slate-500/20">
                <span className="rounded-md bg-slate-500/20 px-1.5 py-0.5 font-bold uppercase tracking-wider text-[10px]">
                  Monitor
                </span>
                <span>Mild, self-limiting symptoms (mild fatigue, slight cold) suitable for supportive home care.</span>
              </div>
            </div>
          </div>

          {/* PeddieHacks Submission Notice */}
          <div className="border-t border-white/5 pt-4 text-center text-xs text-slate-500">
            Built for <strong>PeddieHacks 2026 · Health Track</strong> · 100% Client-Safe Architecture
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-teal-400 px-5 py-2 text-xs font-semibold text-slate-950 transition hover:bg-teal-300"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
