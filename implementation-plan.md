# Meridian — Symptom-to-Specialist Triage
### Implementation Plan & Tech Stack Advisory — PeddieHacks 2026 (Health Track)

---

## 1. Product summary

User describes symptoms in plain language → app returns **which type of specialist to see** and **how urgent it is**. It routes, it does not diagnose. That distinction should show up in the UI copy and in your pitch to judges — it's what keeps the tool legitimate and safe.

---

## 2. Tech stack — recommended, with rationale

| Layer | Choice | Why |
|---|---|---|
| Frontend | **React + Vite** | Fastest dev loop of any React setup; no build config to fight with mid-hackathon |
| Styling | **Tailwind CSS** | Ship polished UI without hand-rolling CSS under time pressure |
| Icons | **lucide-react** | Clean, consistent icon set, zero design work needed |
| Triage logic | **Client-side JSON rule engine** (keyword → specialist/urgency map) | Runs instantly, no API dependency, **cannot fail during live judging** |
| Stretch: NLP layer | Anthropic API call to parse free text into the same rule categories | Only add *after* the rule engine works end-to-end — treat it as a progressive enhancement, not the foundation |
| Backend | **None for MVP** | Everything runs client-side; removes a whole failure surface |
| History (stretch) | `localStorage` | Simple session memory, no database needed |
| Hosting | **Vercel or Netlify** (free tier, git-connected) | One-click deploy from GitHub, gives you a live demo link for Devpost |
| Version control | **GitHub, public repo** | Required for submission — set this up in your *first* 15 minutes, not your last |

**Core principle:** the rule-based engine is your safety net. Build and fully wire it up before touching anything else. An LLM call that times out mid-demo is the single most avoidable way to lose points — if you add it, make it a layer *on top of* working rules, not a replacement for them.

---

## 3. Architecture

```
User input (text box)
      │
      ▼
Rule Engine  ──►  symptomRules.json (keyword clusters → specialist, urgency, rationale)
      │
      ▼
Result renderer  ──►  Specialist + Urgency badge + Rationale + Disclaimer
```

No network calls in the critical path. The LLM layer, if you build it, sits *before* the rule engine as a translator (free text → matched keywords), so the core logic never changes.

---

## 4. Data structure (starting point)

```json
{
  "id": "chest-pain",
  "keywords": ["chest pain", "chest pressure", "chest tightness", "can't breathe"],
  "specialist": "Emergency Room",
  "urgency": "emergency",
  "rationale": "Chest pain combined with breathing difficulty can signal a cardiac or respiratory emergency."
}
```

Aim for **12–15 clusters** covering the systems judges will expect: cardiac/respiratory, neuro (headache/dizziness), dermatology, orthopedic/joint, GI, ENT, mental health, general/fever. That range is enough to feel comprehensive in a demo without eating your whole weekend.

---

## 5. MVP & High-Leverage Checklist (Implemented)

- [x] Rule engine with 17 clinical clusters across emergency, soon, routine, and monitor
- [x] Weighted scoring match function (phrase bonuses + urgency severity tie-breaking)
- [x] Input UI with empty-state handling & clear options
- [x] Spectrum-spanning example symptom chips (Emergency, Soon, Routine, Monitor)
- [x] Color-coded urgency badges with pulse/glow indicators
- [x] Matched indicator transparency tags ("Matched on: chest tightness, shortness of breath")
- [x] Actionable urgency-specific next steps checklist (3-point guide)
- [x] High-visibility Emergency Override banner (911 & 988 Suicide & Crisis Lifeline support)
- [x] "How Meridian Decided" transparency & explainability accordion
- [x] Copy clean clinical care summary to clipboard
- [x] Session history stored locally via `localStorage` (last 5 checks with one-click re-run)
- [x] Prominent safety & routing disclaimer

## Next Deployment & Submission Steps
- [ ] GitHub repo created & code pushed
- [ ] Deploy to Vercel/Netlify → verify live link
- [ ] Record 1–2 min demo video
- [ ] Export slides to PDF
- [ ] Devpost submission before deadline

---

## 6. Suggested compressed timeline

Adjust these blocks to however many hours you actually have left before 9:00 AM EDT — the *order* matters more than the exact minutes.

1. **Setup (15–20 min):** GitHub repo, Vite + Tailwind scaffold, deploy a blank page to confirm hosting works end-to-end early.
2. **Rule data (30–40 min):** Write the JSON symptom clusters. This is the actual "product" — spend real thought here.
3. **Match logic (20–30 min):** Plain JS function, no framework magic needed.
4. **UI build (45–60 min):** Input → result flow. Get it *working* before making it pretty.
5. **Polish pass (30–40 min):** Styling, color-coded urgency, copy pass on the disclaimer and rationale text.
6. **Buffer + demo prep (30 min):** Fix whatever broke, record video, export slides.

If time is very short: cut straight to steps 2–4 and skip polish — a working, honest MVP beats a beautiful broken one in front of judges.

---

## 7. Team role split (adjust to your team size)

- **Data/logic person:** owns `symptomRules.json` and the match function
- **UI person:** owns the React components and styling
- **Integration/deploy person:** wires data to UI, handles GitHub + hosting, keeps `main` always demoable
- **Comms person:** slides (PDF), 1–2 min video script and recording, README

If you're 2–3 people, merge roles — but keep one person always responsible for "does `main` currently run," especially this close to the deadline.

---

## 8. Submission checklist (from the PeddieHacks deck)

- [ ] Public GitHub repo link
- [ ] Presentation exported as **PDF**
- [ ] Video demo, **1–2 minutes**
- [ ] Correct track selected on Devpost (Health)
- [ ] All submitted as a zip file per the rules
- [ ] Submitted before **9:00 AM EDT, Sunday 8/16**

---

## 9. Risk notes

- **Reliability over cleverness:** the rule engine should never depend on network access during a live demo.
- **Language matters for judging + safety:** always frame output as "type of care to seek," never "you have X." Keep the disclaimer visible, not buried in a footer.
- **Scope discipline:** given the time lost to the delayed theme reveal, resist adding the LLM layer or history feature until the MVP checklist is fully checked off.
