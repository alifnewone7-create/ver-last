
## Update (2026-06)
- Redesigned "Built for serious traders" (Features) section: premium cards with glowing gradient icon tiles, faint numbered index (01-06), hover lift + lime top accent line + corner glow, "Vertex core" micro-label with animated underline. Verified via screenshots (desktop + mobile).

## Full Homepage Redesign (2026-06, this session)
- Every section redesigned: hero (mixed light/bold H1, floating chart card), features bento grid (7/5, 4/4/4, full-width horizontal card), how-it-works timeline (horizontal desktop / vertical mobile), pricing "Choose your access" (Free card with vertical step timeline + $0 header; License card with rotating beam border, $99 hero price, lime perks), CTA band (tech-grid + corner frames), 3-column footer.
- design_agent re-run -> /app/design_guidelines.json updated.
- Kept per user: pill navbar, clay buttons, hero card caption + lime divider, no stats strip, no index numbers.
- Testing agent iteration_2: 100% pass, no issues, all breakpoints (390/768/1920) clean.

## Run Log — June 2026 (as-is redeploy)
- Cloned ver-run repo into /app, yarn install --ignore-engines, pip install backend proxy deps
- next build succeeded (0 errors); user approved one-line shim edit (frontend/package.json: next dev -> next start) to serve production build
- Verified: homepage 200 with title "Vertex AI — Smart Algorithmic Trading", /Vertex-Private-Island 200, /api proxy on 8001 working (session {"authed":false}, /api/news 401 auth-gated as expected)
- No Firebase/Groq keys configured: login/signup/AI analysis inert by design

## June 2026 — Dashboard stat cards redesign
- Redesigned 3 dashboard stat cards (Current plan / Trading tools / Signal engine) in components/dashboard-content.tsx: gradient surface, top accent line, glowing icon tile, big value + sub-caption, hover lift with animated bottom bar
- Responsive: horizontal icon layout on mobile, vertical stacked on desktop; verified via screenshots at 375px and 1920px after production rebuild

## June 2026 — Auth tab switch made instant
- Removed transition-colors/duration-200 from Login/Registration tab buttons and footer switch link in components/auth-card.tsx (phone lag fix); production rebuilt
- Testing agent verified: transition-duration 0s on all three controls, instant mode switch on desktop + 375px mobile, login regression passing

## June 2026 — Auth page mobile overflow fix
- Fixed horizontal overflow (scrollWidth 508 vs 375) on /login & /registration: overflow-x-clip on AuthLayout main, glow div w-[40rem] -> w-full max-w-[40rem]; mobile paddings py-12 -> py-6 sm:py-12, logo mb-8 -> mb-6 sm:mb-8
- Testing agent verified (iteration_5): no horizontal overflow at 375/390/1920 widths, login fits exactly on 375x700; registration 26px taller = real content; login flow regression passed

## June 2026 — Nav glow + dashboard entrance animation removed (mobile perf)
- top-nav.tsx: removed glow shadow behind sticky header wrapper
- dashboard-content.tsx: removed all reveal-up entrance animations + animationDelay (hero, usage chart, 3 stat cards, tools section) — page opens instantly
- Testing agent verified (iteration_6, 100%): boxShadow none, animationName none, opacity 1 on load, hamburger + login regression pass on 375px & 1920px

## June 2026 — Site-wide mobile scroll performance pass
- globals.css MOBILE SCROLL PERFORMANCE block (max-width 1023px): background-attachment forced to scroll (kills fixed-bg repaint), backdrop-filter disabled on surface-luxe/clay-card/clay-inset/backdrop-blur-* with near-opaque dark fallbacks, decorative glow blurs halved (42px/36px)
- Fixed Lightning CSS minifier dedupe bug: -webkit-backdrop-filter first, unprefixed last
- Desktop >=1024px untouched. Testing agent iteration_8: 100% pass (mobile bf=none everywhere, desktop blur intact, no overflow, login regression OK)

## June 2026 — Dashboard-specific mobile lag fix
- Root cause: .welcome-luxe-border infinite conic-gradient border animation (custom-property driven = full repaint per frame) on 2 large dashboard cards (hero + Daily Limit)
- Fix: animation frozen on mobile (<1024px) via MOBILE SCROLL PERFORMANCE block; static border edge remains; desktop unchanged
- Testing agent iteration_9: 100% pass (animation-name none on mobile dashboard/login, welcome-luxe-border still animating on desktop, drawer opens smooth, no overflow)

## June 2026 — Live Signals redesign
- New analyzing loader (counter-rotating rings + orbiting spark + pulsing RadioTower core, transform/opacity only, no SMIL) replaces old infinity animation
- "Live signal ready" heading removed; result card sits directly under top nav
- New EntryClock (static face, hands rotate inside); result card + direction hero redesigned (CALL/PUT chip, big UP/DOWN, one-time sparkline draw, detail tiles) matching site UI
- Testing agent iteration_10: 100% pass (6/6 checks both viewports); DOWN branch symmetric but not server-exercised in run
