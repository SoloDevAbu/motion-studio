import { z } from "zod/v4";

export const AspectRatioSchema = z.enum(["9:16", "16:9"]);

export const ProjectMetadataSchema = z.object({
  title: z.string().min(1),
  prompt: z.string().min(1),
  aspectRatio: AspectRatioSchema.default("9:16"),
  theme: z.string().default("dark-neon"),
  voiceId: z.string().default("en-US-ChristopherNeural"),
  fps: z.number().int().positive().default(30),
});

export const RenderOptionsSchema = z.object({
  format: z.enum(["mp4"]).default("mp4"),
  width: z.number().int().positive().default(1080),
  height: z.number().int().positive().default(1920),
  fps: z.number().int().positive().default(30),
});

export type AspectRatio = z.infer<typeof AspectRatioSchema>;
export type ProjectMetadata = z.infer<typeof ProjectMetadataSchema>;
export type RenderOptions = z.infer<typeof RenderOptionsSchema>;
