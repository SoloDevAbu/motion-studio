import { NextResponse } from "next/server";
import { z } from "zod/v4";
import { generateVideoPlan } from "@/lib/gemini";

const GenerateRequestSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters"),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = GenerateRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid prompt", details: parsed.error.format() },
        { status: 400 },
      );
    }

    const { prompt } = parsed.data;
    const result = await generateVideoPlan(prompt);

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate video plan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
