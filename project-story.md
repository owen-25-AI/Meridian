## Inspiration

Every year, millions of people experience confusing, distressing physical or emotional symptoms and ask themselves the same overwhelming question: *"Where do I even go for this?"*

Patients typically face a lose-lose dilemma:
1. **Under-reacting:** Delaying care for critical time-sensitive conditions (e.g., mistaking acute chest pressure or subtle neurological deficits for fatigue).
2. **Over-reacting or Panic-Searching:** Googling symptoms, spiraling into medical anxiety, or crowding emergency rooms for routine conditions.

Most existing online symptom checkers attempt to play doctor by spitting out alarming differential diagnoses (*"You might have disease X"*). This creates severe medical liability, patient panic, and dangerous misinformation.

We built **Meridian** around a fundamentally different, safety-first principle: **Route, Never Diagnose**. Meridian doesn’t attempt to diagnose medical conditions — it directs you to **the right medical specialist**, **how urgently you should seek care**, and **actionable next steps to take**.

## What it does

Meridian is an intelligent care-navigation platform that analyzes plain-language symptom descriptions (via text or browser-native voice dictation) and returns structured, actionable guidance:

- **Recommended Medical Specialist:** Identifies the appropriate care discipline (e.g., *Emergency Department*, *Neurologist*, *Ophthalmologist*, *Orthopedist*, *Dermatologist*, *Gastroenterologist*, or *Primary Care Provider*).
- **4-Tier Clinical Urgency Rating:**
  - 🚨 **Emergency:** Immediate evaluation needed for potential life-threats.
  - ⏳ **Soon (Within 24–48 Hours):** Time-sensitive subacute symptoms.
  - 📅 **Routine:** Standard scheduled outpatient specialist visit.
  - 🏠 **Monitor:** Mild, self-limiting symptoms suitable for home care.
- **Emergency Override & Crisis Support:** Pinned high-visibility alerts with direct, 1-click routing to the **988 Suicide & Crisis Lifeline** (call/text 24/7) and **911** for acute emergencies.
- **Actionable Next Steps Checklist:** 3-point checklist tailored to the assigned urgency level.
- **Tailored Questions for Your Clinician:** AI-generated list of specific questions to ask the doctor during the visit.
- **Explainability Accordion ("How Meridian Decided"):** Transparently breaks down matched indicators, clinical urgency criteria, and the deterministic safety model.
- **Local Specialist Locator:** 1-click Google Maps search pre-filled for recommended specialists nearby.
- **Session History & Export:** Stores recent checks locally in `localStorage`, allows 1-click clinical summary copying to clipboard, and includes `@media print` PDF support.
- **Theme Switcher:** Dark Obsidian Glass and Clean Clinical Light modes.

## How we built it

- **Frontend Framework:** Built with **React 18** and **Vite** for fast client-side performance and rapid iteration.
- **Styling & Design System:** Custom **Tailwind CSS** with glassmorphism, responsive layouts, Google Fonts (*Space Grotesk* and *Inter*), Lucide icons, and heartbeat divider animations.
- **AI Intelligence Layer:** Powered by **Google Gemini 3.6 Flash** via the Generative Language REST API. Configured with strict system prompts and structured JSON schemas to extract clinical factors, select specialists, evaluate urgency, and generate clinician questions.
- **Deterministic Fail-Safe Engine:** A client-side rule engine spanning 17 clinical clusters with multi-phrase weighted scoring and urgency tie-breaking.
- **Voice & Local Storage:** Native Web Speech Recognition API for voice dictation and `localStorage` for private, persistent session history.

## Challenges we ran into

1. **Model Selection & Availability (The Gemini 3.6 Flash Decision):**  
   When testing bleeding-edge models like Gemini 3.7 Flash, we observed that newly released experimental endpoints frequently experience global demand surges and intermittent `503 Capacity Spike` errors. For a mission-critical health triage tool presented live to judges, unpredictable downtime is unacceptable. We made the deliberate engineering decision to standardize on **Gemini 3.6 Flash** as our primary constant — delivering sub-second latency, zero capacity drops, and consistent JSON formatting.
2. **Medical Safety Guardrails:**  
   Preventing language models from generating definitive disease diagnoses required rigorous prompt constraints that enforce clinical navigation and educational routing rather than medical diagnosis.
3. **Designing a Fail-Safe Hybrid Architecture:**  
   Ensuring that if a user is offline, on poor Wi-Fi, or encounters an API rate limit, the application silently and instantaneously falls back to the client-side deterministic rule engine without breaking the UI.

## Accomplishments that we're proud of

- **Zero-Failure Architecture:** A resilient hybrid system where external API latency or network drops never break the user experience.
- **Explainable Care Navigation:** Transparently exposing matched symptom indicators and clinical definitions rather than operating as an opaque black box.
- **Comprehensive Feature Set:** Completed voice dictation, local maps integration, clinical clipboard exports, PDF print support, emergency overrides, and theme switching in a polished UI.
- **Production Performance:** Clean production build with zero errors, loading sub-second bundles with zero backend dependencies.

## What we learned

- **Clinical Prompt Engineering:** How to extract high-value clinical context from unstructured natural language while enforcing strict non-diagnostic boundaries.
- **Hybrid System Resilience:** The reliability advantages of pairing non-deterministic LLMs for language parsing with deterministic rule engines for mission-critical safety.
- **Accessible Health UX:** How subtle micro-interactions (pulse dividers, urgency-themed badge glows, clear voice feedback) reduce anxiety when users report health concerns.

## What's next for Meridian

- **EHR & Patient Portal Integration:** Exporting care summaries directly into FHIR-compliant patient portals (e.g. MyChart) ahead of scheduled appointments.
- **In-Network Insurance Verification:** Linking specialist suggestions with real-time insurance provider directories.
- **Multi-Language Support:** Adding real-time translation and multi-lingual triage for non-English speakers navigating complex healthcare systems.
- **Wearable Telemetry Context:** Ingesting passive biometrics (resting heart rate, SpO2 trends, temperature spikes) to provide objective physiological context to symptom reports.
