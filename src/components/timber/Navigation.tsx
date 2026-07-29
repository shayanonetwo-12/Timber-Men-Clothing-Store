import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { ShoppingBag, Search, Heart, Menu } from "lucide-react";

const LINKS = ["Collections", "Tailoring", "Journal", "Atelier"];

export function Navigation() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.header
      className="fixed left-1/2 top-4 z-50 -translate-x-1/2"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.6, duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
    >
      <motion.nav
        className="glass-panel flex items-center gap-6 px-6 py-3"
        animate={{
          width: scrolled ? 520 : 880,
          paddingLeft: scrolled ? 20 : 28,
          paddingRight: scrolled ? 20 : 28,
        }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        style={{ borderRadius: 999 }}
      >
        <a href="#top" data-cursor="hover" className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gold">
            <path d="M4 6 L20 6 M12 6 L12 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
            <circle cx="12" cy="6" r="1.5" fill="currentColor" />
          </svg>
          <span className="font-display text-xl tracking-[0.25em]">TIMBER</span>
        </a>

        <motion.div
          className="ml-4 flex items-center gap-6 overflow-hidden"
          animate={{ opacity: scrolled ? 0 : 1, width: scrolled ? 0 : "auto" }}
          transition={{ duration: 0.35 }}
        >
          {LINKS.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              data-cursor="hover"
              className="group relative whitespace-nowrap text-[11px] uppercase tracking-[0.28em] text-foreground/80 transition-colors hover:text-gold"
            >
              {l}
              <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </a>
          ))}
        </motion.div>

        <div className="ml-auto flex items-center gap-4 text-foreground/70">
          <button data-cursor="hover" aria-label="Search" className="transition-colors hover:text-gold">
            <Search size={16} />
          </button>
          <button data-cursor="hover" aria-label="Wishlist" className="transition-colors hover:text-gold">
            <Heart size={16} />
          </button>
          <button data-cursor="hover" aria-label="Bag" className="relative transition-colors hover:text-gold">
            <ShoppingBag size={16} />
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-background">
              2
            </span>
          </button>
          <button data-cursor="hover" aria-label="Menu" className="md:hidden">
            <Menu size={18} />
          </button>
        </div>
      </motion.nav>
    </motion.header>
  );
}
