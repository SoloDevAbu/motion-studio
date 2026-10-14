"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Film, Download, CheckCircle2 } from "lucide-react";
import type { PlayerRef } from "@remotion/player";
import { Button } from "@workspace/ui/components/button";
import type { FullVideoPlan } from "@motion/schema";
import { PromptBar } from "@/components/editor/PromptBar";
import { SceneDrawer } from "@/components/editor/SceneDrawer";
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
  const playerRef = useRef<PlayerRef | null>(null);

  const totalFrames = Math.max(30, plan.scenes.length * 90);

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
      // Reset voiceover so user can synthesize for the new text
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

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <span className="text-zinc-700">/</span>
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-blue-400" />
            <h1 className="text-sm font-semibold text-zinc-200 truncate max-w-sm">
              {plan.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {generationSource ? (
            <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              <span>{generationSource === "gemini" ? "AI Generated (Gemini 1.5)" : "Template Generator"}</span>
            </span>
          ) : null}

          <Button
            variant="outline"
            className="text-xs gap-1.5 border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-8"
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Export MP4</span>
          </Button>
        </div>
      </header>

      {/* Main Studio Dual-Pane Layout */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-7xl mx-auto w-full">
        {/* Left Pane: Prompt Bar & Scene Drawer (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <PromptBar
            onGenerate={handleGenerate}
            onSynthesizeAudio={handleSynthesizeAudio}
            isGenerating={isGenerating}
            isSynthesizing={isSynthesizing}
            hasAudio={Boolean(audioUrl)}
          />

          <SceneDrawer
            plan={plan}
            onUpdateSceneSpeech={handleUpdateSceneSpeech}
          />
        </section>

        {/* Right Pane: Embedded Player Dock (5 cols) */}
        <section className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-20 flex flex-col items-center w-full">
            <RemotionPlayer
              playerRef={playerRef}
              plan={plan}
              audioUrl={audioUrl}
              wordTimestamps={wordTimestamps}
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
