import Link from "next/link";
import { Sparkles, ArrowRight, Video, Zap, Volume2, ShieldCheck, Film } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border/60 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center size-8 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Video className="size-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-foreground">
            MotionCraft<span className="text-primary">.studio</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            render={<Link href="/editor/new" />}
            size="sm"
            className="font-semibold gap-1.5 shadow-md shadow-primary/20"
          >
            <span>Open Studio</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-4xl mx-auto">
        <Badge variant="secondary" className="gap-2 px-3 py-1 mb-6 text-xs font-medium">
          <Sparkles className="size-3.5 text-primary" />
          <span>AI-Native Programmatic Video Generator ($0 Server Cost)</span>
        </Badge>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
          Turn any prompt into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
            stunning vector motion graphics
          </span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-10">
          Automate high-retention 9:16 vertical videos complete with AI scene graphs,
          word-synced subtitles, Microsoft neural voiceover, and procedural spring animations.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <Button
            render={<Link href="/editor/new" />}
            size="lg"
            className="w-full font-semibold gap-2 shadow-xl shadow-primary/20"
          >
            <Film className="size-5" />
            <span>Launch Studio Editor</span>
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* Feature Cards using Shadcn Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-20 w-full text-left">
          <Card className="border-border/60 bg-card/60 backdrop-blur-xl hover:border-border transition-all">
            <CardHeader className="p-5 pb-2">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-1">
                <Zap className="size-4" />
              </div>
              <CardTitle className="text-sm font-semibold">Zero Server Cost ($0)</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed">
              Browser-based WebCodecs rendering and free tier APIs eliminate costly cloud GPU render farms.
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-xl hover:border-border transition-all">
            <CardHeader className="p-5 pb-2">
              <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-1">
                <Volume2 className="size-4" />
              </div>
              <CardTitle className="text-sm font-semibold">Exact Word Timestamps</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed">
              Microsoft Edge neural voices with sub-millisecond word boundary offsets power dynamic kinetic captions.
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/60 backdrop-blur-xl hover:border-border transition-all">
            <CardHeader className="p-5 pb-2">
              <div className="size-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-1">
                <ShieldCheck className="size-4" />
              </div>
              <CardTitle className="text-sm font-semibold">Deterministic Remotion Math</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 text-xs text-muted-foreground leading-relaxed">
              Spring-physics driven vector primitives guarantee perfect frame-by-frame rendering at 30 FPS.
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
