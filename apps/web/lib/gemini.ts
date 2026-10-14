import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { FullVideoPlanSchema, type FullVideoPlan } from "@motion/schema";

const SYSTEM_INSTRUCTION = `You are MotionCraft, an elite AI motion graphics director specializing in high-retention 9:16 vertical explainer videos.
Given a user prompt or topic, generate a structured Scene Graph adhering strictly to the JSON schema.

Guidelines:
1. Divide the video into 3 to 5 compelling visual scenes.
2. For each scene, write an engaging, concise spoken voiceover sentence in the 'speech' property (around 8 to 16 words).
3. Use the most visually suitable 'type' for each scene:
   - 'workflow': Architecture, system flow, or multi-step pipeline. Provide 2-3 nodes with valid Iconify icons (e.g. 'lucide:server', 'simple-icons:docker', 'lucide:database', 'simple-icons:redis', 'lucide:shield-check') and connections.
   - 'stat_counter': High-impact quantitative metric. Provide numeric 'value', optional 'prefix' (e.g. '$'), optional 'suffix' (e.g. '%', 'x', 'ms'), and descriptive 'label'.
   - 'comparison': Problem vs Solution, or Old vs New paradigm.
   - 'kinetic_quote': Punchy takeaway or concluding memorable statement.
4. Set 'sfxCue' to 'pop', 'whoosh', 'ding', or 'none'.`;

export async function generateVideoPlan(prompt: string): Promise<{
  plan: FullVideoPlan;
  source: "gemini" | "fallback";
}> {
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (apiKey) {
    try {
      const google = createGoogleGenerativeAI({ apiKey });
      const result = await generateObject({
        model: google("gemini-1.5-flash"),
        schema: FullVideoPlanSchema,
        system: SYSTEM_INSTRUCTION,
        prompt: `Create a captivating vertical explainer video plan for the following topic:\n"${prompt}"`,
      });

      return {
        plan: result.object,
        source: "gemini",
      };
    } catch (err) {
      console.warn("Gemini generation failed, falling back to template generator:", err);
    }
  }

  // Deterministic fallback generator for development and offline testing
  const sanitized = prompt.trim() || "Modern Web Architecture";
  const fallbackPlan: FullVideoPlan = {
    title: sanitized.length > 50 ? `${sanitized.slice(0, 47)}...` : sanitized,
    scenes: [
      {
        speech: `Here is how ${sanitized} powers modern scalable software applications.`,
        type: "workflow",
        sfxCue: "pop",
        nodes: [
          {
            id: "node-1",
            label: "Edge Gateway",
            icon: "lucide:globe",
            color: "#3B82F6",
          },
          {
            id: "node-2",
            label: "Compute Service",
            icon: "lucide:cpu",
            color: "#06B6D4",
          },
          {
            id: "node-3",
            label: "Serverless Database",
            icon: "lucide:database",
            color: "#10B981",
          },
        ],
        edges: [
          { from: "node-1", to: "node-2", label: "HTTPS" },
          { from: "node-2", to: "node-3", label: "Pool" },
        ],
      },
      {
        speech: "Slashing query response latency by over 85 percent.",
        type: "stat_counter",
        sfxCue: "ding",
        statData: {
          prefix: "",
          value: 85,
          suffix: "%",
          label: "Latency Reduction Across Global Edges",
        },
      },
      {
        speech: "Eliminate costly idle servers with instant scale-to-zero capabilities.",
        type: "comparison",
        sfxCue: "whoosh",
      },
      {
        speech: "Ship faster with production-ready vector motion graphics in seconds.",
        type: "kinetic_quote",
        sfxCue: "pop",
      },
    ],
  };

  return {
    plan: fallbackPlan,
    source: "fallback",
  };
}
