import { z } from "zod/v4";

export const NodeItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z
    .string()
    .describe("Iconify key e.g. lucide:server, simple-icons:docker"),
  color: z.string().default("#3B82F6"),
});

export const EdgeItemSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
});

export const ScenePayloadSchema = z.object({
  speech: z.string().describe("The exact spoken sentence for this scene"),
  type: z.enum(["workflow", "stat_counter", "comparison", "kinetic_quote"]),
  nodes: z.array(NodeItemSchema).optional(),
  edges: z.array(EdgeItemSchema).optional(),
  statData: z
    .object({
      prefix: z.string().default(""),
      value: z.number(),
      suffix: z.string().default(""),
      label: z.string(),
    })
    .optional(),
  sfxCue: z.enum(["pop", "whoosh", "ding", "none"]).default("pop"),
});

export const FullVideoPlanSchema = z.object({
  title: z.string(),
  scenes: z.array(ScenePayloadSchema),
});

export type NodeItem = z.infer<typeof NodeItemSchema>;
export type EdgeItem = z.infer<typeof EdgeItemSchema>;
export type ScenePayload = z.infer<typeof ScenePayloadSchema>;
export type FullVideoPlan = z.infer<typeof FullVideoPlanSchema>;
