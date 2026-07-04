# Bon-Voyage — AI Travel Discovery

An AI-powered travel platform that uncovers hidden cultural experiences, sensory narratives, and authentic local connections wherever you go.

## Architecture

- **Next.js 16.2.10** (Turbopack) with TypeScript and React 19
- **Tailwind CSS v4** (CSS-based config via `@theme inline`)
- **OpenAI `gpt-4o-mini`** (primary LLM) → **Gemini 2.5/2.0** (fallback chain) → **static fallback**
- **MCP tool proxy** for maps, flights, weather, heritage
- **Browser SpeechSynthesis** for audio narration (zero-cost TTS)

## Getting Started

```bash
npm install
cp .env.example .env.local  # add GEMINI_API_KEY, OPENAI_API_KEY, SMITHERY_API_KEY
npm run dev                  # http://localhost:3000
npm run build                # production build
npm test                     # run 76 unit tests
```

## Project Structure

```
src/
├── __tests__/               # 7 test files, 76 tests
│   ├── api.test.ts
│   ├── constants.test.ts
│   ├── discover-route.test.ts
│   ├── fallbackData.test.ts
│   ├── mcp-proxy-route.test.ts
│   ├── mockData.test.ts
│   └── validation.test.ts
├── app/
│   ├── api/discover/route.ts   # AI discovery endpoint
│   ├── api/mcp/proxy/route.ts   # MCP tool proxy
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── DiscoveryHub.tsx
│   ├── LiveMatrix.tsx
│   ├── SkeletonLoader.tsx
│   ├── CardHiddenGems.tsx
│   ├── CardSensoryTimeMachine.tsx
│   ├── CardWholesomePlaybook.tsx
│   ├── TravelTools.tsx
│   └── tools/ (MapsPanel, FlightsPanel, WeatherPanel, HeritagePanel)
├── context/AppContext.tsx
├── lib/
│   ├── api.ts              # client-side API wrapper
│   ├── constants.ts        # app-wide constants
│   ├── fallbackData.ts     # AI fallback response
│   ├── mockData.ts         # demo travel experience
│   ├── smithery.ts         # MCP/Smithery client
│   └── validation.ts       # input sanitisation & validation
└── types/index.ts
```

## Key Optimisations

- **Context memoised** with `useMemo` — prevents cascading re-renders
- **All components wrapped in `React.memo`** — skips re-render when props unchanged
- **All panel fetches use `AbortController`** — cancels stale requests on destination change
- **Quote rotation uses index cycling** (`O(1)`) instead of `Math.random()` + `Math.floor()`
- **Monotonic ID counter** replaces `Date.now()` for experience IDs
- **AI provider fallback halts at first success** — no wasted API calls
- **JSDoc on every exported function** — full SRP, single-responsibility design

## Deployment

```bash
npx vercel --prod
# Set GEMINI_API_KEY, OPENAI_API_KEY, SMITHERY_API_KEY in Vercel dashboard
```
