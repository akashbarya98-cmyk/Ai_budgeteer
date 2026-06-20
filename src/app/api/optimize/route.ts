import { NextRequest, NextResponse } from "next/server";

interface OptimizeBody {
  prompt: string;
}

// Token estimation: ~0.75 tokens per word (rough OpenAI-style heuristic)
function estimateTokens(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words * 0.75));
}

// Simple prompt compression heuristic — removes filler words & condenses.
// In production, this would call the LLM skill via z-ai-web-dev-sdk.
function compressPrompt(prompt: string): string {
  const filler = new Set([
    "please",
    "kindly",
    "just",
    "really",
    "very",
    "quite",
    "various",
    "regarding",
    "considering",
    "alternative",
    "resource",
    "reallocation",
    "the",
    "a",
    "an",
    "and",
    "to",
    "of",
    "for",
    "with",
    "that",
    "this",
  ]);

  const words = prompt
    .replace(/[.,;:!?"']/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.trim());

  const keep: string[] = [];
  for (const w of words) {
    const lower = w.toLowerCase();
    if (filler.has(lower)) continue;
    if (w.length <= 2) continue;
    keep.push(w);
  }

  // Take the most meaningful keywords (cap at 14 words for a crisp instruction)
  const keywords = keep.slice(0, 14);
  if (keywords.length === 0) return prompt.trim();
  return keywords.join(" ").toLowerCase();
}

function pickModel(tokenCount: number) {
  if (tokenCount <= 25) {
    return {
      before: { model: "GPT-4o", costPer1k: 0.012, modelKey: "gpt-4o" },
      after: { model: "GPT-4o-mini", costPer1k: 0.00048, modelKey: "gpt-4o-mini" },
      routedTo: "llama-3.1-8b",
      reason: "Low complexity — routed to lightweight model",
    };
  }
  if (tokenCount <= 60) {
    return {
      before: { model: "GPT-4o", costPer1k: 0.012, modelKey: "gpt-4o" },
      after: { model: "mixtral-8x7b", costPer1k: 0.0009, modelKey: "mixtral-8x7b" },
      routedTo: "mixtral-8x7b",
      reason: "Medium complexity — balanced quality model",
    };
  }
  return {
    before: { model: "GPT-4o", costPer1k: 0.012, modelKey: "gpt-4o" },
    after: { model: "llama-3.1-70b", costPer1k: 0.0048, modelKey: "llama-3.1-70b" },
    routedTo: "llama-3.1-70b",
    reason: "High complexity — kept quality, reduced cost",
  };
}

export async function POST(req: NextRequest) {
  let body: OptimizeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { prompt } = body;
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json(
      { error: "Prompt is required" },
      { status: 400 }
    );
  }

  const beforeTokens = estimateTokens(prompt);
  const compressed = compressPrompt(prompt);
  const afterTokens = estimateTokens(compressed);

  const routing = pickModel(afterTokens);

  const beforeCost = (beforeTokens / 1000) * routing.before.costPer1k;
  const afterCost = (afterTokens / 1000) * routing.after.costPer1k;
  const savingsPercent = Math.max(
    0,
    Math.round(((beforeCost - afterCost) / beforeCost) * 100)
  );
  const tokensSaved = Math.max(0, beforeTokens - afterTokens);

  // Simulate processing delay
  await new Promise((r) => setTimeout(r, 900));

  return NextResponse.json({
    original: prompt.trim(),
    optimized: compressed,
    beforeWordCount: prompt.trim().split(/\s+/).filter(Boolean).length,
    afterWordCount: compressed.split(/\s+/).filter(Boolean).length,
    beforeTokens,
    afterTokens,
    tokensSaved,
    beforeCost: Number(beforeCost.toFixed(4)),
    afterCost: Number(afterCost.toFixed(4)),
    savingsPercent,
    beforeModel: routing.before.model,
    afterModel: routing.after.model,
    routedTo: routing.routedTo,
    reason: routing.reason,
  });
}
