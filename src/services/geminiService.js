/**
 * Gemini 3.6 Flash Service for Meridian Care Navigation
 *
 * Sends user symptom descriptions to Google Gemini 3.6 Flash API for structured triage routing.
 * Selected for ultra-low latency, robust throughput, and dependable availability during hackathons.
 */

// Primary production model is Gemini 3.6 Flash for maximum stability and speed
const GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.7-flash",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-flash-latest",
];

export function getStoredApiKey() {
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim() && envKey !== "YOUR_GEMINI_API_KEY_HERE") {
    return envKey.trim();
  }
  try {
    const localKey = localStorage.getItem("meridian_gemini_api_key");
    if (localKey && localKey.trim()) {
      return localKey.trim();
    }
  } catch {
    // localStorage error
  }
  return "";
}

export function saveStoredApiKey(apiKey) {
  try {
    if (apiKey && apiKey.trim()) {
      localStorage.setItem("meridian_gemini_api_key", apiKey.trim());
    } else {
      localStorage.removeItem("meridian_gemini_api_key");
    }
  } catch {
    // localStorage error
  }
}

const SYSTEM_INSTRUCTION = `You are Meridian AI, an intelligent clinical care navigation and triage system built for PeddieHacks 2026 Health Track powered by Google Gemini 3.6 Flash.
Your purpose is to evaluate patient symptom descriptions in plain language and route them to the most appropriate medical specialist and urgency level.

CRITICAL SAFETY & MEDICAL POLICY:
1. You ROUTE and NAVIGATE; you NEVER diagnose diseases, conditions, or prescribe treatments.
2. Frame all outputs as "recommended medical discipline or care setting to consult", never "you have condition X".
3. Urgency levels MUST be strictly one of these four:
   - "emergency": Potential life-threatening cardiac, respiratory, acute neurological, severe trauma, anaphylaxis, or suicidal ideation.
   - "soon": Acute or time-sensitive symptoms requiring clinician evaluation within 24-48 hours (e.g. persistent high fever, persistent headache, sudden vision changes, ear infection).
   - "routine": Subacute or chronic conditions suitable for an outpatient specialist or routine checkup (e.g. knee ache, mild eczema, routine GI issues, counseling).
   - "monitor": Mild, self-limiting symptoms suitable for home observation and rest (e.g. mild fatigue, minor cold).
4. If thoughts of self-harm or suicide are mentioned, set isCrisis to true, urgency to "emergency", and specialist to "Crisis Support — Call or text 988".

You MUST respond strictly with valid JSON conforming to this structure:
{
  "specialist": "Recommended medical specialist or care facility",
  "urgency": "emergency" | "soon" | "routine" | "monitor",
  "rationale": "Clear, compassionate non-diagnostic clinical rationale explaining why this care level is recommended.",
  "matchedKeywords": ["extracted symptom 1", "extracted symptom 2"],
  "isCrisis": boolean,
  "nextSteps": ["actionable step 1", "actionable step 2", "actionable step 3"],
  "questionsForDoctor": [
    "Specific question 1 to ask clinician during visit",
    "Specific question 2 to ask clinician during visit"
  ]
}`;

export async function triageWithGemini(symptomInput, apiKeyOverride = null) {
  const apiKey = apiKeyOverride || getStoredApiKey();
  if (!apiKey) {
    throw new Error("No Gemini API key configured. Please enter your API key in Settings.");
  }

  const prompt = `Patient symptom description:\n"${symptomInput.trim()}"\n\nAnalyze these symptoms and return the structured JSON triage routing object.`;

  let lastError = null;

  // Try Gemini Flash models (prioritizing stable Gemini 3.6 Flash)
  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_INSTRUCTION}\n\n${prompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 0.95,
            maxOutputTokens: 1000,
            responseMimeType: "application/json",
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `Gemini API HTTP Error ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("Empty response received from Gemini.");
      }

      // Parse JSON
      let parsed;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        // Fallback cleanup if model wrapped in markdown code fence
        const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();
        parsed = JSON.parse(cleaned);
      }

      // Validate urgency
      const validUrgencies = ["emergency", "soon", "routine", "monitor"];
      const urgency = validUrgencies.includes(parsed.urgency?.toLowerCase())
        ? parsed.urgency.toLowerCase()
        : "soon";

      return {
        id: `ai-${Date.now()}`,
        specialist: parsed.specialist || "Primary Care Provider",
        urgency: urgency,
        rationale: parsed.rationale || "Evaluated by Meridian AI based on symptom analysis.",
        matchedKeywords: Array.isArray(parsed.matchedKeywords) ? parsed.matchedKeywords : [],
        isCrisis: !!parsed.isCrisis,
        nextSteps: Array.isArray(parsed.nextSteps) && parsed.nextSteps.length > 0 ? parsed.nextSteps : null,
        questionsForDoctor: Array.isArray(parsed.questionsForDoctor) ? parsed.questionsForDoctor : [],
        isFallback: false,
        source: "gemini-ai",
        modelUsed: "Gemini 3.6 Flash",
      };
    } catch (err) {
      lastError = err;
      // If it was an auth error (invalid key format), throw immediately
      if (
        err.message &&
        (err.message.includes("API_KEY_INVALID") || err.message.includes("403") || err.message.includes("API key not valid"))
      ) {
        throw err;
      }
    }
  }

  throw lastError || new Error("Failed to communicate with Gemini 3.6 Flash API.");
}
