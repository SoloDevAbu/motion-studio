"use client";

import React from "react";
import type { FullVideoPlan, ScenePayload } from "@motion/schema";
import { Icon } from "@iconify/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Textarea } from "@workspace/ui/components/textarea";
import { Separator } from "@workspace/ui/components/separator";
import {
  Layers,
  Volume2,
  Sparkles,
  Clock,
  Check,
  X,
  PlayCircle,
} from "lucide-react";

export interface SceneDrawerProps {
  readonly plan: FullVideoPlan;
  readonly onUpdateSceneSpeech?: (sceneIndex: number, newSpeech: string) => void;
  readonly activeSceneIndex?: number;
  readonly onSelectScene?: (sceneIndex: number) => void;
}

const TYPE_CONFIG: Record<
  ScenePayload["type"],
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  workflow: { label: "Architecture / Workflow", variant: "default" },
  stat_counter: { label: "Metrics Counter", variant: "secondary" },
  comparison: { label: "A/B Comparison", variant: "outline" },
  kinetic_quote: { label: "Key Takeaway", variant: "secondary" },
};

export const SceneDrawer: React.FC<SceneDrawerProps> = ({
  plan,
  onUpdateSceneSpeech,
  activeSceneIndex = 0,
  onSelectScene,
}) => {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Layers className="size-3.5" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            Story Scenes ({plan.scenes.length})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[11px]">
            {plan.scenes.length * 3}s Total · 30 FPS
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-h-[640px] overflow-y-auto pr-1">
        {plan.scenes.map((scene, index) => {
          const typeInfo = TYPE_CONFIG[scene.type] || { label: scene.type, variant: "default" };
          const isActive = index === activeSceneIndex;

          return (
            <Card
              key={`scene-card-${index}`}
              className={`border transition-all ${
                isActive
                  ? "border-primary/60 bg-card shadow-md shadow-primary/5 ring-1 ring-primary/30"
                  : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70"
              }`}
            >
              <CardHeader className="gap-2 p-3.5 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono text-xs px-2 py-0.5">
                      #{index + 1}
                    </Badge>
                    <Badge variant={typeInfo.variant} className="text-[11px] font-medium">
                      {typeInfo.label}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Sparkles className="size-3 text-primary" />
                      <span className="capitalize">{scene.sfxCue}</span>
                    </span>
                    <Separator orientation="vertical" className="h-3" />
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="size-3" />
                      3.0s
                    </span>
                    {onSelectScene && (
                      <button
                        type="button"
                        onClick={() => onSelectScene(index)}
                        className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
                        title="Jump to this scene in player"
                      >
                        <PlayCircle className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-3 p-3.5 pt-1">
                {/* Spoken Voiceover Script */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium">
                      <Volume2 className="size-3 text-primary/70" />
                      Voiceover Script:
                    </span>
                    <span className="font-mono text-[10px]">{scene.speech.length} chars</span>
                  </div>
                  <Textarea
                    rows={2}
                    value={scene.speech}
                    onChange={(e) => onUpdateSceneSpeech?.(index, e.target.value)}
                    className="min-h-16 text-xs resize-none bg-background/50 border-input/60 focus-visible:ring-primary/40"
                    placeholder="Enter spoken narration for this scene..."
                  />
                </div>

                {/* Motion Primitive Visual Elements */}
                {scene.type === "workflow" && scene.nodes ? (
                  <div className="flex flex-col gap-1.5 pt-1">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Flow Nodes & Connections:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {scene.nodes.map((node) => (
                        <div
                          key={node.id}
                          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/60 border border-border/40 text-xs text-foreground"
                        >
                          <Icon icon={node.icon} width="14" height="14" style={{ color: node.color }} />
                          <span className="font-medium">{node.label}</span>
                        </div>
                      ))}
                      {scene.edges && scene.edges.length > 0 ? (
                        <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                          {scene.edges.length} {scene.edges.length === 1 ? "link" : "links"}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                {scene.type === "stat_counter" && scene.statData ? (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs">
                    <span className="text-base font-extrabold text-emerald-400 font-mono">
                      {scene.statData.prefix}
                      {scene.statData.value}
                      {scene.statData.suffix}
                    </span>
                    <span className="text-muted-foreground">{scene.statData.label}</span>
                  </div>
                ) : null}

                {scene.type === "comparison" ? (
                  <div className="grid grid-cols-2 gap-2 pt-0.5 text-xs">
                    <div className="flex items-center gap-1.5 p-2 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-[11px]">
                      <X className="size-3.5 shrink-0" />
                      <span>Legacy Architecture</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px]">
                      <Check className="size-3.5 shrink-0" />
                      <span>Modern MotionCraft</span>
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
