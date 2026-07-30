import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PRODUCTS, formatPrice, type Product } from "../../lib/catalog";
import { useShop } from "../../lib/shop";

function ProductCard({ p, i }: { p: Product; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rxDeg = useTransform(rx, (v) => `${v}deg`);
  const ryDeg = useTransform(ry, (v) => `${v}deg`);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 12);
    rx.set(-py * 12);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, delay: i * 0.08, ease: [0.19, 1, 0.22, 1] }}
      style={{ perspective: 1200 }}
      className="group relative"
    >
      <motion.div
        style={{ rotateX: rxDeg, rotateY: ryDeg, transformStyle: "preserve-3d" }}
        className="relative aspect-[3/4] overflow-hidden bg-surface"
      >
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          width={900}
          height={1200}
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.06]"
        />
        <span className="pointer-events-none absolute left-4 top-4 h-4 w-4 border-l border-t border-gold/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="pointer-events-none absolute right-4 top-4 h-4 w-4 border-r border-t border-gold/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-4 left-4 h-4 w-4 border-b border-l border-gold/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="pointer-events-none absolute bottom-4 right-4 h-4 w-4 border-b border-r border-gold/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        <button
          type="button"
          onClick={() => toggleWishlist(p.id)}
          aria-label={isWishlisted(p.id) ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
          className="absolute right-4 top-4 rounded-full border border-gold/30 bg-background/60 p-2 backdrop-blur transition-colors hover:border-gold"
        >
          <Heart size={14} className={isWishlisted(p.id) ? "fill-gold text-gold" : "text-foreground/70"} />
        </button>

        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between">
          <div>
            <p className="eyebrow opacity-80">N° {String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 font-display text-2xl">{p.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{p.detail}</p>
          </div>
          <p className="font-mono text-sm text-gold">{formatPrice(p.price)}</p>
        </div>

        <button
          type="button"
          onClick={() => addToCart(p.id)}
          className="absolute inset-x-0 bottom-0 translate-y-full bg-gold px-6 py-3 text-center text-[10px] uppercase tracking-[0.3em] text-background transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-y-0"
        >
          Add to bag — one stitch closer
        </button>
      </motion.div>
    </motion.div>
  );
}

export function Products() {
  const featured = PRODUCTS.filter((p) => p.featured);
  return (
    <section id="tailoring" className="relative px-6 py-32 md:px-16">
      <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Collection · N° 001</p>
          <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[0.95] md:text-7xl">
            The <em className="text-gold-gradient not-italic">Essentials</em>,
            reimagined.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Every silhouette shaped by hand, then set in motion by an atelier that
          never sleeps.{" "}
          <Link to="/rooms/$roomId" params={{ roomId: "formal" }} className="text-gold hover:underline">
            Enter the rooms →
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((p, i) => (
          <ProductCard key={p.id} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}
