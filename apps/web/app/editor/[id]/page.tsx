"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Film,
  Download,
  CheckCircle2,
  Sparkles,
  Sliders,
  Layers,
  Wand2,
  Clock,
  Play,
  Share2,
} from "lucide-react";
import type { PlayerRef } from "@remotion/player";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@workspace/ui/components/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card";
import type { FullVideoPlan } from "@motion/schema";
import { PromptBar } from "@/components/editor/PromptBar";
import { SceneDrawer } from "@/components/editor/SceneDrawer";
import { TimelineStrip } from "@/components/editor/TimelineStrip";
import { RemotionPlayer } from "@/components/player/RemotionPlayer";
import { ExportModal } from "@/components/editor/ExportModal";

const INITIAL_PLAN: FullVideoPlan = {
  title: "Building Real-Time Microservices with Redis",
  scenes: [
    {
      speech: "Modern cloud microservices require ultra-low latency event streaming.",
      type: "workflow",
      sfxCue: "pop",
      nodes: [
        {
          id: "node-1",
          label: "API Gateway",
          icon: "lucide:server",
          color: "#3B82F6",
        },
        {
          id: "node-2",
          label: "Redis Stream",
          icon: "simple-icons:redis",
          color: "#F43F5E",
        },
        {
          id: "node-3",
          label: "PostgreSQL",
          icon: "simple-icons:postgresql",
          color: "#06B6D4",
        },
      ],
      edges: [
        { from: "node-1", to: "node-2" },
        { from: "node-2", to: "node-3" },
      ],
    },
    {
      speech: "Accelerating message throughput by over five hundred percent.",
      type: "stat_counter",
      sfxCue: "ding",
      statData: {
        prefix: "",
        value: 500,
        suffix: "%",
        label: "Higher Throughput Under Peak Concurrency",
      },
    },
    {
      speech: "Say goodbye to bottlenecked databases and bloated infrastructure bills.",
      type: "comparison",
      sfxCue: "whoosh",
    },
    {
      speech: "Build resilient, lightning-fast distributed systems effortlessly.",
      type: "kinetic_quote",
      sfxCue: "pop",
    },
  ],
};

