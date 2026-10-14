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
import { Badge } from "@workspace/ui/components/badge";
import { Progress } from "@workspace/ui/components/progress";
import { Separator } from "@workspace/ui/components/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@workspace/ui/components/card";
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
        onProgress: (p, frame) => {
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
      <DialogContent className="sm:max-w-md bg-background border-border text-foreground p-6">
        <DialogHeader className="gap-2 text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Film className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold">
                Export 1080×1920 MP4 Video
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Hardware-accelerated client-side rendering powered by WebCodecs.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {!isSupported && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <span>
                WebCodecs is not supported in this browser. Please use Chrome, Edge, or Safari 16.4+ to export videos.
              </span>
            </div>
          )}

          {/* Export specs card */}
          <Card className="border-border/60 bg-muted/30">
            <CardContent className="flex flex-col gap-2 p-3.5 text-xs">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Output Canvas:</span>
                <Badge variant="outline" className="font-mono">1080 × 1920 (9:16 Vertical)</Badge>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Codec & Bitrate:</span>
                <span className="font-mono text-foreground font-medium">H.264 High Profile · 6.0 Mbps</span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Duration:</span>
                <span className="font-mono text-foreground font-medium">
                  {totalFrames} frames ({(totalFrames / 30).toFixed(1)}s @ 30 FPS)
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Rendering Engine:</span>
                <Badge variant="secondary" className="text-primary font-medium">
                  Zero Server Cost ($0)
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Progress Section */}
          {(isExporting || isComplete || errorMessage) && (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col gap-2.5 p-3.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-foreground font-medium truncate max-w-[240px]">
                    {statusText}
                  </span>
                  <span className="text-muted-foreground font-mono text-[11px] tabular-nums">
                    {progress}%
                  </span>
                </div>

                <Progress value={progress} className="w-full" />

                <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
                  <span>
                    {isExporting ? `Frame ${currentFrame} / ${totalFrames}` : isComplete ? "Finished" : "Aborted"}
                  </span>
                  {isExporting && (
                    <span className="flex items-center gap-1 text-primary">
                      <Loader2 className="size-3 animate-spin" />
                      <span>Encoding...</span>
                    </span>
                  )}
                  {isComplete && (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="size-3.5" />
                      <span>Saved to downloads</span>
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {errorMessage && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {errorMessage}
            </div>
          )}

          {/* Watermark notice */}
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground px-1">
            <Sparkles className="size-3 text-primary shrink-0" />
            <span>Free export includes discreet &quot;Made with MotionCraft.studio&quot; corner watermark.</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-end">
          {isExporting ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleCancel}
            >
              Cancel Render
            </Button>
          ) : isComplete ? (
            <Button
              type="button"
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => onOpenChange(false)}
            >
              <CheckCircle2 className="size-3.5" />
              Done
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                size="sm"
                className="text-xs gap-1.5 font-medium shadow-md shadow-primary/20"
                disabled={!isSupported}
                onClick={handleStartExport}
              >
                <Download className="size-3.5" />
                Start MP4 Export
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
