import { NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import { z } from "zod/v4";

const TtsRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
  voiceId: z.string().default("en-US-ChristopherNeural"),
});

interface EdgeMetadataEvent {
  Metadata?: Array<{
    Type: string;
    Data: {
      Offset: number;
      Duration: number;
      text?: {
        Text: string;
      };
    };
  }>;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = TtsRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.format() },
        { status: 400 },
      );
    }

    const { text, voiceId } = parsed.data;

    const tts = new MsEdgeTTS();
    await tts.setMetadata(
      voiceId,
      OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
      { wordBoundaryEnabled: true },
    );

    const { audioStream, metadataStream } = tts.toStream(text);

    const audioChunks: Buffer[] = [];
    const wordTimestamps: Array<{
      word: string;
      startMs: number;
      endMs: number;
    }> = [];

    // Collect audio data chunks
    const audioPromise = new Promise<Buffer>((resolve, reject) => {
      audioStream.on("data", (chunk: Buffer) => {
        audioChunks.push(chunk);
      });
      audioStream.on("close", () => {
        resolve(Buffer.concat(audioChunks));
      });
      audioStream.on("error", (err: unknown) => {
        reject(err);
      });
    });

    // Collect word boundary events
    const metadataPromise = new Promise<void>((resolve) => {
      if (!metadataStream) {
        resolve();
        return;
      }

      metadataStream.on("data", (chunk: Buffer | string) => {
        try {
          const raw = typeof chunk === "string" ? chunk : chunk.toString("utf8");
          const parsed = JSON.parse(raw) as EdgeMetadataEvent;
          if (!parsed.Metadata) return;

          for (const meta of parsed.Metadata) {
            if (meta.Type === "WordBoundary" && meta.Data && meta.Data.text) {
              // Offset and Duration are in 100ns units (ticks). Divide by 10,000 for milliseconds.
              const startMs = Math.round(meta.Data.Offset / 10000);
              const durationMs = Math.round(meta.Data.Duration / 10000);
              wordTimestamps.push({
                word: meta.Data.text.Text,
                startMs,
                endMs: startMs + durationMs,
              });
            }
          }
        } catch {
          // Ignore incomplete chunk or non-json frame
        }
      });

      metadataStream.on("close", () => {
        resolve();
      });

      metadataStream.on("error", () => {
        resolve(); // Continue even if metadata stream has quirks
      });
    });

    const [audioBuffer] = await Promise.all([audioPromise, metadataPromise]);

    const audioBase64 = audioBuffer.toString("base64");
    const lastWord = wordTimestamps[wordTimestamps.length - 1];
    const durationMs = lastWord ? lastWord.endMs + 300 : 0;

    return NextResponse.json({
      audioBase64,
      mimeType: "audio/mp3",
      wordTimestamps,
      durationMs,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "TTS synthesis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
