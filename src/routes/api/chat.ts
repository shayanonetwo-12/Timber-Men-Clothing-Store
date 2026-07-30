import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "../../lib/ai-gateway.server";

const CATALOGUE = `
Formal room (/rooms/formal):
- Ombra Blazer — Super 150s wool, Milan — €1,890 — full-canvas, hand-padded lapel.
- Vello Overcoat — baby cashmere, Piedmont — €3,240.
- Notte Silk Shirt — 24mm mulberry silk — €620.
- Sera Waistcoat — charcoal worsted wool — €740.
- Mezzanotte Trousers — satin-striped evening wool — €690.

Streetwear room (/rooms/streetwear):
- Fero Boots — hand-lasted calf leather — €980.
- Bruma Hoodie — double-face cashmere — €1,120.
- Corvo Bomber — matte technical shell — €1,460.
`;

const SYSTEM = `You are the TIMBER Concierge, the private style advisor of TIMBER — an ultra-premium men's atelier.
Voice: calm, precise, quietly luxurious. Short paragraphs, never salesy, never emoji-heavy.
You help with styling advice, fabric and fit questions, sizing, occasion dressing, and guiding guests to the right room or piece.
Current collection:
${CATALOGUE}
When recommending a piece, name it exactly and mention its room so the guest can find it. If asked about something outside menswear, style, or TIMBER, redirect gracefully. Keep replies under 120 words unless asked for detail.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
