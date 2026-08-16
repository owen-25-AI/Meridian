import { useState, useEffect, useRef } from "react";
import {
  HeartPulse,
  Stethoscope,
  AlertTriangle,
  Clock,
  CalendarCheck,
  Home,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  PhoneCall,
  History,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Activity,
  Key,
  Cpu,
  RefreshCw,
  Mic,
  MicOff,
  MapPin,
  Printer,
  Sun,
  Moon,
  Info,
  ExternalLink,
} from "lucide-react";
import {
  RULES,
  FALLBACK,
  URGENCY_META,
  NEXT_STEPS,
  EXAMPLES,
  matchSymptomsDeterministic,
} from "./data/rules";
import {
  triageWithGemini,
  getStoredApiKey,
  saveStoredApiKey,
} from "./services/geminiService";
import ApiKeyModal from "./components/ApiKeyModal";
import HowItWorksModal from "./components/HowItWorksModal";

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState("ai"); // 'ai' | 'deterministic'
  const [apiKey, setApiKey] = useState("");
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [theme, setTheme] = useState("dark"); // 'dark' | 'light'

  const recognitionRef = useRef(null);

  // Initialize API key, session history, and theme
  useEffect(() => {
    const key = getStoredApiKey();
    setApiKey(key);
    if (!key) {
      setMode("deterministic");
    }

    try {
      const savedHistory = localStorage.getItem("meridian_history_v1");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      const savedTheme = localStorage.getItem("meridian_theme");
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch {
      // Ignore localStorage errors
    }

    // Initialize Web Speech Recognition if available
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join("");
        setInput((prev) => {
          const base = prev.trim() ? `${prev.trim()} ` : "";
          return `${base}${transcript}`;
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    try {
      localStorage.setItem("meridian_theme", newTheme);
    } catch {
      // Ignore
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    saveStoredApiKey(newKey);
    if (newKey) {
      setMode("ai");
    } else {
      setMode("deterministic");
    }
  };

  const saveToHistory = (queryText, matchResult) => {
    try {
      const newItem = {
        id: Date.now(),
        query: queryText,
        specialist: matchResult.specialist,
        urgency: matchResult.urgency,
        source: matchResult.source || "deterministic",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      const updated = [newItem, ...history.filter((h) => h.query !== queryText)].slice(0, 5);
      setHistory(updated);
      localStorage.setItem("meridian_history_v1", JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("meridian_history_v1");
    } catch {
      // Ignore
    }
  };

  const executeTriage = async (queryText) => {
    const textToRun = queryText || input;
    if (!textToRun.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setLoading(true);
    setResult(null);
    setShowWhy(false);
    setCopied(false);
    setFallbackNotice(null);

    // If in AI mode and API key is present, attempt Gemini 3.6 Flash triage
    if (mode === "ai" && apiKey) {
      try {
        const aiResult = await triageWithGemini(textToRun, apiKey);
        setResult(aiResult);
        saveToHistory(textToRun, aiResult);
        setLoading(false);
        return;
      } catch (err) {
        console.warn("Gemini API call failed, activating fail-safe fallback:", err);
        setFallbackNotice(
          `Gemini AI was unavailable (${err.message || "network timeout"}). Automatically fell back to the instant deterministic rule engine.`
        );
      }
    }

    // Fallback or Deterministic Rule Engine
    setTimeout(() => {
      const deterministicMatch = matchSymptomsDeterministic(textToRun);
      setResult(deterministicMatch);
      saveToHistory(textToRun, deterministicMatch);
      setLoading(false);
    }, 450);
  };

  const handleSelectExample = (exText) => {
    setInput(exText);
    executeTriage(exText);
  };

  const handleCopySummary = () => {
    if (!result) return;
    const meta = URGENCY_META[result.urgency];
    const steps = result.nextSteps || NEXT_STEPS[result.urgency] || [];

    const summary = [
      "========================================",
      "   MERIDIAN CARE ROUTING SUMMARY",
      "========================================",
      `Query: "${input.trim()}"`,
      `Date/Time: ${new Date().toLocaleString()}`,
      `Engine: ${result.source === "gemini-ai" ? "Gemini 3.6 Flash AI" : "Deterministic Rule Engine"}`,
      "",
      `RECOMMENDED CARE: ${result.specialist}`,
      `URGENCY LEVEL:    ${meta.label.toUpperCase()} (${meta.sub})`,
      "",
      "CLINICAL RATIONALE:",
      result.rationale,
      "",
      result.matchedKeywords && result.matchedKeywords.length > 0
        ? `MATCHED INDICATORS:\n- ${result.matchedKeywords.join("\n- ")}\n`
        : "",
      "RECOMMENDED NEXT STEPS:",
      ...steps.map((s, i) => `${i + 1}. ${s}`),
      "",
      result.questionsForDoctor && result.questionsForDoctor.length > 0
        ? `QUESTIONS TO ASK YOUR DOCTOR:\n${result.questionsForDoctor.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n`
        : "",
      "SAFETY DISCLAIMER:",
      "Meridian is an automated care navigation tool that directs patients to appropriate levels of care and does NOT provide a medical diagnosis. In an emergency, contact local emergency services immediately.",
      "========================================",
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const getCleanSpecialistSearch = () => {
    if (!result) return "Doctor";
    return result.specialist.split(" — ")[0].split(" / ")[0].split(" (")[0].trim();
  };

  const meta = result ? URGENCY_META[result.urgency] : null;
  const UrgencyIcon = meta?.icon;
  const steps = result ? result.nextSteps || NEXT_STEPS[result.urgency] || [] : [];
  const isDark = theme === "dark";

  return (
    <div
      className={`meridian relative min-h-screen w-full overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200" : "bg-slate-50 text-slate-900 selection:bg-teal-200 selection:text-teal-900"
      }`}
    >
      {/* Ambient background glow fields */}
      <div
        className={`pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full blur-3xl ${
          isDark ? "bg-teal-400/15" : "bg-teal-400/20"
        }`}
      />
      <div
        className={`pointer-events-none absolute top-1/3 -left-32 h-96 w-96 rounded-full blur-3xl ${
          isDark ? "bg-cyan-500/10" : "bg-cyan-500/15"
        }`}
      />
      <div
        className={`pointer-events-none absolute bottom-0 right-1/4 h-80 w-80 rounded-full blur-3xl ${
          isDark ? "bg-emerald-400/10" : "bg-emerald-400/15"
        }`}
      />

      {/* Main Container */}
      <div className="relative mx-auto flex max-w-3xl flex-col px-5 py-8 sm:px-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                isDark ? "bg-teal-400/15 ring-1 ring-teal-400/30 text-teal-300" : "bg-teal-600/10 ring-1 ring-teal-600/20 text-teal-700"
              }`}
            >
              <HeartPulse className="h-4.5 w-4.5" strokeWidth={2.2} />
            </div>
            <span className={`font-display text-lg font-semibold tracking-tight ${isDark ? "text-slate-50" : "text-slate-900"}`}>
              Meridian
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* How It Works Button */}
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition ${
                isDark ? "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10" : "bg-slate-200/80 text-slate-700 ring-slate-300 hover:bg-slate-300"
              }`}
            >
              <Info className="h-3 w-3" />
              <span className="hidden sm:inline">How It Works</span>
            </button>

            {/* Mode / API Key Status Pill */}
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition ${
                apiKey
                  ? isDark
                    ? "bg-teal-400/10 text-teal-300 ring-teal-400/30 hover:bg-teal-400/20"
                    : "bg-teal-50 text-teal-700 ring-teal-300 hover:bg-teal-100"
                  : isDark
                  ? "bg-white/5 text-slate-400 ring-white/10 hover:bg-white/10"
                  : "bg-slate-200/80 text-slate-600 ring-slate-300 hover:bg-slate-300"
              }`}
            >
              <Key className="h-3 w-3" />
              <span>{apiKey ? "Gemini Active" : "API Key"}</span>
            </button>

            {/* Dark/Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className={`flex h-8 w-8 items-center justify-center rounded-full ring-1 transition ${
                isDark ? "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10" : "bg-slate-200/80 text-slate-700 ring-slate-300 hover:bg-slate-300"
              }`}
            >
              {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="mb-7">
          <div
            className={`mb-2.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${
              isDark ? "text-teal-400/90" : "text-teal-700"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Assisted Care Navigation · PeddieHacks 2026
          </div>
          <h1
            className={`font-display text-3xl font-bold leading-tight tracking-tight sm:text-5xl ${
              isDark ? "text-slate-50" : "text-slate-900"
            }`}
          >
            Know where to go,
            <br />
            before it becomes urgent.
          </h1>
          <p className={`mt-3 max-w-xl text-sm leading-relaxed sm:text-base ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Describe symptoms in plain language. Meridian evaluates clinical urgency and routes you to the appropriate
            medical discipline — <strong className={isDark ? "text-slate-200" : "text-slate-900"}>it routes, never diagnoses.</strong>
          </p>
        </section>

        {/* Heartbeat Divider */}
        <svg viewBox="0 0 600 40" className="mb-7 h-7 w-full opacity-40" preserveAspectRatio="none">
          <path
            d="M0,20 L150,20 L165,4 L180,36 L195,20 L215,20 L228,10 L242,30 L256,20 L600,20"
            fill="none"
            stroke={isDark ? "#5eead4" : "#0d9488"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pulse-line"
          />
        </svg>

        {/* Engine Mode Selector Bar */}
        <div className="mb-4 flex items-center justify-between">
          <div
            className={`flex items-center gap-1 rounded-2xl p-1 text-xs ring-1 ${
              isDark ? "bg-slate-900/90 ring-white/10" : "bg-slate-200/90 ring-slate-300"
            }`}
          >
            <button
              onClick={() => {
                if (!apiKey) {
                  setIsKeyModalOpen(true);
                } else {
                  setMode("ai");
                }
              }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-medium transition ${
                mode === "ai"
                  ? isDark
                    ? "bg-teal-400 text-slate-950 font-semibold shadow-md"
                    : "bg-teal-600 text-white font-semibold shadow-md"
                  : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>Gemini 3.6 Flash AI</span>
              {!apiKey && <span className="text-[10px] opacity-75">(Setup Key)</span>}
            </button>

            <button
              onClick={() => setMode("deterministic")}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-medium transition ${
                mode === "deterministic"
                  ? isDark
                    ? "bg-teal-400 text-slate-950 font-semibold shadow-md"
                    : "bg-teal-600 text-white font-semibold shadow-md"
                  : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Cpu className="h-3 w-3" />
              <span>Deterministic Rules</span>
            </button>
          </div>

          <span className={`text-[11px] hidden sm:inline ${isDark ? "text-slate-500" : "text-slate-500"}`}>
            {mode === "ai" ? "Gemini AI Free-Text Engine" : "100% Offline Fail-Safe"}
          </span>
        </div>

        {/* Input Card */}
        <section
          className={`rounded-3xl p-5 shadow-2xl ring-1 backdrop-blur-xl sm:p-7 transition-colors ${
            isDark ? "bg-white/[0.04] ring-white/10" : "bg-white ring-slate-200 shadow-slate-200/60"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="symptom-input"
              className={`block text-sm font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}
            >
              What symptoms are you experiencing?
            </label>

            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isListening ? "Stop listening" : "Dictate with voice"}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition ${
                isListening
                  ? "bg-rose-500/20 text-rose-400 ring-rose-500/40 animate-pulse"
                  : isDark
                  ? "bg-white/5 text-slate-400 ring-white/10 hover:bg-white/10 hover:text-slate-200"
                  : "bg-slate-100 text-slate-600 ring-slate-200 hover:bg-slate-200"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="h-3 w-3" />
                  <span>Listening…</span>
                </>
              ) : (
                <>
                  <Mic className="h-3 w-3 text-teal-400" />
                  <span>Voice input</span>
                </>
              )}
            </button>
          </div>

          <textarea
            id="symptom-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. I've had chest tightness and trouble breathing since this morning…"
            rows={3}
            className={`w-full resize-none rounded-2xl border-0 px-4 py-3.5 text-sm ring-1 outline-none transition focus:ring-2 ${
              isDark
                ? "bg-slate-900/80 text-slate-100 placeholder-slate-500 ring-white/10 focus:ring-teal-400/50"
                : "bg-slate-50 text-slate-900 placeholder-slate-400 ring-slate-200 focus:ring-teal-500/50"
            }`}
          />

          {/* Example Chips */}
          <div className="mt-4">
            <div className={`mb-2 flex items-center justify-between text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              <span>Try an example across urgency tiers:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => handleSelectExample(ex.label)}
                  className={`group flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ring-1 transition ${
                    isDark
                      ? "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10 hover:text-slate-100"
                      : "bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      ex.tier === "emergency"
                        ? "bg-rose-400"
                        : ex.tier === "soon"
                        ? "bg-amber-400"
                        : ex.tier === "routine"
                        ? "bg-teal-400"
                        : "bg-slate-400"
                    }`}
                  />
                  <span>{ex.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => executeTriage()}
              disabled={!input.trim() || loading}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold transition disabled:cursor-not-allowed sm:w-auto sm:px-8 ${
                isDark
                  ? "bg-teal-400 text-slate-950 hover:bg-teal-300 disabled:bg-slate-800 disabled:text-slate-500"
                  : "bg-teal-600 text-white hover:bg-teal-500 disabled:bg-slate-200 disabled:text-slate-400"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className={`animate-spin h-4 w-4 border-2 border-t-transparent rounded-full ${isDark ? "border-slate-950" : "border-white"}`} />
                  <span>{mode === "ai" ? "Analyzing with Gemini AI…" : "Routing symptoms…"}</span>
                </span>
              ) : (
                <>
                  Find my next step
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </>
              )}
            </button>

            {input.trim() && (
              <button
                onClick={() => {
                  setInput("");
                  setResult(null);
                  setFallbackNotice(null);
                }}
                className={`text-xs transition ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`}
              >
                Clear input
              </button>
            )}
          </div>
        </section>

        {/* Fail-Safe Fallback Notification */}
        {fallbackNotice && (
          <div
            className={`fade-in mt-4 flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs ${
              isDark ? "border-amber-500/30 bg-amber-950/40 text-amber-200" : "border-amber-300 bg-amber-50 text-amber-900"
            }`}
          >
            <RefreshCw className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500 animate-spin" />
            <span>{fallbackNotice}</span>
          </div>
        )}

        {/* Result Card */}
        {result && meta && (
          <section className="fade-in print-area mt-6 space-y-4">
            {/* High-Visibility Emergency Override Banner */}
            {result.urgency === "emergency" && (
              <div
                className={`flex items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-md ${
                  isDark ? meta.bannerBg : "bg-rose-50 border-rose-300 text-rose-900"
                }`}
              >
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-500" />
                <div className="flex-1 text-xs leading-relaxed sm:text-sm">
                  <span className="font-semibold text-rose-600">Potential Medical Emergency: </span>
                  {result.isCrisis ? (
                    <span>
                      If you or someone you know is in crisis, call or text <strong>988</strong> immediately for free,
                      confidential support. You can also chat at <strong>988lifeline.org</strong>.
                    </span>
                  ) : (
                    <span>
                      These symptoms suggest immediate medical evaluation. Please call <strong>911</strong> or proceed to
                      your nearest Emergency Department without delay.
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Fallback Guidance Notice */}
            {result.isFallback && (
              <div
                className={`flex items-start gap-2.5 rounded-2xl border p-3.5 text-xs ${
                  isDark ? "border-slate-700/60 bg-slate-900/60 text-slate-300" : "border-slate-300 bg-slate-100 text-slate-800"
                }`}
              >
                <HelpCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
                <span>
                  <strong>Tip for better precision:</strong> Try adding more specific details (duration, exact body
                  location, severity, or suddenness) to match a tighter clinical rule.
                </span>
              </div>
            )}

            {/* Main Result Card */}
            <div
              className={`rounded-3xl p-5 shadow-2xl ${meta.glow} ring-1 ${meta.ring} backdrop-blur-xl sm:p-7 ${
                isDark ? "bg-white/[0.04]" : "bg-white shadow-slate-200"
              }`}
            >
              {/* Header: Specialist + Urgency Badge */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3.5">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${meta.bg} ring-1 ${meta.ring}`}>
                    <Stethoscope className={`h-6 w-6 ${meta.text}`} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        Recommended Care
                      </p>
                      {result.source === "gemini-ai" && (
                        <span className="flex items-center gap-1 rounded-md bg-teal-400/10 px-1.5 py-0.5 text-[10px] font-semibold text-teal-400 ring-1 ring-teal-400/20">
                          <Sparkles className="h-2.5 w-2.5" />
                          Gemini AI
                        </span>
                      )}
                    </div>
                    <p className={`font-display text-xl font-bold ${isDark ? "text-slate-50" : "text-slate-900"}`}>
                      {result.specialist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <div className={`flex items-center gap-1.5 rounded-full ${meta.bg} px-3 py-1.5 ring-1 ${meta.ring}`}>
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    <span className={`text-xs font-semibold ${meta.text}`}>{meta.label}</span>
                  </div>
                </div>
              </div>

              {/* Sub-urgency line */}
              <div className={`mt-4 flex items-center gap-2 text-xs font-medium sm:text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                {UrgencyIcon && <UrgencyIcon className={`h-4 w-4 ${meta.text}`} />}
                <span>{meta.sub}</span>
              </div>

              {/* Matched Keywords / Symptoms */}
              {result.matchedKeywords && result.matchedKeywords.length > 0 && (
                <div
                  className={`mt-4 flex flex-wrap items-center gap-1.5 rounded-2xl p-2.5 ring-1 ${
                    isDark ? "bg-white/[0.02] ring-white/5" : "bg-slate-50 ring-slate-200"
                  }`}
                >
                  <span className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Identified factors:
                  </span>
                  {result.matchedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-md bg-teal-400/10 px-2 py-0.5 text-xs font-medium text-teal-400 ring-1 ring-teal-400/20"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              {/* Clinical Rationale */}
              <div className="mt-4">
                <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Clinical Rationale
                </p>
                <p className={`mt-1 text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                  {result.rationale}
                </p>
              </div>

              {/* Next Steps Checklist */}
              <div
                className={`mt-5 rounded-2xl p-4 ring-1 ${
                  isDark ? "bg-slate-900/60 ring-white/5" : "bg-slate-50 ring-slate-200"
                }`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-800"}`}>
                  Recommended Action Checklist
                </p>
                <ul className="mt-2.5 space-y-2">
                  {steps.map((step, idx) => (
                    <li
                      key={idx}
                      className={`flex items-start gap-2 text-xs leading-relaxed sm:text-sm ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      <CheckCircle2 className={`mt-0.5 h-4 w-4 flex-shrink-0 ${meta.text}`} />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Doctor Questions (Gemini AI Feature) */}
              {result.questionsForDoctor && result.questionsForDoctor.length > 0 && (
                <div
                  className={`mt-4 rounded-2xl p-4 ring-1 ${
                    isDark ? "bg-teal-950/20 ring-teal-500/20" : "bg-teal-50 ring-teal-200"
                  }`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-teal-300" : "text-teal-800"}`}>
                    Questions to Ask Your Clinician
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {result.questionsForDoctor.map((q, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-2 text-xs sm:text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}
                      >
                        <span className="font-semibold text-teal-400">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* "How Meridian Decided" Transparency Accordion */}
              <div className={`mt-5 border-t pt-4 ${isDark ? "border-white/5" : "border-slate-200"}`}>
                <button
                  onClick={() => setShowWhy(!showWhy)}
                  className={`flex w-full items-center justify-between text-xs font-medium transition ${
                    isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-teal-400" />
                    How Meridian decided this recommendation
                  </span>
                  {showWhy ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showWhy && (
                  <div
                    className={`mt-3 space-y-2.5 rounded-2xl p-4 text-xs ring-1 ${
                      isDark ? "bg-white/[0.02] text-slate-400 ring-white/5" : "bg-slate-50 text-slate-600 ring-slate-200"
                    }`}
                  >
                    <p>
                      <strong className={isDark ? "text-slate-300" : "text-slate-800"}>Urgency Standard:</strong>{" "}
                      {meta.definition}
                    </p>
                    <p>
                      <strong className={isDark ? "text-slate-300" : "text-slate-800"}>Routing Method:</strong>{" "}
                      {result.source === "gemini-ai"
                        ? `Processed via Gemini 3.6 Flash (${result.modelUsed || "Gemini Flash"}) structured clinical navigation schema.`
                        : "Scored via weighted multi-phrase deterministic keyword analysis with high-urgency safety priority."}
                    </p>
                    <p>
                      <strong className={isDark ? "text-slate-300" : "text-slate-800"}>Safety Guarantee:</strong> Meridian
                      strictly routes to care levels without attempting differential disease diagnosis.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Toolbar: Find Near You / Copy / Print */}
              <div
                className={`mt-6 flex flex-wrap items-center justify-between gap-2.5 border-t pt-4 ${
                  isDark ? "border-white/5" : "border-slate-200"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {/* Find on Google Maps */}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${getCleanSpecialistSearch()} near me`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium ring-1 transition ${
                      isDark
                        ? "bg-teal-400/10 text-teal-300 ring-teal-400/30 hover:bg-teal-400/20"
                        : "bg-teal-50 text-teal-800 ring-teal-300 hover:bg-teal-100"
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5 text-teal-400" />
                    <span>Find {getCleanSpecialistSearch()} near you</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>

                  {/* Copy Summary */}
                  <button
                    onClick={handleCopySummary}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium ring-1 transition ${
                      isDark
                        ? "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10 hover:text-slate-100"
                        : "bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-teal-400" />
                        <span className="text-teal-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy summary</span>
                      </>
                    )}
                  </button>

                  {/* Print Card */}
                  <button
                    onClick={handlePrint}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium ring-1 transition ${
                      isDark
                        ? "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
                        : "bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print</span>
                  </button>
                </div>

                {/* Hotlines */}
                {result.urgency === "emergency" && result.isCrisis && (
                  <a
                    href="tel:988"
                    className="flex items-center gap-1.5 rounded-xl bg-rose-500/20 px-3.5 py-2 text-xs font-semibold text-rose-300 ring-1 ring-rose-500/40 transition hover:bg-rose-500/30"
                  >
                    <PhoneCall className="h-3.5 w-3.5" />
                    Call 988 Lifeline
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Recent Session History */}
        {history.length > 0 && (
          <section
            className={`mt-8 rounded-3xl p-5 ring-1 backdrop-blur-md ${
              isDark ? "bg-white/[0.02] ring-white/5" : "bg-white ring-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                <History className="h-3.5 w-3.5 text-teal-400" />
                <span>Recent Triage Checks ({history.length})</span>
              </div>
              <button
                onClick={clearHistory}
                className={`flex items-center gap-1 text-xs transition ${isDark ? "text-slate-500 hover:text-rose-400" : "text-slate-400 hover:text-rose-600"}`}
              >
                <Trash2 className="h-3 w-3" />
                <span>Clear</span>
              </button>
            </div>

            <div className={`mt-3 divide-y ${isDark ? "divide-white/5" : "divide-slate-100"}`}>
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectExample(item.query)}
                  className={`group flex cursor-pointer items-center justify-between py-2.5 transition ${
                    isDark ? "hover:text-slate-100" : "hover:text-slate-900"
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <p
                      className={`truncate text-xs font-medium group-hover:text-teal-400 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      "{item.query}"
                    </p>
                    <p className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      {item.specialist} · {item.timestamp}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      item.urgency === "emergency"
                        ? "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30"
                        : item.urgency === "soon"
                        ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30"
                        : item.urgency === "routine"
                        ? "bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/30"
                        : "bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/30"
                    }`}
                  >
                    {item.urgency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer Footer */}
        <footer className="mt-8 space-y-4">
          <div
            className={`flex items-start gap-2.5 rounded-2xl p-4 ring-1 ${
              isDark ? "bg-white/[0.03] ring-white/5 text-slate-400" : "bg-white ring-slate-200 text-slate-600 shadow-sm"
            }`}
          >
            <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-teal-500" />
            <p className="text-xs leading-relaxed">
              <strong className={isDark ? "text-slate-300" : "text-slate-800"}>Medical Disclaimer:</strong> Meridian is
              an educational and care navigation aid designed to direct users to appropriate medical disciplines. It does
              not provide medical diagnoses, treatment plans, or prescriptions. In an acute or life-threatening situation,
              call 911 or visit the nearest emergency department immediately.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Built for PeddieHacks 2026 · Health Track</span>
            <button
              onClick={() => setIsHowItWorksOpen(true)}
              className="text-teal-400 hover:underline"
            >
              Safety Architecture & Triage Matrix
            </button>
          </div>
        </footer>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        currentKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />

      {/* How It Works Modal */}
      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />
    </div>
  );
}
