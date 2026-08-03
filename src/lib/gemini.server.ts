import { createGoogleGenerativeAI } from "@ai-sdk/google";

/** Direct Google Generative AI provider — no Lovable gateway involved. */
export function createGeminiProvider(apiKey: string) {
  return createGoogleGenerativeAI({ apiKey });
}
