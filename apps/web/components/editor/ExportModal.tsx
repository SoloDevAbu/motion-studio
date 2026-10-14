"use client";

import React, { useState, useRef } from "react";
import type { PlayerRef } from "@remotion/player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import {
  Download,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Film,
} from "lucide-react";
import { renderVideoClient, isWebCodecsSupported } from "@/lib/client-render";

export interface ExportModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly playerRef: React.RefObject<PlayerRef | null>;
  readonly totalFrames: number;
  readonly title: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  open,
  onOpenChange,
  playerRef,
  totalFrames,
  title,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [statusText, setStatusText] = useState("Ready to render");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isSupported = isWebCodecsSupported();

  const handleStartExport = async () => {
    if (!playerRef.current) {
      setErrorMessage("Video player is not ready. Please wait a moment and try again.");
      return;
    }

    try {
      setIsExporting(true);
      setIsComplete(false);
      setErrorMessage(null);
      setProgress(0);
      setCurrentFrame(0);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const sanitizedFilename = (title || "motioncraft-video")
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-")
        .replace(/-+/g, "-");

      await renderVideoClient({
        playerRef: playerRef.current,
        totalFrames,
        fps: 30,
        width: 1080,
        height: 1920,
        filename: `${sanitizedFilename}.mp4`,
        showWatermark: true,
        abortSignal: controller.signal,
        onProgress: (p, frame, total) => {
          setProgress(p);
          setCurrentFrame(frame);
        },
        onStatusChange: (status) => {
          setStatusText(status);
        },
      });

      setIsComplete(true);
      setStatusText("Video exported successfully!");
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("cancelled")) {
        setStatusText("Export cancelled.");
      } else {
        const errorMsg = err instanceof Error ? err.message : "An unexpected rendering error occurred.";
        setErrorMessage(errorMsg);
        setStatusText("Export failed.");
      }
    } finally {
      setIsExporting(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleModalClose = (nextOpen: boolean) => {
    if (isExporting) {
      if (window.confirm("An export is currently running. Cancel export and close?")) {
        handleCancel();
        onOpenChange(false);
      }
      return;
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-md bg-zinc-950 border border-zinc-800 text-zinc-100 p-6">
        <DialogHeader className="gap-1.5 text-left">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-zinc-100">
                Export MP4 Video
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-400">
                Fast, hardware-accelerated 1080×1920 render directly in your browser.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!isSupported && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                WebCodecs is not supported in this browser. Please use Chrome, Edge, or Safari 16.4+ to export videos.
              </span>
            </div>
          )}

          {/* Export specs card */}
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 text-xs">
            <div className="flex justify-between items-center text-zinc-400">
              <span>Resolution:</span>
              <span className="font-mono text-zinc-200">1080 × 1920 (9:16)</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Framerate & Bitrate:</span>
              <span className="font-mono text-zinc-200">30 FPS · 6.0 Mbps</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Total Frames:</span>
              <span className="font-mono text-zinc-200">{totalFrames} frames ({(totalFrames / 30).toFixed(1)}s)</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Renderer Engine:</span>
              <span className="text-blue-400 font-medium">In-Browser WebCodecs (Zero Cost)</span>
            </div>
          </div>

          {/* Progress Section */}
          {(isExporting || isComplete || errorMessage) && (
            <div className="space-y-2.5 p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-300 font-medium truncate max-w-[240px]">
                  {statusText}
                </span>
                <span className="text-zinc-400 font-mono text-[11px] tabular-nums">
                  {progress}%
                </span>
              </div>

              <Progress value={progress} className="w-full" />

              <div className="flex justify-between items-center text-[11px] text-zinc-500 pt-1">
                <span>
                  {isExporting ? `Rendering frame ${currentFrame} / ${totalFrames}` : isComplete ? "Completed" : "Stopped"}
                </span>
                {isExporting && (
                  <span className="flex items-center gap-1 text-blue-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Encoding H.264...</span>
                  </span>
                )}
                {isComplete && (
                  <span className="flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Saved to downloads</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Watermark notice */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 px-1">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>Includes discreet &quot;Made with MotionCraft.studio&quot; badge in bottom corner.</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          {isExporting ? (
            <Button
              type="button"
              variant="outline"
              className="text-xs border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              onClick={handleCancel}
            >
              Cancel Render
            </Button>
          ) : isComplete ? (
            <Button
              type="button"
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5"
              onClick={() => onOpenChange(false)}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Done
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                className="text-xs text-zinc-400 hover:text-zinc-200"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white gap-1.5"
                disabled={!isSupported}
                onClick={handleStartExport}
              >
                <Download className="w-3.5 h-3.5" />
                Start MP4 Export
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
