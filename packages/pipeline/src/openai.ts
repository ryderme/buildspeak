import { requireEnv } from "./env.ts";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json_object";
}

interface ChatResponse {
  choices: Array<{ message: { content: string } }>;
  usage?: { total_tokens: number };
}

const RETRY_DELAYS_MS = [1000, 3000, 8000, 20000, 40000, 60000];

export async function chatCompletion(opts: ChatOptions): Promise<string> {
  const baseUrl = requireEnv("OPENAI_API_BASE_URL").replace(/\/$/, "");
  const apiKey = requireEnv("OPENAI_API_KEY");
  const model = requireEnv("OPENAI_MODEL");

  const body: Record<string, unknown> = {
    model,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.2,
  };
  if (opts.maxTokens) body["max_tokens"] = opts.maxTokens;
  if (opts.responseFormat === "json_object") {
    body["response_format"] = { type: "json_object" };
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 400)}`);
      }
      const data = (await res.json()) as ChatResponse;
      const content = data.choices[0]?.message?.content;
      if (!content) throw new Error("No content in response");
      return content;
    } catch (err) {
      lastError = err;
      const delay = RETRY_DELAYS_MS[attempt];
      if (delay === undefined) break;
      console.warn(`  [openai] retry ${attempt + 1} after ${delay}ms: ${(err as Error).message}`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error(`OpenAI request failed: ${String(lastError)}`);
}
