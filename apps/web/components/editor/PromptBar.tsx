"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@workspace/ui/components/select";
import {
  Sparkles,
  Mic,
  Loader2,
  CheckCircle2,
  Wand2,
  Lightbulb,
} from "lucide-react";

export interface PromptBarProps {
  readonly onGenerate: (prompt: string) => Promise<void>;
  readonly onSynthesizeAudio: (voiceId: string) => Promise<void>;
  readonly isGenerating: boolean;
  readonly isSynthesizing: boolean;
  readonly hasAudio: boolean;
}

const SUGGESTIONS = [
  "Building Real-Time Microservices with Redis",
  "Zero-Downtime PostgreSQL Schema Migrations",
  "Serverless Edge Functions vs Kubernetes",
  "How WebCodecs Renders MP4 in the Browser",
];

const VOICES = [
  { id: "en-US-ChristopherNeural", label: "Christopher (US Male, Natural Explainer)" },
  { id: "en-US-AriaNeural", label: "Aria (US Female, Dynamic & Clear)" },
  { id: "en-GB-SoniaNeural", label: "Sonia (UK Female, Professional Tech)" },
  { id: "en-US-GuyNeural", label: "Guy (US Male, Deep & Authoritative)" },
];

export const PromptBar: React.FC<PromptBarProps> = ({
  onGenerate,
  onSynthesizeAudio,
  isGenerating,
  isSynthesizing,
  hasAudio,
}) => {
  const [prompt, setPrompt] = useState("");
  const [voiceId, setVoiceId] = useState(VOICES[0]?.id || "en-US-ChristopherNeural");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isGenerating) {
      void onGenerate(prompt.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (prompt.trim() && !isGenerating) {
        void onGenerate(prompt.trim());
      }
    }
  };

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-xl shadow-xl">
      <CardHeader className="gap-1.5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Wand2 className="size-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">AI Video Director</CardTitle>
              <CardDescription className="text-xs">
                Decompose any complex engineering topic into animated 9:16 scenes.
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-[11px] font-mono">
            Gemini 1.5 Flash
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your video topic (e.g. How distributed locks work in Redis)..."
              disabled={isGenerating}
              className="min-h-24 resize-none border-input/60 bg-background/50 text-sm focus-visible:ring-primary/40"
            />
            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5">
              <span>Press <kbd className="rounded border border-border px-1 py-0.5 font-mono text-[10px]">Ctrl+Enter</kbd> to generate</span>
              <span>{prompt.length} chars</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground mr-1">
                <Lightbulb className="size-3 text-amber-400" />
                Templates:
              </span>
              {SUGGESTIONS.map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  onClick={() => setPrompt(item)}
                  className="cursor-pointer border-border/60 hover:bg-muted/80 hover:text-foreground text-[11px] font-normal transition-colors"
                >
                  {item}
                </Badge>
              ))}
            </div>

            <Button
              type="submit"
              disabled={!prompt.trim() || isGenerating}
              className="gap-2 shrink-0 bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
              size="sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Planning Scenes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  <span>Generate Scenes</span>
                </>
              )}
            </Button>
          </div>
        </form>

        <Separator />

        {/* Voiceover Engine Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2.5 w-full sm:max-w-md">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Mic className="size-3.5" />
            </div>
            <div className="w-full">
              <Select value={voiceId} onValueChange={(val) => val && setVoiceId(val)}>
                <SelectTrigger className="w-full h-8 text-xs bg-background/50 border-input/60">
                  <SelectValue placeholder="Select Narrator Voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {VOICES.map((v) => (
                      <SelectItem key={v.id} value={v.id} className="text-xs">
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => void onSynthesizeAudio(voiceId)}
            disabled={isSynthesizing || isGenerating}
            variant={hasAudio ? "secondary" : "outline"}
            size="sm"
            className="text-xs gap-1.5 shrink-0 border-border/80 h-8"
          >
            {isSynthesizing ? (
              <>
                <Loader2 className="size-3.5 animate-spin text-primary" />
                <span>Synthesizing Voice...</span>
              </>
            ) : hasAudio ? (
              <>
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Voiceover Ready</span>
              </>
            ) : (
              <>
                <Mic className="size-3.5 text-primary" />
                <span>Synthesize Voiceover</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
