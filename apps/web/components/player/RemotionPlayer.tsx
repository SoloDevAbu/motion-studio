"use client";

import React from "react";
import { Player, type PlayerRef } from "@remotion/player";
import type { FullVideoPlan } from "@motion/schema";
import { MainVideo, VIDEO_CONFIG } from "@motion/video";
import { Badge } from "@workspace/ui/components/badge";
import { Film, Volume2, Sparkles, Smartphone } from "lucide-react";

export interface RemotionPlayerProps {
  readonly plan: FullVideoPlan;
  readonly audioUrl?: string;
  readonly wordTimestamps?: Array<{
    word: string;
    startMs: number;
    endMs: number;
  }>;
  readonly defaultSceneDurationFrames?: number;
  readonly playerRef?: React.Ref<PlayerRef>;
}

export const RemotionPlayer: React.FC<RemotionPlayerProps> = ({
  plan,
  audioUrl,
  wordTimestamps,
  defaultSceneDurationFrames = 90,
  playerRef,
}) => {
  const totalFrames = Math.max(30, plan.scenes.length * defaultSceneDurationFrames);
  const durationSec = (totalFrames / VIDEO_CONFIG.fps).toFixed(1);

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      {/* Studio Viewport Header */}
      <div className="flex items-center justify-between w-full max-w-[380px] mb-3 px-1 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
          <Smartphone className="size-3.5 text-primary" />
          <span>Mobile Canvas (9:16)</span>
        </div>
        <div className="flex items-center gap-1.5">
          {audioUrl ? (
            <Badge variant="secondary" className="gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <Volume2 className="size-2.5" />
              Synced Audio
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              No Voiceover
            </Badge>
          )}
          <Badge variant="outline" className="font-mono text-[10px]">
            {durationSec}s
          </Badge>
        </div>
      </div>

      {/* Pro Mobile Device Mockup Container */}
      <div className="relative w-full max-w-[360px] aspect-[9/16] rounded-3xl p-2.5 bg-gradient-to-b from-zinc-800/90 via-zinc-900/90 to-zinc-950 border border-zinc-700/60 shadow-[0_0_60px_-15px_rgba(59,130,246,0.18)]">
        {/* Dynamic Island Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-950 rounded-full z-30 flex items-center justify-center border border-zinc-800">
          <div className="size-1.5 rounded-full bg-zinc-800 mr-2" />
          <div className="size-2 rounded-full bg-zinc-900 border border-zinc-700/60" />
        </div>

        {/* Video Canvas Inner Frame */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-950 shadow-inner">
          <Player
            ref={playerRef}
            component={MainVideo}
            inputProps={{
              plan,
              audioUrl,
              wordTimestamps,
              defaultSceneDurationFrames,
            }}
            durationInFrames={totalFrames}
            fps={VIDEO_CONFIG.fps}
            compositionWidth={VIDEO_CONFIG.width}
            compositionHeight={VIDEO_CONFIG.height}
            style={{
              width: "100%",
              height: "100%",
            }}
            controls
            autoPlay={false}
            loop
          />
        </div>
      </div>

      {/* Technical Metadata Footer */}
      <div className="mt-3.5 flex items-center justify-between w-full max-w-[360px] text-[11px] text-muted-foreground px-1 font-mono">
        <span className="flex items-center gap-1">
          <Film className="size-3 text-primary/70" />
          1080 × 1920
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="size-3 text-primary/70" />
          {VIDEO_CONFIG.fps} FPS · Remotion v4
        </span>
      </div>
    </div>
  );
};