export default function EditorPage() {
  const [plan, setPlan] = useState<FullVideoPlan>(INITIAL_PLAN);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [wordTimestamps, setWordTimestamps] = useState<
    Array<{ word: string; startMs: number; endMs: number }> | undefined
  >(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [generationSource, setGenerationSource] = useState<"gemini" | "fallback" | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const playerRef = useRef<PlayerRef | null>(null);

  const totalFrames = Math.max(30, plan.scenes.length * 90);
  const totalSeconds = (totalFrames / 30).toFixed(1);

  const handleGenerate = async (prompt: string) => {
    try {
      setIsGenerating(true);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate plan");
      }

      const data = await res.json();
      setPlan(data.plan);
      setGenerationSource(data.source);
      setActiveSceneIndex(0);
      setAudioUrl(undefined);
      setWordTimestamps(undefined);
    } catch (err) {
      console.error(err);
      alert("Error generating video plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSynthesizeAudio = async (voiceId: string) => {
    try {
      setIsSynthesizing(true);
      const fullSpeech = plan.scenes.map((s) => s.speech).join(" ");
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullSpeech, voiceId }),
      });

      if (!res.ok) {
        throw new Error("TTS synthesis failed");
      }

      const data = await res.json();
      setAudioUrl(`data:${data.mimeType};base64,${data.audioBase64}`);
      setWordTimestamps(data.wordTimestamps);
    } catch (err) {
      console.error(err);
      alert("Error synthesizing audio. Please check your network and try again.");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleUpdateSceneSpeech = (sceneIndex: number, newSpeech: string) => {
    setPlan((prev) => {
      const updated = [...prev.scenes];
      const target = updated[sceneIndex];
      if (!target) return prev;
      updated[sceneIndex] = { ...target, speech: newSpeech };
      return { ...prev, scenes: updated };
    });
  };

  const handleSelectScene = (sceneIndex: number) => {
    setActiveSceneIndex(sceneIndex);
    if (playerRef.current) {
      playerRef.current.seekTo(sceneIndex * 90);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      {/* Top Pro Studio Bar */}
      <header className="flex items-center justify-between px-6 py-2.5 border-b border-border/60 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/" />}
            className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            <span>Dashboard</span>
          </Button>

          <Separator orientation="vertical" className="h-4" />

          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Film className="size-3.5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xs font-semibold text-foreground truncate max-w-xs md:max-w-md">
                {plan.title}
              </h1>
              <span className="text-[10px] text-muted-foreground font-mono">
                {plan.scenes.length} Scenes · {totalSeconds}s · 1080×1920 (9:16)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {generationSource ? (
            <Badge variant="secondary" className="gap-1 text-[11px] font-medium hidden sm:inline-flex">
              <CheckCircle2 className="size-3 text-primary" />
              <span>{generationSource === "gemini" ? "Gemini 1.5 Flash" : "Template Engine"}</span>
            </Badge>
          ) : null}

          {audioUrl ? (
            <Badge variant="outline" className="gap-1 text-[11px] text-emerald-400 border-emerald-500/30 hidden md:inline-flex">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Voice Synced</span>
            </Badge>
          ) : null}

          <Button
            size="sm"
            onClick={() => setIsExportModalOpen(true)}
            className="text-xs gap-1.5 h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md shadow-primary/20"
          >
            <Download className="size-3.5" />
            <span>Export MP4</span>
          </Button>
        </div>
      </header>

      {/* Main Studio Dual-Pane Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto w-full items-start">
        {/* Left Pane: Tabs for AI Director, Scene Graph & Motion Theme (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <Tabs defaultValue="director" className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-muted/60 p-1 rounded-xl h-9">
              <TabsTrigger value="director" className="gap-1.5 text-xs font-medium">
                <Wand2 className="size-3.5 text-primary" />
                <span>AI Director</span>
              </TabsTrigger>
              <TabsTrigger value="scenes" className="gap-1.5 text-xs font-medium">
                <Layers className="size-3.5 text-primary" />
                <span>Scenes ({plan.scenes.length})</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1.5 text-xs font-medium">
                <Sliders className="size-3.5 text-primary" />
                <span>Motion Config</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="director" className="flex flex-col gap-4 mt-4">
              <PromptBar
                onGenerate={handleGenerate}
                onSynthesizeAudio={handleSynthesizeAudio}
                isGenerating={isGenerating}
                isSynthesizing={isSynthesizing}
                hasAudio={Boolean(audioUrl)}
              />

              <SceneDrawer
                plan={plan}
                activeSceneIndex={activeSceneIndex}
                onUpdateSceneSpeech={handleUpdateSceneSpeech}
                onSelectScene={handleSelectScene}
              />
            </TabsContent>

            <TabsContent value="scenes" className="flex flex-col gap-4 mt-4">
              <SceneDrawer
                plan={plan}
                activeSceneIndex={activeSceneIndex}
                onUpdateSceneSpeech={handleUpdateSceneSpeech}
                onSelectScene={handleSelectScene}
              />
            </TabsContent>

            <TabsContent value="settings" className="flex flex-col gap-4 mt-4">
              <Card className="border-border/60 bg-card/60 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Motion Graphics Settings</CardTitle>
                  <CardDescription className="text-xs">
                    Fine-tune rendering resolution, aspect ratio, frame rates, and export parameters.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/40">
                    <div>
                      <span className="font-medium text-foreground block">Aspect Ratio</span>
                      <span className="text-muted-foreground text-[11px]">Optimized for TikTok, Reels, YouTube Shorts</span>
                    </div>
                    <Badge variant="outline" className="font-mono">9:16 Vertical (1080×1920)</Badge>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/40">
                    <div>
                      <span className="font-medium text-foreground block">Frame Rate</span>
                      <span className="text-muted-foreground text-[11px]">Deterministic frame calculations</span>
                    </div>
                    <Badge variant="outline" className="font-mono">30 FPS</Badge>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/40">
                    <div>
                      <span className="font-medium text-foreground block">Rendering Engine</span>
                      <span className="text-muted-foreground text-[11px]">Hardware-accelerated browser WebCodecs</span>
                    </div>
                    <Badge variant="secondary" className="text-primary font-medium">AVC / H.264 @ 6 Mbps</Badge>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/40 border border-border/40">
                    <div>
                      <span className="font-medium text-foreground block">Watermark Branding</span>
                      <span className="text-muted-foreground text-[11px]">Discreet corner badge for free plan</span>
                    </div>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Right Pane: Viewport Stage & Bottom Multi-Track Timeline (5 cols) */}
        <section className="lg:col-span-5 flex flex-col items-center gap-4 sticky top-16">
          <div className="w-full flex flex-col items-center p-6 rounded-2xl bg-card/40 border border-border/60 backdrop-blur-xl shadow-xl bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
            <RemotionPlayer
              playerRef={playerRef}
              plan={plan}
              audioUrl={audioUrl}
              wordTimestamps={wordTimestamps}
            />
          </div>

          <div className="w-full">
            <TimelineStrip
              plan={plan}
              activeSceneIndex={activeSceneIndex}
              onSelectScene={handleSelectScene}
              playerRef={playerRef}
              hasAudio={Boolean(audioUrl)}
            />
          </div>
        </section>
      </main>

      <ExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        playerRef={playerRef}
        totalFrames={totalFrames}
        title={plan.title}
      />
    </div>
  );
}
