"use client";

import React from "react";
import { Player } from "@remotion/player";
import type { FullVideoPlan } from "@motion/schema";
import { MainVideo, VIDEO_CONFIG } from "@motion/video";

export interface RemotionPlayerProps {
  readonly plan: FullVideoPlan;
  readonly audioUrl?: string;
  readonly wordTimestamps?: Array<{
    word: string;
    startMs: number;
    endMs: number;
  }>;
  readonly defaultSceneDurationFrames?: number;
}

export const RemotionPlayer: React.FC<RemotionPlayerProps> = ({
  plan,
  audioUrl,
  wordTimestamps,
  defaultSceneDurationFrames = 90,
}) => {
  const totalFrames = Math.max(30, plan.scenes.length * defaultSceneDurationFrames);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {/* 9:16 Vertical Video Frame */}
      <div className="relative w-full max-w-[360px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-zinc-800 bg-zinc-950">
        <Player
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

      <div className="mt-3 flex items-center justify-between w-full max-w-[360px] text-xs text-zinc-500 px-1">
        <span>1080 × 1920 (9:16)</span>
        <span>{VIDEO_CONFIG.fps} FPS · {(totalFrames / VIDEO_CONFIG.fps).toFixed(1)}s</span>
      </div>
    </div>
  );
};
