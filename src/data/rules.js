import { AlertTriangle, Clock, CalendarCheck, Home } from "lucide-react";

export const URGENCY_SEVERITY = {
  emergency: 4,
  soon: 3,
  routine: 2,
  monitor: 1,
};

export const RULES = [
  {
    id: "self-harm",
    keywords: [
      "suicidal",
      "want to die",
      "self harm",
      "hurt myself",
      "end my life",
      "kill myself",
      "suicide",
      "ending it all",
    ],
    specialist: "Crisis Support — Call or text 988",
    urgency: "emergency",
    isCrisis: true,
    rationale:
      "Thoughts of self-harm or crisis require immediate compassionate support. The 988 Suicide & Crisis Lifeline is free, confidential, and available 24/7.",
  },
  {
    id: "cardiac",
    keywords: [
      "chest pain",
      "chest pressure",
      "chest tightness",
      "cant breathe",
      "can't breathe",
      "shortness of breath",
      "heart racing",
      "irregular heartbeat",
      "radiating arm pain",
      "crushing chest",
    ],
    specialist: "Emergency Room",
    urgency: "emergency",
    rationale:
      "Chest pressure, tightness, or breathing distress can signal an acute cardiac or respiratory event requiring immediate evaluation.",
  },
  {
    id: "stroke",
    keywords: [
      "worst headache of my life",
      "worst headache",
      "thunderclap headache",
      "slurred speech",
      "sudden confusion",
      "face drooping",
      "facial drooping",
      "numb on one side",
      "arm weakness",
      "sudden vision loss",
    ],
    specialist: "Emergency Room / Acute Neurology",
    urgency: "emergency",
    rationale:
      "Sudden neurological deficits, facial weakness, or acute severe headaches require immediate emergency assessment to rule out stroke or intracranial events.",
  },
  {
    id: "anaphylaxis",
    keywords: [
      "throat swelling",
      "throat closing",
      "difficulty swallowing",
      "tongue swelling",
      "severe allergic reaction",
      "anaphylaxis",
      "lip swelling",
    ],
    specialist: "Emergency Room",
    urgency: "emergency",
    rationale:
      "Rapid swelling of the airway, tongue, or throat can be life-threatening and demands immediate emergency medical intervention.",
  },
  {
    id: "abdo-severe",
    keywords: [
      "severe stomach pain",
      "sudden abdominal pain",
      "vomiting blood",
      "rigid abdomen",
      "stiff neck and fever",
      "non-blanching rash",
      "rash that doesn't fade",
    ],
    specialist: "Emergency Room",
    urgency: "emergency",
    rationale:
      "Acute severe abdominal pain or non-fading petechial rashes point to conditions that can rapidly deteriorate without urgent intervention.",
  },
  {
    id: "headache-persist",
    keywords: [
      "persistent headache",
      "headache for days",
      "light sensitivity",
      "migraine",
      "visual aura",
      "throbbing head",
      "headache for 3 days",
    ],
    specialist: "Neurologist",
    urgency: "soon",
    rationale:
      "A headache persisting over multiple days or accompanied by sensory sensitivities warrants a focused neurological evaluation within 24–48 hours.",
  },
  {
    id: "resp-soon",
    keywords: [
      "persistent cough",
      "cough for weeks",
      "coughing blood",
      "wheezing",
      "deep chest congestion",
      "difficulty breathing when lying down",
    ],
    specialist: "Pulmonologist",
    urgency: "soon",
    rationale:
      "A cough lasting over two weeks or persistent wheezing requires specialized lung function and airway assessment.",
  },
  {
    id: "eye",
    keywords: [
      "eye pain",
      "vision changes",
      "blurry vision",
      "red eye with pain",
      "flashing lights in eye",
      "sudden blurry vision",
      "eye discharge",
    ],
    specialist: "Ophthalmologist",
    urgency: "soon",
    rationale:
      "Acute changes in vision or localized eye pain are time-sensitive and should be examined by an eye specialist within 24 to 48 hours.",
  },
  {
    id: "ent-soon",
    keywords: [
      "ear pain",
      "ear ache",
      "ringing in ear",
      "tinnitus",
      "sudden hearing loss",
      "vertigo",
      "dizziness when standing",
    ],
    specialist: "ENT (Ear, Nose & Throat)",
    urgency: "soon",
    rationale:
      "Acute ear pain, vertigo, or sudden auditory changes benefit from an ENT consultation to prevent secondary complications.",
  },
  {
    id: "infection-acute",
    keywords: [
      "high fever",
      "fever and chills",
      "sore throat with fever",
      "painful urination",
      "urinary pain",
      "sinus infection",
    ],
    specialist: "Primary Care / Urgent Care",
    urgency: "soon",
    rationale:
      "Systemic infection symptoms or acute urinary discomfort warrant an in-person assessment and potential lab work within 1–2 days.",
  },
  {
    id: "joint",
    keywords: [
      "joint pain",
      "swelling in joint",
      "stiff joints",
      "knee pain",
      "shoulder pain",
      "hip pain",
      "clicking knee",
      "pain climbing stairs",
    ],
    specialist: "Orthopedist",
    urgency: "routine",
    rationale:
      "Subacute musculoskeletal joint pain and stiffness are ideal candidates for an elective outpatient orthopedic examination.",
  },
  {
    id: "back-spine",
    keywords: [
      "back pain",
      "lower back pain",
      "sore back",
      "lumbar pain",
      "sciatica",
      "stiff back",
      "muscle spasm back",
    ],
    specialist: "Orthopedist / Physical Therapist",
    urgency: "routine",
    rationale:
      "Most non-emergency back symptoms respond best to structured physical therapy, postural correction, and scheduled care.",
  },
  {
    id: "skin",
    keywords: [
      "rash",
      "itchy skin",
      "skin irritation",
      "acne",
      "eczema",
      "red spots",
      "dry patch",
      "changing mole",
      "hives",
    ],
    specialist: "Dermatologist",
    urgency: "routine",
    rationale:
      "Localized cutaneous symptoms and skin lesions are best evaluated and managed by a board-certified dermatologist on a routine schedule.",
  },
  {
    id: "gi-routine",
    keywords: [
      "stomach ache",
      "bloating",
      "indigestion",
      "nausea",
      "acid reflux",
      "heartburn after eating",
      "constipation",
      "irritable bowel",
    ],
    specialist: "Gastroenterologist",
    urgency: "routine",
    rationale:
      "Recurring digestive discomfort, bloating, or reflux is best investigated through a scheduled gastroenterology consultation.",
  },
  {
    id: "mental-health",
    keywords: [
      "anxious",
      "anxiety",
      "low mood",
      "trouble sleeping",
      "stressed",
      "panic attack",
      "chronic stress",
      "burnout",
      "depression",
    ],
    specialist: "Mental Health Provider / Counselor",
    urgency: "routine",
    rationale:
      "Persistent emotional strain, anxiety, or sleep disruptions benefit greatly from proactive engagement with a licensed therapist or counselor.",
  },
  {
    id: "fatigue-monitor",
    keywords: [
      "tired",
      "fatigue",
      "low energy",
      "sluggish",
      "feeling run down",
      "mild exhaustion",
    ],
    specialist: "Primary Care Provider",
    urgency: "monitor",
    rationale:
      "Mild, non-specific fatigue is frequently lifestyle-related. Monitor sleep and hydration, and bring it up at your next routine checkup.",
  },
  {
    id: "cold-mild",
    keywords: [
      "runny nose",
      "mild sneeze",
      "slight congestion",
      "mild sore throat",
      "scratchy throat",
    ],
    specialist: "Primary Care / Self-Care",
    urgency: "monitor",
    rationale:
      "Mild upper respiratory irritation typically resolves with rest and fluids. Track at home and seek care if symptoms persist beyond a week.",
  },
];

