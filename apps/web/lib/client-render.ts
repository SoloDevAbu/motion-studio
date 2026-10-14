import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import * as htmlToImage from "html-to-image";
import type { PlayerRef } from "@remotion/player";

export interface ClientRenderOptions {
  readonly playerRef: PlayerRef;
  readonly totalFrames: number;
  readonly fps?: number;
  readonly width?: number;
  readonly height?: number;
  readonly filename?: string;
  readonly showWatermark?: boolean;
  readonly onProgress?: (progress: number, currentFrame: number, totalFrames: number) => void;
  readonly onStatusChange?: (status: string) => void;
  readonly abortSignal?: AbortSignal;
}

export const isWebCodecsSupported = (): boolean => {
  return (
    typeof window !== "undefined" &&
    typeof window.VideoEncoder !== "undefined" &&
    typeof window.VideoFrame !== "undefined"
  );
};

export async function renderVideoClient({
  playerRef,
  totalFrames,
  fps = 30,
  width = 1080,
  height = 1920,
  filename = "motioncraft-video.mp4",
  showWatermark = true,
  onProgress,
  onStatusChange,
  abortSignal,
}: ClientRenderOptions): Promise<Blob> {
  if (!isWebCodecsSupported()) {
    throw new Error(
      "WebCodecs VideoEncoder is not supported in this browser. Please use Chrome, Edge, or Safari 16.4+ for hardware-accelerated MP4 rendering.",
    );
  }

  const container = playerRef.getContainerNode();
  if (!container) {
    throw new Error("Unable to locate Remotion player container element for rendering.");
  }

  onStatusChange?.("Initializing MP4 multiplexer and hardware encoder...");

  // 1. Initialize MP4 Muxer with AVC (H.264) video track
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: "avc",
      width,
      height,
    },
    fastStart: "in-memory",
  });

  // 2. Setup WebCodecs VideoEncoder
  let encoderError: Error | null = null;
  const videoEncoder = new VideoEncoder({
    output: (chunk, meta) => {
      muxer.addVideoChunk(chunk, meta);
    },
    error: (e) => {
      encoderError = e instanceof Error ? e : new Error(String(e));
      console.error("WebCodecs VideoEncoder error:", e);
    },
  });

  videoEncoder.configure({
    codec: "avc1.640028", // H.264 High Profile Level 4.0
    width,
    height,
    bitrate: 6_000_000, // 6 Mbps for crisp 1080x1920 mobile video
    framerate: fps,
  });

  try {
    // 3. Render frame by frame
    for (let frame = 0; frame < totalFrames; frame++) {
      if (abortSignal?.aborted) {
        throw new Error("Rendering was cancelled by user.");
      }

      if (encoderError) {
        throw encoderError;
      }

      const percent = Math.round(((frame + 1) / totalFrames) * 100);
      onStatusChange?.(`Rendering frame ${frame + 1} of ${totalFrames} (${percent}%)...`);

      // Seek to exact frame
      playerRef.seekTo(frame);

      // Wait for React and DOM to update layout and styles
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );

      // Rasterize container DOM node to 1080x1920 HTML5 Canvas
      const canvas = await htmlToImage.toCanvas(container, {
        width,
        height,
        pixelRatio: 1,
        backgroundColor: "#09090B",
        cacheBust: true,
      });

      // Optional: Stamp free-tier watermark in bottom-right corner
      if (showWatermark) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const watermarkText = "⚡ Made with MotionCraft.studio";
          ctx.font = "bold 26px Inter, system-ui, -apple-system, sans-serif";
          const metrics = ctx.measureText(watermarkText);
          const pillWidth = metrics.width + 36;
          const pillHeight = 50;
          const x = width - pillWidth - 60;
          const y = height - pillHeight - 80;

          // Glass backdrop pill
          ctx.fillStyle = "rgba(9, 9, 11, 0.82)";
          ctx.beginPath();
          ctx.roundRect(x, y, pillWidth, pillHeight, 25);
          ctx.fill();

          ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Text
          ctx.fillStyle = "#FAFAFA";
          ctx.fillText(watermarkText, x + 18, y + 34);
        }
      }

      // 4. Create WebCodecs VideoFrame
      const timestampMicros = Math.round((frame / fps) * 1_000_000);
      const durationMicros = Math.round((1 / fps) * 1_000_000);

      const videoFrame = new VideoFrame(canvas, {
        timestamp: timestampMicros,
        duration: durationMicros,
      });

      // 5. Encode frame (Keyframe every 2 seconds = 60 frames at 30 fps)
      videoEncoder.encode(videoFrame, { keyFrame: frame % (fps * 2) === 0 });

      // 6. IMMEDIATELY close videoFrame to prevent browser GPU memory leak (AGENTS.md rule)
      videoFrame.close();

      onProgress?.(percent, frame + 1, totalFrames);
    }

    onStatusChange?.("Flushing encoder and finalizing MP4 container...");

    // 7. Flush and close encoder
    await videoEncoder.flush();
    videoEncoder.close();

    // 8. Finalize MP4 muxer
    muxer.finalize();

    const { buffer } = muxer.target;
    const blob = new Blob([buffer], { type: "video/mp4" });

    // 9. Trigger browser file download
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = filename.endsWith(".mp4") ? filename : `${filename}.mp4`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setTimeout(() => {
      URL.revokeObjectURL(downloadUrl);
    }, 15000);

    onStatusChange?.("Export complete! File downloaded.");
    return blob;
  } catch (error) {
    try {
      videoEncoder.close();
    } catch {
      // Ignore cleanup error if already closed
    }
    throw error;
  }
}
