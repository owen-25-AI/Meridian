import { useState } from "react";
import { X, Key, Check, AlertCircle, Sparkles, ExternalLink, Eye, EyeOff } from "lucide-react";
import { triageWithGemini } from "../services/geminiService";

export default function ApiKeyModal({ isOpen, onClose, currentKey, onSaveKey }) {
  const [apiKey, setApiKey] = useState(currentKey || "");
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(apiKey.trim());
    onClose();
  };

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      await triageWithGemini("Mild sore throat and slight cough for 1 day", apiKey.trim());
      setTestResult({ success: true, message: "Connection successful! Gemini 3.6 Flash is active." });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || "Failed to connect to Gemini with this API key.",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    setApiKey("");
    onSaveKey("");
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 p-6 shadow-2xl ring-1 ring-white/10 sm:p-7">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full bg-white/5 p-1.5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-400/15 ring-1 ring-teal-400/30">
            <Key className="h-5 w-5 text-teal-300" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-50">Gemini 3.6 Flash Setup</h3>
            <p className="text-xs text-slate-400">Power intelligent symptom triage with Google AI</p>
          </div>
        </div>

        {/* Input */}
        <div className="mt-5">
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Google Gemini API Key
          </label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestResult(null);
              }}
              placeholder="AIzaSy..."
              className="w-full rounded-xl bg-slate-950/80 px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-600 ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-teal-400/50"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute top-2.5 right-3 text-slate-500 hover:text-slate-300"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Keys are stored locally in your browser session.</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-teal-400 hover:underline"
            >
              Get free API key
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Test Result Indicator */}
        {testResult && (
          <div
            className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-xs ${
              testResult.success
                ? "bg-emerald-950/60 text-emerald-300 ring-1 ring-emerald-500/30"
                : "bg-rose-950/60 text-rose-300 ring-1 ring-rose-500/30"
            }`}
          >
            {testResult.success ? (
              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-rose-400" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-between gap-2 pt-2">
          {apiKey ? (
            <button
              onClick={handleClear}
              className="text-xs text-slate-500 hover:text-rose-400 transition"
            >
              Clear key
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={handleTest}
              disabled={!apiKey.trim() || testing}
              className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 ring-1 ring-white/10 hover:bg-white/10 disabled:opacity-50"
            >
              {testing ? (
                <span className="animate-spin h-3.5 w-3.5 border-2 border-teal-400 border-t-transparent rounded-full" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-teal-400" />
              )}
              Test key
            </button>

            <button
              onClick={handleSave}
              className="rounded-xl bg-teal-400 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-teal-300"
            >
              Save & Activate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
