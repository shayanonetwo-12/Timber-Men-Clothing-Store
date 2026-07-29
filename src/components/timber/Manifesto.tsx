import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const TEXT =
  "We do not chase seasons. We measure the man. Every garment leaves the atelier with a single instruction — outlive its trend, outlast its owner, and remember the hand that shaped it.";

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  const words = TEXT.split(" ");
  return (
    <section id="journal" ref={ref} className="relative px-6 py-40 md:px-16">
      <motion.p style={{ y }} className="eyebrow mb-10 text-center">
        The Manifesto — MMXXVI
      </motion.p>
      <p className="mx-auto max-w-5xl text-center font-display text-3xl leading-[1.15] md:text-6xl">
        {words.map((w, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.15 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: "-30%" }}
            transition={{ duration: 0.5, delay: i * 0.02 }}
            className="inline-block pr-2"
          >
            {w}
          </motion.span>
        ))}
      </p>
      <div className="mx-auto mt-16 h-px w-24 bg-gold" />
    </section>
  );
}