export const FALLBACK = {
  id: "fallback",
  specialist: "Primary Care Provider",
  urgency: "monitor",
  matchedKeywords: [],
  score: 0,
  isFallback: true,
  rationale:
    "No specific high-urgency or specialist pattern was confidently detected. A Primary Care Provider is the safest starting point for unclassified symptoms.",
};

export const URGENCY_META = {
  emergency: {
    label: "Emergency",
    sub: "Seek care immediately",
    icon: AlertTriangle,
    ring: "ring-rose-400/40",
    text: "text-rose-300",
    bg: "bg-rose-500/10",
    glow: "shadow-rose-500/25",
    dot: "bg-rose-400",
    bannerBg: "bg-rose-950/70 border-rose-500/40 text-rose-200",
    definition:
      "Critical symptoms that may indicate life-threatening cardiac, respiratory, or acute neurological conditions requiring immediate emergency evaluation.",
  },
  soon: {
    label: "Soon",
    sub: "Within 24–48 hours",
    icon: Clock,
    ring: "ring-amber-400/40",
    text: "text-amber-300",
    bg: "bg-amber-500/10",
    glow: "shadow-amber-500/20",
    dot: "bg-amber-400",
    bannerBg: "bg-amber-950/70 border-amber-500/40 text-amber-200",
    definition:
      "Time-sensitive symptoms that should be clinically assessed within 1–2 days to prevent progression or manage acute discomfort.",
  },
  routine: {
    label: "Routine",
    sub: "Schedule an appointment",
    icon: CalendarCheck,
    ring: "ring-teal-400/40",
    text: "text-teal-300",
    bg: "bg-teal-500/10",
    glow: "shadow-teal-500/20",
    dot: "bg-teal-400",
    bannerBg: "bg-teal-950/70 border-teal-500/40 text-teal-200",
    definition:
      "Subacute or chronic symptoms best handled by scheduling a standard consultation with an outpatient specialist.",
  },
  monitor: {
    label: "Monitor",
    sub: "Self-care at home",
    icon: Home,
    ring: "ring-slate-400/40",
    text: "text-slate-300",
    bg: "bg-slate-500/10",
    glow: "shadow-slate-500/10",
    dot: "bg-slate-400",
    bannerBg: "bg-slate-900/70 border-slate-700/40 text-slate-300",
    definition:
      "Mild, non-critical symptoms suitable for home observation, hydration, and rest, with clinical follow-up if symptoms persist.",
  },
};

