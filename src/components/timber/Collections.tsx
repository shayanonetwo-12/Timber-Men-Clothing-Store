import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ROOM_LIST, PRODUCTS } from "../../lib/catalog";

export function Collections() {
  return (
    <section id="collections" className="relative px-6 py-32 md:px-16">
      <div className="mx-auto mb-24 max-w-2xl text-center">
        <p className="eyebrow">The Showroom</p>
        <h2 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
          Walk between <em className="text-gold-gradient not-italic">rooms</em>.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
          Each collection lives in its own atmosphere — its own light, its own
          temperature, its own hour of the day.
        </p>
      </div>

      <div className="space-y-32">
        {ROOM_LIST.map((r, i) => {
          const count = PRODUCTS.filter((p) => p.room === r.id).length;
          return (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
              className={`grid items-center gap-12 md:grid-cols-2 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
            >
              <Link to="/rooms/$roomId" params={{ roomId: r.id }} className="group relative block aspect-[4/5] overflow-hidden">
                <motion.img
                  src={r.img}
                  alt={`${r.title} collection room`}
                  loading="lazy"
                  width={1400}
                  height={1000}
                  className="h-full w-full object-cover transition-transform duration-[1600ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105"
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.19, 1, 0.22, 1] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <span className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.35em] text-gold">
                  {r.tag}
                </span>
                <span className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.3em] text-foreground/80">
                  {count} pieces
                </span>
              </Link>
              <div className="max-w-md">
                <h3 className="font-display text-6xl md:text-8xl">
                  {r.title.split("").map((c, j) => (
                    <motion.span
                      key={j}
                      initial={{ y: 80, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.05 * j + 0.2, duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
                      className="inline-block"
                    >
                      {c}
                    </motion.span>
                  ))}
                </h3>
                <div className="gold-hairline my-6 w-24" />
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{r.body}</p>
                <Link to="/rooms/$roomId" params={{ roomId: r.id }} className="mt-8 inline-block btn-outline-gold">
                  Enter {r.title} room
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
