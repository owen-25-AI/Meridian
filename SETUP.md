# Meridian — Comprehensive Setup & Deployment Guide
### PeddieHacks 2026 — Health Track

This guide provides step-by-step instructions for running **Meridian** locally, configuring the **Google Gemini 3.6 Flash API**, testing the fail-safe deterministic engine, and deploying to cloud platforms like Vercel or Netlify.

---

## 📋 Prerequisites

Before getting started, make sure you have the following installed on your machine:

1. **Node.js**: Version `18.0.0` or higher (Recommended: Node 20 LTS or Node 22).  
   *Check version:* `node -v`
2. **npm**: Version `9.0.0` or higher.  
   *Check version:* `npm -v`
3. **Git**: Installed and configured.  
   *Check version:* `git --version`
4. **Google Gemini API Key** (Optional for offline mode, recommended for full AI mode).  
   *Get a free API key at:* [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🚀 Step 1: Clone the Repository

Clone the project from GitHub to your local machine:

```bash
git clone https://github.com/owen-25-AI/Meridian.git
cd Meridian
```

---

## 📦 Step 2: Install Dependencies

Install all required frontend dependencies (React, Vite, Tailwind CSS, Lucide Icons):

```bash
npm install
```

---

## 🔑 Step 3: Configure Environment & API Keys

Meridian supports **two convenient ways** to configure your Google Gemini API key:

### Option A: Via `.env.local` File (Recommended for Local Dev)
1. In the root directory of the project, create a file named `.env.local` (or copy `.env.example`):
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and paste your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

### Option B: In-App UI Configuration (Great for Live Demos)
You don't even need a `.env` file!
1. Start the application (`npm run dev`).
2. Click the **"API Key"** button in the top navigation bar.
3. Paste your Gemini API key into the input field.
4. Click **"Test key"** to verify live connection with Gemini 3.6 Flash.
5. Click **"Save & Activate"** (The key is securely stored in your browser's `localStorage`).

> 💡 **Offline Mode Notice:** If no API key is provided, Meridian will automatically run in **Deterministic Rule Mode** (17 clinical clusters with multi-phrase weighted scoring and 100% offline fail-safe execution).

---

## 💻 Step 4: Run the Development Server

Start the local Vite development server:

```bash
npm run dev
```

- Open your browser to: **[http://localhost:3000](http://localhost:3000)**
- The server supports Hot Module Replacement (HMR). Changes to components update in real-time.

---

## 🛠️ Step 5: Production Build & Validation

To test and preview the optimized production build:

```bash
# Generate the production bundle in the dist/ folder
npm run build

# Locally preview the production build
npm run preview
```

---

## ☁️ Step 6: Deploying to the Cloud

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `Meridian` GitHub repository.
4. Set Framework Preset to **Vite**.
5. Under **Environment Variables**, add:
   - **Key:** `VITE_GEMINI_API_KEY`
   - **Value:** `your_actual_gemini_api_key_here`
6. Click **Deploy**. Vercel will provide an instant live HTTPS URL for your Devpost submission.

### Deploying to Netlify
1. Log in to [Netlify](https://netlify.com) and select **"Add new site" > "Import an existing project"**.
2. Connect your `Meridian` repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Under **Environment variables**, set `VITE_GEMINI_API_KEY`.
6. Click **Deploy Site**.

---

## 📂 Project Architecture

```
Meridian/
├── index.html                   # HTML entry point with Space Grotesk & Inter typography
├── package.json                 # Dependency definitions & npm scripts
├── vite.config.js               # Bundler configuration (Port 3000)
├── tailwind.config.js           # Design system tokens & Tailwind CSS config
├── postcss.config.js            # PostCSS plugins
├── .env.example                 # Environment variable template
├── README.md                    # Project overview & feature guide
├── PROJECT_STORY.md             # Devpost submission story
├── SETUP.md                     # This setup & deployment guide
└── src/
    ├── main.jsx                 # Application root entry point
    ├── App.jsx                  # Main triage interface, mode toggle & layout
    ├── index.css                # Global glassmorphism, animations & print styles
    ├── components/
    │   ├── ApiKeyModal.jsx      # Modal for entering, testing & saving API keys
    │   └── HowItWorksModal.jsx  # Safety briefing & triage matrix modal
    ├── services/
    │   └── geminiService.js     # Gemini 3.6 Flash API client & structured JSON parser
    └── data/
        └── rules.js             # 17 clinical clusters, scoring rules & urgency meta
```

---

## ❓ Troubleshooting

### 1. PowerShell Script Execution Policy (Windows)
If you encounter `npm.ps1 cannot be loaded because running scripts is disabled`:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```
Or run directly via command prompt: `cmd.exe /c "npm run dev"`.

### 2. Gemini API Capacity or Rate Limiting
- Meridian automatically targets **Gemini 3.6 Flash** for maximum stability.
- If you ever encounter network interruptions, Meridian's **Fail-Safe Deterministic Engine** automatically takes over without crashing the UI.

---

## 🛡️ License & Medical Notice
Built for **PeddieHacks 2026 (Health Track)**. Meridian is a care-navigation and specialist routing tool; it does not provide medical diagnoses. In an emergency, call 911 or your local emergency services immediately.
