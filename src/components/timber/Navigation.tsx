import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, Search, Heart, Star, Menu } from "lucide-react";
import { useShop } from "../../lib/shop";

const LINKS: { label: string; hash: string }[] = [
  { label: "Collections", hash: "collections" },
  { label: "Tailoring", hash: "tailoring" },
  { label: "Journal", hash: "manifesto" },
  { label: "Atelier", hash: "atelier" },
];

export function Navigation() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openPanel, cartCount, wishlist, favourites } = useShop();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  return (
    <motion.header
      className="fixed left-1/2 top-4 z-[60] w-[min(94vw,900px)] -translate-x-1/2"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
    >
      <motion.nav
        className="glass-panel mx-auto flex items-center gap-6 px-6 py-3"
        animate={{ maxWidth: scrolled ? 560 : 900 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        style={{ borderRadius: 999 }}
      >
        <Link to="/" className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gold">
            <path d="M4 6 L20 6 M12 6 L12 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
            <circle cx="12" cy="6" r="1.5" fill="currentColor" />
          </svg>
          <span className="font-display text-xl tracking-[0.25em]">TIMBER</span>
        </Link>

        <motion.div
          className="ml-4 hidden items-center gap-6 overflow-hidden md:flex"
          animate={{ opacity: scrolled ? 0 : 1, width: scrolled ? 0 : "auto" }}
          transition={{ duration: 0.35 }}
        >
          {LINKS.map((l) => (
            <Link
              key={l.label}
              to="/"
              hash={l.hash}
              className="group relative whitespace-nowrap text-[11px] uppercase tracking-[0.28em] text-foreground/80 transition-colors hover:text-gold"
            >
              {l.label}
              <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </motion.div>

        <div className="ml-auto flex items-center gap-4 text-foreground/70">
          <button type="button" onClick={() => openPanel("search")} aria-label="Search" className="transition-colors hover:text-gold">
            <Search size={16} />
          </button>
          <button type="button" onClick={() => openPanel("wishlist")} aria-label="Wishlist" className="relative transition-colors hover:text-gold">
            <Heart size={16} className={wishlist.length ? "fill-gold text-gold" : ""} />
            {wishlist.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-background">
                {wishlist.length}
              </span>
            )}
          </button>
          <button type="button" onClick={() => openPanel("favourites")} aria-label="Favourites" className="relative transition-colors hover:text-gold">
            <Star size={16} className={favourites.length ? "fill-gold text-gold" : ""} />
            {favourites.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-background">
                {favourites.length}
              </span>
            )}
          </button>
          <button type="button" onClick={() => openPanel("cart")} aria-label="Bag" className="relative transition-colors hover:text-gold">
            <ShoppingBag size={16} />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-background">
                {cartCount}
              </span>
            )}
          </button>
          <button type="button" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu" className="transition-colors hover:text-gold md:hidden">
            <Menu size={18} />
          </button>
        </div>
      </motion.nav>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel mt-3 flex flex-col gap-4 rounded-2xl px-6 py-5 md:hidden"
        >
          {LINKS.map((l) => (
            <Link
              key={l.label}
              to="/"
              hash={l.hash}
              onClick={() => setMobileOpen(false)}
              className="text-[11px] uppercase tracking-[0.28em] text-foreground/80 hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
          <Link to="/rooms/$roomId" params={{ roomId: "formal" }} onClick={() => setMobileOpen(false)} className="text-[11px] uppercase tracking-[0.28em] text-gold">
            Formal room
          </Link>
          <Link to="/rooms/$roomId" params={{ roomId: "streetwear" }} onClick={() => setMobileOpen(false)} className="text-[11px] uppercase tracking-[0.28em] text-gold">
            Streetwear room
          </Link>
        </motion.div>
      )}
    </motion.header>
  );
}
