"use client";

import React from "react";
import type { FullVideoPlan, ScenePayload } from "@motion/schema";
import { Icon } from "@iconify/react";
import { Layers, Volume2, Sparkles, Clock } from "lucide-react";

export interface SceneDrawerProps {
  readonly plan: FullVideoPlan;
  readonly onUpdateSceneSpeech?: (sceneIndex: number, newSpeech: string) => void;
  readonly activeSceneIndex?: number;
}

const TYPE_CONFIG: Record<
  ScenePayload["type"],
  { label: string; bg: string; text: string; border: string }
> = {
  workflow: {
    label: "Workflow",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  stat_counter: {
    label: "Counter",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  comparison: {
    label: "Comparison",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  kinetic_quote: {
    label: "Takeaway",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
};

export const SceneDrawer: React.FC<SceneDrawerProps> = ({
  plan,
  onUpdateSceneSpeech,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Timeline Scenes ({plan.scenes.length})</span>
        </div>
        <span className="text-xs text-zinc-500">
          Total: {(plan.scenes.length * 3).toFixed(0)}s (30 FPS)
        </span>
      </div>

      <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
        {plan.scenes.map((scene, index) => {
          const typeInfo = TYPE_CONFIG[scene.type];

          return (
            <div
              key={`scene-card-${index}`}
              className="flex flex-col gap-3 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
                    {index + 1}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${typeInfo.bg} ${typeInfo.text} ${typeInfo.border}`}
                  >
                    {typeInfo.label}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-zinc-400" />
                    {scene.sfxCue}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    3.0s
                  </span>
                </div>
              </div>

              {/* Spoken Voiceover Sentence */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                  <Volume2 className="w-3 h-3 text-zinc-500" />
                  <span>Spoken Voiceover:</span>
                </div>
                <textarea
                  rows={2}
                  value={scene.speech}
                  onChange={(e) =>
                    onUpdateSceneSpeech?.(index, e.target.value)
                  }
                  className="w-full text-xs p-2 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-zinc-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none transition-all"
                />
              </div>

              {/* Visual Payload Preview */}
              {scene.type === "workflow" && scene.nodes ? (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {scene.nodes.map((node) => (
                    <div
                      key={node.id}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800/60 border border-zinc-700/40 text-xs text-zinc-300"
                    >
                      <Icon icon={node.icon} width="14" height="14" style={{ color: node.color }} />
                      <span>{node.label}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {scene.type === "stat_counter" && scene.statData ? (
                <div className="flex items-baseline gap-2 pt-1 text-xs">
                  <span className="text-base font-bold text-emerald-400">
                    {scene.statData.prefix}
                    {scene.statData.value}
                    {scene.statData.suffix}
                  </span>
                  <span className="text-zinc-400">{scene.statData.label}</span>
                </div>
              ) : null}

              {scene.type === "comparison" ? (
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-zinc-400">
                  <div className="p-2 rounded bg-rose-500/5 border border-rose-500/20 text-rose-300">
                    ✕ The Old Way (Slow & costly)
                  </div>
                  <div className="p-2 rounded bg-emerald-500/5 border border-emerald-500/20 text-emerald-300">
                    ✓ With MotionCraft (Zero server cost)
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