export const NEXT_STEPS = {
  emergency: [
    "Proceed immediately to the nearest Emergency Room or call 911 / your local emergency number.",
    "Do not drive yourself if experiencing dizziness, chest discomfort, or breathing distress.",
    "If experiencing thoughts of self-harm, call or text 988 for free, confidential 24/7 crisis support.",
  ],
  soon: [
    "Contact your primary care physician or specialist clinic to request an appointment within 24–48 hours.",
    "Keep a brief log of symptom onset, intensity, triggers, and any medication taken.",
    "If symptoms escalate rapidly or you develop severe pain or shortness of breath, seek emergency care.",
  ],
  routine: [
    "Schedule a routine consultation with the recommended specialist or your primary care clinic.",
    "Prepare a brief list of current medications, known allergies, and specific questions for your doctor.",
    "Note down any patterns (e.g. time of day or specific physical movements) that aggravate the condition.",
  ],
  monitor: [
    "Practice supportive self-care at home: stay well-hydrated, rest, and observe your body's response.",
    "If symptoms worsen or do not improve within 5–7 days, schedule a check-in with a primary care doctor.",
    "Seek prompt care if new symptoms emerge (such as sudden high fever, rash, or severe pain).",
  ],
};

export const EXAMPLES = [
  { label: "Chest tightness & shortness of breath", tier: "emergency" },
  { label: "Sudden weakness and slurred speech", tier: "emergency" },
  { label: "Persistent headache and light sensitivity for 3 days", tier: "soon" },
  { label: "Eye pain and sudden blurry vision", tier: "soon" },
  { label: "Knee pain when climbing stairs", tier: "routine" },
  { label: "Itchy red rash on forearm", tier: "routine" },
  { label: "Mild fatigue and low energy this week", tier: "monitor" },
];

export function matchSymptomsDeterministic(input) {
  if (!input || !input.trim()) return FALLBACK;

  const normalized = input
    .toLowerCase()
    .replace(/[^\w\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  let candidates = [];

  for (const rule of RULES) {
    let matchedKeywords = [];
    let score = 0;

    for (const keyword of rule.keywords) {
      const kw = keyword.toLowerCase();
      if (normalized.includes(kw)) {
        matchedKeywords.push(keyword);
        const words = kw.split(" ").length;
        const phraseBonus = words > 1 ? words * 20 : 10;
        score += phraseBonus + kw.length;
      }
    }

    if (matchedKeywords.length > 0) {
      candidates.push({
        id: rule.id,
        specialist: rule.specialist,
        urgency: rule.urgency,
        rationale: rule.rationale,
        isCrisis: !!rule.isCrisis,
        matchedKeywords: Array.from(new Set(matchedKeywords)),
        score,
        isFallback: false,
        source: "deterministic-engine",
      });
    }
  }

  if (candidates.length === 0) {
    return FALLBACK;
  }

  candidates.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (URGENCY_SEVERITY[b.urgency] || 0) - (URGENCY_SEVERITY[a.urgency] || 0);
  });

  return candidates[0];
}
