<div align="center">
  <h1>⚡ MotionCraft</h1>
  <p><strong>AI-Native Programmatic Motion Graphics Studio</strong></p>
  <p>Turn text prompts into high-retention 9:16 vertical short-form explainer videos with synchronized voiceover, animated vector diagrams, kinetic subtitles, and hardware-accelerated MP4 export—all at <strong>$0 operational cost</strong>.</p>
</div>

---

## 🌟 Architecture & The $0 Stack

MotionCraft is architected from the ground up to eliminate expensive server-side rendering farms (FFmpeg, AWS EC2, or Lambda) and costly proprietary AI APIs:

```mermaid
sequenceDiagram
    autonumber
    actor User as Creator
    participant UI as Studio Editor (Next.js 16)
    participant AI as Vercel AI SDK (Gemini 1.5 Flash)
    participant TTS as Edge-TTS Audio Engine
    participant Player as Remotion Preview (<MainVideo />)
    participant WebCodecs as Browser WebCodecs + mp4-muxer

    User->>UI: Enter prompt (e.g. "Explain Redis microservices")
    UI->>AI: POST /api/generate
    AI-->>UI: FullVideoPlan (Structured Scene Graph JSON)
    User->>UI: Click "Synthesize Voiceover"
    UI->>TTS: POST /api/tts (Spoken script)
    TTS-->>UI: MP3 Audio Buffer + Millisecond Word Boundaries
    UI->>Player: Mount real-time 9:16 interactive preview
    User->>UI: Click "Export MP4"
    UI->>WebCodecs: Frame-by-frame rasterization & H.264 encode
    WebCodecs-->>User: Instant 1080x1920 MP4 download
```

| Component | Technology | Cost |
|---|---|---|
| **Fullstack Framework** | Next.js 16 (App Router + Turbopack) | $0 (Vercel Hobby) |
| **Video Engine** | Remotion v4 + `@iconify/react` | $0 (Open Source) |
| **LLM Scene Planner** | Vercel AI SDK + Google Gemini 1.5 Flash | $0 (Free Tier) |
| **Speech & Subtitles** | Microsoft Edge-TTS (`msedge-tts`) | $0 (Native WebSocket) |
| **Video Exporter** | In-Browser WebCodecs (`VideoEncoder`) + `mp4-muxer` | $0 (Client GPU) |
| **Database & ORM** | Neon Serverless Postgres + Drizzle ORM | $0 (Free Tier) |
| **Styling & UI** | Tailwind CSS v4 + Shadcn UI | $0 (Open Source) |

---

## 📦 Monorepo Structure

MotionCraft is organized as a high-performance **pnpm Turborepo** workspace:

```
motion-studio/
├── apps/
│   └── web/                         # Next.js 16 Studio Application
│       ├── app/
│       │   ├── page.tsx             # Studio Hero Landing & Launcher
│       │   ├── editor/[id]/page.tsx # Dual-Pane Video Studio Editor
│       │   └── api/
│       │       ├── generate/        # Gemini structured scene generation
│       │       └── tts/             # Edge-TTS speech & timestamp synthesis
│       ├── components/
│       │   ├── editor/              # PromptBar, SceneDrawer, ExportModal
│       │   └── player/              # RemotionPlayer client wrapper
│       └── lib/
│           ├── client-render.ts     # WebCodecs + mp4-muxer frame rasterizer
│           └── gemini.ts            # AI SDK structured scene graph caller
├── packages/
│   ├── video/                       # Remotion Video Engine & Primitives
│   │   └── src/
│   │       ├── compositions/        # MainVideo (Sequence player & audio sync)
│   │       └── primitives/          # FlowNode, AnimatedPath, StatCounter,
│   │                                # KineticText, Comparison
│   ├── schema/                      # Shared Zod Schemas & TypeScript Types
│   ├── db/                          # Drizzle ORM Schema, Neon HTTP Client & Migrations
│   ├── ui/                          # Shared Shadcn UI Component Library
│   ├── eslint-config/               # Shared ESLint configuration
│   └── typescript-config/           # Shared TypeScript configuration
```

---

## 🎨 5 Core Motion Primitives

All animations are driven deterministically by Remotion's frame clock (`useCurrentFrame()` at 30 FPS):

1. **`<FlowNode />`**: Floating glassmorphic card with icon, dynamic color accent, and spring entrance physics.
2. **`<AnimatedPath />`**: Cubic SVG Bezier curve connecting nodes with traveling packet dot indicators.
3. **`<StatCounter />`**: Spring-interpolated numerical odometer counter with prefix, suffix, and label tags.
4. **`<KineticText />`**: Real-time karaoke-style word highlighting synced to Edge-TTS millisecond timestamps.
5. **`<Comparison />`**: Split two-column comparison layout with staggered spring reveals.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.0.0` or later (tested on Node v24)
- **pnpm**: `v10.0.0` or later

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-username/motion-studio.git
cd motion-studio
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example apps/web/.env.local
```

Edit `apps/web/.env.local` with your credentials:

```ini
# Google Gemini API Key (https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here

# Neon Serverless PostgreSQL (https://neon.tech/)
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require

# Clerk Authentication (https://clerk.com/)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

> [!NOTE]
> If `GEMINI_API_KEY` is not provided, MotionCraft automatically falls back to an intelligent, deterministic template generator so you can develop and test the studio offline without any API keys.

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to launch the studio.

---

## 💻 In-Browser Hardware-Accelerated Rendering

MotionCraft renders full 1080×1920 MP4 video files locally on the client machine using **WebCodecs** (`VideoEncoder`) and **`mp4-muxer`**:

- **Hardware Acceleration**: Uses dedicated GPU H.264 video encoding blocks (Intel QuickSync, Apple VideoToolbox, Nvidia NVENC).
- **Zero Server Costs**: No rendering servers, no EC2 instances, no AWS bills.
- **Memory Safety**: Video frames are explicitly and immediately disposed via `videoFrame.close()` to avoid browser memory leaks.
- **Browser Support**: Chrome 94+, Microsoft Edge 94+, Opera 80+, Safari 16.4+.

---

## 🧪 Verification & Quality Checks

Run the verification suite across the entire monorepo:

```bash
# Typecheck all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Production Next.js build
pnpm --filter web build
```

---

## 📄 License

MIT © MotionCraft Studio
