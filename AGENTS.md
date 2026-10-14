# AGENTS.md

## Project Rules

You are working on **MotionCraft** (AI Motion Graphics Studio), an AI-native programmatic video generator that turns prompts into short-form motion graphics videos with voiceover, word-synced subtitles, and procedural vector animations.

Before changing code:

1. Read `ai-motion-graphics-v1-plan.md` when the task involves architecture, pipeline design, or feature scope.
2. Read the relevant package README and instructions before implementing specialized work.
3. Inspect existing primitives in `packages/video` and reuse established patterns before creating new ones.

---

## Code Style

- Use **TypeScript** everywhere with strict mode enabled.
- Prefer arrow functions (`const myFunction = () => ...`).
- Prefer `const`; avoid `let` unless local reassignment is strictly required.
- Keep functions small, pure, and focused on a single responsibility.
- Split large files; never let UI components, data fetching, and canvas math mix in the same file.
- Use clear, predictable, descriptive naming (avoid cryptic abbreviations).
- Avoid unnecessary abstractions or premature enterprise design patterns.
- Avoid obvious comments. Only comment to explain non-obvious math, timing quirks, or constraint workarounds.
- **Never leave debug logs**, temporary `console.log`, dead code, or unused imports.
- Keep business logic out of UI components.
- Keep database queries inside server actions or `packages/db`.
- Validate all external and LLM-generated inputs at the boundary using Zod.
- **Never use `any`** to bypass TypeScript errors. Define proper types or use `unknown` with type guards.

---

## Monorepo Structure

Place code in the smallest appropriate scope within the pnpm Turborepo workspace:

- **Web Dashboard & Studio UI** → `apps/web`
- **Remotion Compositions & Video Primitives** → `packages/video`
- **Shared Zod Schemas & Types** → `packages/schema`
- **Database & Drizzle ORM (Neon Postgres)** → `packages/db`
- **In-Browser WebCodecs Renderer** → `apps/web/lib/render`
- **TTS & Audio Processing** → `apps/web/lib/tts`

Do not duplicate types or utilities across packages—place shared code in `packages/schema` or `packages/video`.

---

## UI (Shadcn / Tailwind)

- **Always use Shadcn UI components.**
- **Do not build raw UI components** (buttons, dialogs, dropdowns, tooltips, cards) from scratch when a Shadcn primitive exists.
- Components are located in `apps/web/components/ui`.
- Install missing components from the `apps/web` directory using:
  ```bash
  pnpm dlx shadcn@latest add <component-name>
  ```
- Use Tailwind CSS for custom layout and styling. Preserve consistent dark theme styling (`zinc` or `slate` neutral base).

---

## Video & Remotion (`packages/video`)

- **Frame-based, not second-based:** All animations must be driven by `useCurrentFrame()`. Never use `setTimeout` or `setInterval` inside video components.
- **Spring Physics:** Use Remotion's `spring()` with explicit `fps` and smooth damping parameters for all entrances and exits.
- **Dynamic Icons:** Use `@iconify/react` to resolve vector icons dynamically by string key (`lucide:*`, `simple-icons:*`).
- **Asset Preloading:** Always wrap asynchronous asset loading (fonts, external audio, images) with `delayRender()` and `continueRender()` to prevent blank frames during export.
- **Deterministic Renders:** Never use non-deterministic functions (e.g. `Math.random()`, `Date.now()`) inside a Remotion frame calculation. All random visuals must use seeded deterministic randoms based on the frame or scene index.
- **Aspect Ratio:** Default composition is **1080x1920 (9:16 vertical)** at **30 FPS**. Keep all visual elements within safe mobile margins (padding of at least 80px top/bottom).

---

## LLM & Prompt Pipeline

- **Never ask the LLM to write raw React or Remotion code.**
- The LLM's only job is to return a valid JSON Scene Graph conforming to `FullVideoPlanSchema` from `packages/schema`.
- Always parse and validate LLM outputs using Zod before passing data to Remotion components or storing in the database.
- Handle LLM generation failures gracefully with fallback retry logic and user-friendly error boundaries.

---

## Database (Neon Postgres + Drizzle ORM)

- Use **Drizzle ORM** with the Neon serverless HTTP driver.
- Schema definitions belong in `packages/db/src/schema.ts`.
- Never run ad-hoc raw SQL in production to patch application state.
- Create migrations for every schema modification:
  ```bash
  pnpm --filter @motion/db db:generate
  pnpm --filter @motion/db db:migrate
  ```
- Use UUID primary keys (`defaultRandom()`), explicit foreign key cascades, and timestamp columns (`createdAt`, `updatedAt`).
- Never store raw binary files, video streams, or large base64 buffers directly in database rows.

---

## Client-Side In-Browser Rendering ($0 Stack)

- Version 1 renders MP4 files directly in the user's browser using HTML5 Canvas, WebCodecs (`VideoEncoder`), and `mp4-muxer`.
- Do not add server-side rendering workers (FFmpeg / AWS Lambda) until paying customer tiers are enabled.
- Ensure the render loop cleans up `VideoFrame` objects immediately after encoding to prevent browser memory leaks.
- Always display a continuous progress indicator `(currentFrame / totalFrames * 100)` during export.

---

## Git & Quality

- Make atomic, logical commits with clear conventional commit messages (`feat:`, `fix:`, `refactor:`, `chore:`).
- Do not mix unrelated refactors with new feature implementations.
- **Never commit secrets**, API keys, `.env` files, or local build artifacts.
- Before completing any task, run:
  ```bash
  pnpm typecheck
  pnpm lint
  ```
