# PRD — Vertex (vur-fina clone)

## Original Problem Statement
Clone `alifnewone7-create/vur-fina` and serve it unchanged as a production build. Next.js 16 + React 19 + Tailwind v4 at repo root, FastAPI proxy (`backend/`) routing `/api/*` (port 8001) to Next.js (port 3000). Originally strict "no changes" — user has since started requesting specific upgrades.

User language: Bengali.

## Architecture
- `/app/`: Next.js 16 (App Router) — frontend + API routes, served as production build (`yarn build` + supervisor)
- `/app/backend/`: FastAPI reverse proxy `/api/*` → port 3000 (required by platform K8s ingress)
- MongoDB unused.

## Implemented (with dates)
- Repo cloned, production build served, FastAPI proxy working (earlier sessions)
- Groq API keys (user-provided, x2) with rate-limit failover in `/app/app/api/analyze/route.ts` (earlier session)
- **2026-06: Result card + Analysis Details popup redesign** — `components/chart-analyzer.tsx` (`ResultBlock`, `AnalysisDetailsPopup`, `StatTile`, `ProbabilityScores`, `IndicatorsCard`) restyled to match home/dashboard design language: dark `#12150A→#080A06` gradient cards, `border-white/[0.08]`, lime `#CCFF00` accents, top hairlines, `font-display` typography, hover lift + lime glow, bottom underline animation. UP/DOWN beacon kept green/red per user choice. Functionality unchanged. Rebuilt + restarted, HTTP 200. **User will test himself (explicitly declined agent testing).**

## Pending / Backlog
- P1: Firebase auth — inert, waiting on user keys
- P2: Rotate admin credentials (`iamhear`, public in GitHub history) — only if user explicitly asks

## Credentials
- Admin panel: `/Vertex-Private-Island`, credentials `iamhear` (x3)

## Notes for future agents
- Frontend is a PRODUCTION build: after any frontend code change run `cd /app && yarn build` then `sudo supervisorctl restart frontend`
- Do NOT "fix" inert Firebase features unless asked.
