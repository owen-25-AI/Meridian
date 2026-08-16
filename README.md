# Meridian — Intelligent Symptom-to-Specialist Care Routing
### PeddieHacks 2026 — Health Track

> **"Know where to go, before it becomes urgent."**  
> Meridian routes patients in plain language to the right medical specialist and urgency level. **It routes; it never diagnoses.**

---

## 🌟 Key Features

1. **Hybrid Intelligence (Gemini 3.6 Flash + Fail-Safe Engine)**:
   - **✨ Gemini 3.6 Flash AI**: Uses natural language understanding to extract clinical indicators, suggest the appropriate specialist, evaluate urgency, and generate tailored questions to ask the doctor.
   - **⚡ Fail-Safe Deterministic Engine**: Built-in 17-cluster weighted rule engine that runs 100% locally. If the API is missing, offline, or times out, Meridian seamlessly falls back to the deterministic engine without breaking mid-demo.
2. **Emergency Override Banner**:
   - Pinned high-contrast alerts for emergency queries.
   - Dedicated direct hotline routing to **988 Suicide & Crisis Lifeline** (call/text 24/7) and **911** for acute medical emergencies.
3. **Transparent Explainability ("How Meridian Decided")**:
   - Displays matched symptom indicators and clinical urgency definitions so clinicians and judges see exactly how recommendations are made.
4. **Actionable Care Checklist**:
   - 3-point next-steps guidance customized for each urgency level (*Emergency*, *Soon*, *Routine*, *Monitor*).
5. **Tier 3 Accessibility & Tools**:
   - 🎙️ **Speech-to-Text Voice Input**: Dictate symptoms using browser-native speech recognition.
   - 📍 **Google Maps Specialist Finder**: Pre-filled 1-click search for nearby providers.
   - 🌓 **Dark / Light Theme**: Toggle between Obsidian Dark and Clinical Light mode.
   - 🖨️ **Print-to-PDF**: Formats a clean clinical care summary card.
6. **Local Session History**:
   - Remembers recent checks with one-click reload/re-run via `localStorage`.

---

## 📖 Model Selection & Story Note (Why Gemini 3.6 Flash)

For production deployment and live hackathon judging, **Gemini 3.6 Flash** is selected as our constant model. While bleeding-edge releases (such as Gemini 3.7 Flash) offer impressive capabilities, they frequently encounter global capacity spikes and rate limiting under live load. **Gemini 3.6 Flash** provides the optimal balance of clinical reasoning quality, sub-second latency, and rock-solid availability.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Gemini API Key
Configure your key in `.env.local`:
```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*(Or click **"API Key"** in the top navigation bar of the running application).*

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🏗️ Architecture & Safety Model

```
User Plain Language Input
         │
    ┌────┴───────────────────────────┐
    ▼                                ▼
[ Gemini 3.6 Flash AI ]     [ Deterministic Rules Engine ]
 (Deep context + questions)  (17 clinical symptom clusters)
    │                                │
    └──────────────┬─────────────────┘
                   ▼
       Structured Care Routing Card
       • Recommended Specialist
       • Urgency Level (Emergency | Soon | Routine | Monitor)
       • Matched Clinical Indicators
       • 3-Step Action Checklist
       • Tailored Questions for Doctor
       • Non-Diagnostic Safety Notice
```

---

## 🛡️ Medical Disclaimer
Meridian is an educational care-routing system designed to guide patients toward appropriate medical care. It does not provide medical diagnoses, treatment plans, or prescriptions. In a medical emergency, always call 911 or your local emergency services immediately.
