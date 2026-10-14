"use client";

import React, { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Sparkles, Mic, Loader2 } from "lucide-react";

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
  { id: "en-GB-SoniaNeural", label: "Sonia (UK Female, Professional)" },
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

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to explain (e.g. Serverless Database Architecture)..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            disabled={isGenerating}
          />

          <Button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 h-10 rounded-xl shrink-0"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Video</span>
              </>
            )}
          </Button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-zinc-500 mr-1">Suggestions:</span>
          {SUGGESTIONS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPrompt(item)}
              className="text-xs px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/40 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </form>

      {/* Voiceover Synthesis Row */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Mic className="w-4 h-4 text-zinc-400 shrink-0" />
          <select
            value={voiceId}
            onChange={(e) => setVoiceId(e.target.value)}
            className="w-full text-xs px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-blue-500"
          >
            {VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="button"
          onClick={() => void onSynthesizeAudio(voiceId)}
          disabled={isSynthesizing || isGenerating}
          variant="outline"
          className="text-xs gap-1.5 border-zinc-700 hover:bg-zinc-800 text-zinc-200 h-8"
        >
          {isSynthesizing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Synthesizing Voice...</span>
            </>
          ) : hasAudio ? (
            <span className="text-emerald-400">✓ Voiceover Synced</span>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-blue-400" />
              <span>Synthesize Voiceover</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
