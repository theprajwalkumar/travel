# Bon-Voyage.io — AI Travel Discovery

An AI-powered travel platform that uncovers hidden cultural experiences, sensory narratives, and authentic local connections wherever you go.

## Architecture

- **Next.js 16.2.10** (Turbopack) with TypeScript and React 19
- **Tailwind CSS v4** for styling (CSS-based config via `@theme inline`)
- **OpenAI `gpt-4o-mini`** as primary LLM (fallback chain: Gemini 2.5 → 2.0 → static fallback)
- **MCP tool proxy** for maps, flights, weather, and heritage data
- **Browser SpeechSynthesis** for audio narration (zero-cost TTS)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys: GEMINI_API_KEY, OPENAI_API_KEY, SMITHERY_API_KEY

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── discover/route.ts    # AI-powered discovery endpoint
│   │   └── mcp/proxy/route.ts   # MCP tool proxy endpoint
│   ├── globals.css              # Global styles + Tailwind
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main dashboard page
├── components/
│   ├── Sidebar.tsx              # Navigation sidebar
│   ├── DiscoveryHub.tsx         # Search + vibe selection header
│   ├── LiveMatrix.tsx           # Results grid container
│   ├── SkeletonLoader.tsx       # Loading state with travel quotes
│   ├── CardHiddenGems.tsx       # Cultural hook card
│   ├── CardSensoryTimeMachine.tsx # Audio narration card
│   ├── CardWholesomePlaybook.tsx  # Connection playbook card
│   ├── TravelTools.tsx          # Tools panel container
│   └── tools/
│       ├── MapsPanel.tsx        # Places search
│       ├── FlightsPanel.tsx     # Flight search
│       ├── WeatherPanel.tsx     # Weather data
│       └── HeritagePanel.tsx    # Heritage stories
├── context/
│   └── AppContext.tsx           # Global state management
├── lib/
│   ├── api.ts                  # Client-side API wrapper
│   ├── constants.ts            # App-wide constants
│   ├── fallbackData.ts         # Fallback API response
│   ├── mockData.ts             # Mock travel experience
│   ├── smithery.ts             # MCP/Smithery client
│   └── validation.ts           # Input sanitization & validation
├── types/
│   └── index.ts                # TypeScript type definitions
└── __tests__/
    ├── api.test.ts             # API client tests
    ├── constants.test.ts       # Constants tests
    ├── discover-route.test.ts  # Discover route validation tests
    ├── fallbackData.test.ts    # Fallback data schema tests
    ├── mcp-proxy-route.test.ts # MCP proxy validation tests
    ├── mockData.test.ts        # Mock data schema tests
    └── validation.test.ts      # Validation function tests
```

## Testing

The test suite covers:
- Input validation and sanitization (XSS prevention, type checking)
- API client error handling (network errors, invalid responses)
- Data schema validation (fallback data, mock data structure)
- Route validation logic (missing fields, type coercion)
- Constant integrity

Run tests with `npm test` (76 tests across 7 files).

## Security

- All API keys via environment variables (never hardcoded)
- Input sanitization strips `<` `>` to prevent XSS
- Server and tool names validated with regex whitelist
- String length limits enforced on all user inputs
- API responses include `X-Robots-Tag: noindex` header
- JSON body parsing wrapped in try/catch

## Accessibility

- Semantic HTML (`<header>`, `<main>`, `<aside>`, `<article>`, `<section>`, `<nav>`, `<footer>`)
- Full ARIA attributes (`role`, `aria-label`, `aria-pressed`, `aria-current`, `aria-live`, `aria-hidden`)
- Keyboard navigation (Enter/Space on interactive elements)
- Screen reader support for loading states via `role="status"`
- Focus-visible ring styles on all interactive elements
- Skip-to-content ready (landmarks)

## Deployment

Deployed on Vercel: https://travel-kappa-khaki.vercel.app

```bash
npx vercel --prod
```

Set environment variables in Vercel dashboard:
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `SMITHERY_API_KEY`
