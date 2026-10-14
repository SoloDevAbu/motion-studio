"use client";

import React from "react";
import type { FullVideoPlan, ScenePayload } from "@motion/schema";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import {
  Layers,
  Volume2,
  Sparkles,
  Clock,
  Play,
  RotateCcw,
} from "lucide-react";
import type { PlayerRef } from "@remotion/player";

export interface TimelineStripProps {
  readonly plan: FullVideoPlan;
  readonly activeSceneIndex: number;
  readonly onSelectScene: (sceneIndex: number) => void;
  readonly playerRef?: React.RefObject<PlayerRef | null>;
  readonly hasAudio?: boolean;
}

const TYPE_COLORS: Record<ScenePayload["type"], { bg: string; text: string; border: string }> = {
  workflow: { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/40" },
  stat_counter: { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/40" },
  comparison: { bg: "bg-amber-500/20", text: "text-amber-300", border: "border-amber-500/40" },
  kinetic_quote: { bg: "bg-purple-500/20", text: "text-purple-300", border: "border-purple-500/40" },
};

export const TimelineStrip: React.FC<TimelineStripProps> = ({
  plan,
  activeSceneIndex,
  onSelectScene,
  playerRef,
  hasAudio,
}) => {
  const totalScenes = plan.scenes.length;
  const totalSeconds = totalScenes * 3;

  const handleSeekScene = (index: number) => {
    onSelectScene(index);
    if (playerRef?.current) {
      // Seek to scene start frame (30 fps * 3s = 90 frames per scene)
      playerRef.current.seekTo(index * 90);
    }
  };

  const handleRestart = () => {
    if (playerRef?.current) {
      playerRef.current.seekTo(0);
    }
    onSelectScene(0);
  };

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xl shadow-xl">
      <CardHeader className="p-3.5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Clock className="size-3.5" />
            </div>
            <CardTitle className="text-xs font-semibold">Interactive Studio Timeline</CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-0.5 rounded border border-border/40 hover:bg-muted/40"
              title="Restart from beginning"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
            <Badge variant="outline" className="font-mono text-[10px]">
              {totalSeconds}s Total · {totalSeconds * 30} Frames
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2.5 p-3.5 pt-0">
        {/* Timeline Timecode Ruler */}
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground/60 px-1 pt-1 border-b border-border/40 pb-1">
          {Array.from({ length: totalScenes + 1 }).map((_, i) => (
            <span key={i} className="flex flex-col items-center">
              <span>{(i * 3).toFixed(1)}s</span>
              <span className="h-1 w-px bg-border/60" />
            </span>
          ))}
        </div>

        {/* Track 1: Video Scene Blocks */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
            <Layers className="size-2.5 text-primary" />
            <span>Track 1: Motion Primitives</span>
          </div>
          <div className="grid grid-flow-col auto-cols-fr gap-1.5 h-10 w-full">
            {plan.scenes.map((scene, index) => {
              const color = TYPE_COLORS[scene.type] || TYPE_COLORS.workflow;
              const isActive = index === activeSceneIndex;

              return (
                <button
                  key={`track-scene-${index}`}
                  type="button"
                  onClick={() => handleSeekScene(index)}
                  className={`group relative flex flex-col justify-center items-start px-2.5 py-1 rounded-lg border text-left transition-all ${
                    color.bg
                  } ${color.border} ${
                    isActive
                      ? "ring-2 ring-primary ring-offset-1 ring-offset-background shadow-md shadow-primary/20 brightness-110"
                      : "hover:brightness-125 opacity-85 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono font-bold text-[10px] text-foreground">
                      #{index + 1}
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground">3.0s</span>
                  </div>
                  <span className={`text-[10px] font-semibold truncate max-w-full ${color.text}`}>
                    {scene.type.replace("_", " ").toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Track 2: Audio & Voiceover Waveform Track */}
        <div className="flex flex-col gap-1 pt-1">
          <div className="flex items-center justify-between text-[10px] font-medium text-muted-foreground">
            <span className="flex items-center gap-1">
              <Volume2 className="size-2.5 text-emerald-400" />
              <span>Track 2: Edge-TTS Spoken Audio</span>
            </span>
            <span className="text-[9px] text-muted-foreground/80">
              {hasAudio ? "✓ Word-boundary timestamps active" : "Draft preview"}
            </span>
          </div>

          <div className="grid grid-flow-col auto-cols-fr gap-1.5 h-6 w-full">
            {plan.scenes.map((scene, index) => (
              <div
                key={`audio-segment-${index}`}
                className={`relative flex items-center justify-center rounded border px-2 overflow-hidden ${
                  hasAudio
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-muted/40 border-border/40 text-muted-foreground"
                }`}
              >
                {/* Simulated Waveform Bars */}
                <div className="flex items-center gap-0.5 w-full justify-around opacity-70">
                  <span className="h-2 w-0.5 rounded-full bg-current" />
                  <span className="h-3 w-0.5 rounded-full bg-current" />
                  <span className="h-4 w-0.5 rounded-full bg-current" />
                  <span className="h-2.5 w-0.5 rounded-full bg-current" />
                  <span className="h-3.5 w-0.5 rounded-full bg-current" />
                  <span className="h-2 w-0.5 rounded-full bg-current" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track 3: SFX & Sound Cues */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5 px-0.5">
          <span className="flex items-center gap-1">
            <Sparkles className="size-2.5 text-primary" />
            <span>SFX Cues:</span>
          </span>
          <div className="flex items-center gap-2 font-mono text-[9px]">
            {plan.scenes.map((s, idx) => (
              <span key={idx} className="flex items-center gap-0.5">
                <span className="text-muted-foreground">#{idx + 1}</span>
                <span className="text-primary font-medium">[{s.sfxCue}]</span>
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
