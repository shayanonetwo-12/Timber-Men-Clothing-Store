import { motion, type Variants } from "framer-motion";
import { lazy, Suspense } from "react";
import heroShowroom from "../../assets/hero-showroom.jpg";

const HeroScene = lazy(() =>
  import("./HeroScene").then((m) => ({ default: m.HeroScene })),
);

const EASE = [0.19, 1, 0.22, 1] as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 2.8 + i * 0.15, duration: 1, ease: EASE },
  }),
};

export function Hero() {
  return (
    <section id="top" className="relative h-[100svh] w-full overflow-hidden">
      {/* Backdrop showroom */}
      <div className="absolute inset-0">
        <img
          src={heroShowroom}
          alt=""
          width={1920}
          height={1200}
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_85%)]" />
      </div>

      {/* R3F scene */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      </div>

      {/* Floating dust overlay */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-gold/40"
            style={{
              left: `${(i * 41) % 100}%`,
              animation: `dust ${14 + (i % 8)}s linear ${i * 0.4}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Copy */}
      <div className="relative z-10 flex h-full flex-col justify-between px-6 pb-16 pt-32 md:px-16">
        <div className="flex items-start justify-between">
          <motion.p custom={0} variants={fadeUp} initial="hidden" animate="show" className="eyebrow">
            Autumn / Winter · Collection XI
          </motion.p>
          <motion.p custom={1} variants={fadeUp} initial="hidden" animate="show" className="eyebrow hidden md:block">
            Milano · London · Kyoto
          </motion.p>
        </div>

        <div className="max-w-4xl">
          <motion.h1
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="font-display text-[13vw] leading-[0.88] tracking-[-0.03em] md:text-[9vw]"
          >
            Cut from
            <br />
            <em className="not-italic text-gold-gradient">the finest hour.</em>
          </motion.h1>

          <motion.p
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            A living atelier. Every stitch, every fibre, every silhouette rendered
            in obsessive detail — then set in motion. Step into the showroom.
          </motion.p>

          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap gap-4"
          >
            <a href="#collections" data-cursor="hover" className="btn-gold">
              Enter the Showroom
            </a>
            <a href="#tailoring" data-cursor="hover" className="btn-outline-gold">
              The Craft
            </a>
          </motion.div>
        </div>

        {/* Scroll ticker */}
        <motion.div
          custom={7}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex items-end justify-between text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          <div className="flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-gold" />
            Scroll to unfold
          </div>
          <div className="hidden md:block">Est. MMXXVI · N° 001</div>
        </motion.div>
      </div>
    </section>
  );
}
