# AstraOS — Cosmic Intelligence Platform

A full-stack astrology web app with real planetary calculations, Claude AI chatbot, Vedic + Western charts, tarot, compatibility, moon phases, and numerology.

## Features

- 🔮 **Real Birth Chart** — Jean Meeus algorithms + Lahiri Ayanamsha (same as Swiss Ephemeris)
- 🤖 **AI Astro Chat** — Claude AI with full chart context. First 3 free, then premium
- 🌙 **Daily Horoscope** — AI-generated, personalised to your chart daily
- 🃏 **Tarot** — Three-card spread with AI interpretation
- 💞 **Compatibility** — Vedic Guna Milan + Western synastry
- 🌕 **Moon Calendar** — Live phases with rituals and guidance
- 🔢 **Numerology** — Life path, destiny, soul urge, personality numbers
- 💳 **Freemium** — Free tier + ₹299/month premium

## Tech Stack

- **Frontend:** React 18 + Vite + CSS Modules
- **State:** Zustand
- **Routing:** React Router v6
- **AI:** Claude API (Anthropic) — `claude-sonnet-4-20250514`
- **Astrology:** Custom Jean Meeus implementation
- **Hosting:** Vercel

## Setup

```bash
# Install dependencies
npm install

# Copy env file and add your Claude API key
cp .env.example .env.local
# Edit .env.local and add VITE_CLAUDE_API_KEY

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```
VITE_CLAUDE_API_KEY=your_claude_api_key_here
```

Get your key at: https://console.anthropic.com

## Adding Claude API Key on Vercel

1. Go to your Vercel project → Settings → Environment Variables
2. Add `VITE_CLAUDE_API_KEY` with your Anthropic API key
3. Redeploy

**Note:** Without the API key, the app uses intelligent fallback responses — all features still work beautifully.

## Deployment

```bash
# Deploy to Vercel
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

---

Built with ✦ for AstraOS
# astraos-web
