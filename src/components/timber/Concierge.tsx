import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { toast } from "sonner";

const SUGGESTIONS = [
  "What should I wear to a black-tie dinner?",
  "Cashmere or wool for winter?",
  "Style the Corvo Bomber for me",
];

export function Concierge() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => toast.error(e.message || "The concierge is unavailable right now."),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, status]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    void sendMessage({ text: value });
    setInput("");
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open the TIMBER concierge"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, duration: 0.6 }}
        className="fixed bottom-6 right-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-surface shadow-[0_0_40px_-10px_rgba(212,175,110,0.5)] transition-colors hover:border-gold"
      >
        {open ? (
          <X size={18} className="text-gold" />
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gold">
            <path d="M5 4 L19 4 M12 4 L12 21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="12" cy="4" r="2" fill="currentColor" />
          </svg>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.section
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
            className="fixed bottom-24 right-6 z-[80] flex h-[540px] w-[min(94vw,400px)] flex-col border border-gold/20 bg-surface/95 backdrop-blur-xl"
          >
            <header className="border-b border-gold/10 px-5 py-4">
              <p className="eyebrow text-gold">TIMBER Concierge</p>
              <p className="mt-1 text-xs text-muted-foreground">Private styling, fabric and fit advice.</p>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Good evening. Tell me the occasion, and I will cut you a wardrobe for it.
                  </p>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="block w-full border border-gold/20 px-3 py-2 text-left text-xs text-foreground/80 transition-colors hover:border-gold hover:text-gold"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                if (!text) return null;
                return m.role === "user" ? (
                  <div key={m.id} className="flex justify-end">
                    <p className="max-w-[85%] bg-gold px-3 py-2 text-sm text-background">{text}</p>
                  </div>
                ) : (
                  <p key={m.id} className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {text}
                  </p>
                );
              })}

              {status === "submitted" && (
                <p className="animate-pulse text-sm text-muted-foreground">Considering…</p>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-end gap-2 border-t border-gold/10 p-3"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(input);
                  }
                }}
                placeholder="Ask the concierge…"
                aria-label="Message the concierge"
                className="max-h-28 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="flex h-9 w-9 items-center justify-center border border-gold/30 text-gold transition-colors hover:border-gold disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
