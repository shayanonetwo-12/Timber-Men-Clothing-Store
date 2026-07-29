import { motion } from "framer-motion";

const STEPS = [
  { n: "01", t: "Measure", d: "Fourteen points of contact. Three fittings. One canvas cut only for you." },
  { n: "02", t: "Draft", d: "The pattern is drawn by hand on brown paper, then transferred to Super 150s cloth." },
  { n: "03", t: "Baste", d: "Full-canvas construction. Horsehair, camel hair, and floating chest piece — never fused." },
  { n: "04", t: "Deliver", d: "Sealed in a walnut case. Registered in the ledger. Yours for the next thirty years." },
];

export function Atelier() {
  return (
    <section id="atelier" className="relative px-6 py-32 md:px-16">
      <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">The Craft</p>
          <h2 className="mt-4 max-w-xl font-display text-5xl leading-[0.95] md:text-7xl">
            Four hands.<br />
            <em className="text-gold-gradient not-italic">Ninety hours.</em>
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          A single suit passes through the hands of four master tailors before it
          earns the TIMBER stamp. No shortcuts. No exceptions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="group relative bg-background p-8 transition-colors duration-500 hover:bg-surface"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
                Step {s.n}
              </span>
              <span className="font-display text-6xl text-foreground/20 transition-colors duration-500 group-hover:text-gold/60">
                {s.n}
              </span>
            </div>
            <h3 className="mt-8 font-display text-3xl">{s.t}</h3>
            <div className="gold-hairline my-4 w-8 transition-all duration-500 group-hover:w-16" />
            <p className="text-sm leading-relaxed text-muted-foreground">{s.d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
