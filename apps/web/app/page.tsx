import Link from "next/link";
import { Sparkles, ArrowRight, Video, Zap, Volume2, ShieldCheck } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-800/60 bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
            <Video className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-zinc-100">
            MotionCraft<span className="text-blue-500">.studio</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/editor/new">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 h-9 rounded-xl shadow-lg shadow-blue-500/20 gap-2">
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Native Programmatic Video Generator ($0 Server Cost)</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-zinc-100 leading-[1.1] mb-6">
          Turn any prompt into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
            stunning vector motion graphics
          </span>
        </h1>

        <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mb-10">
          Automate high-retention 9:16 vertical videos complete with AI scene graphs,
          word-synced subtitles, Microsoft neural voiceover, and procedural spring animations.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <Link href="/editor/new" className="w-full">
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold h-12 rounded-xl text-base gap-2 shadow-xl shadow-blue-600/20">
              <Sparkles className="w-5 h-5" />
              <span>Launch Studio Editor</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 w-full text-left">
          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 mb-1">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-200">Zero Server Cost ($0)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Browser-based WebCodecs rendering and free tier APIs eliminate costly cloud GPU render farms.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-1">
              <Volume2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-200">Exact Word Timestamps</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Microsoft Edge neural voices with sub-millisecond word boundary offsets power dynamic kinetic captions.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-200">Deterministic Remotion Math</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Spring-physics driven vector primitives guarantee perfect frame-by-frame rendering at 30 FPS.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
