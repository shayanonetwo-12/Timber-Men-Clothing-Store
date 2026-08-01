import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Minus, Plus, Search, ShoppingBag, Star, X } from "lucide-react";
import { formatPrice, searchProducts, ROOMS } from "../../lib/catalog";
import { useShop } from "../../lib/shop";

function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className="fixed inset-0 z-[90] bg-background/80 backdrop-blur-sm"
    />
  );
}

function Panel({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col border-l border-gold/15 bg-surface"
    >
      <header className="flex items-center justify-between border-b border-gold/10 px-6 py-5">
        <p className="eyebrow text-gold">{title}</p>
        <button type="button" onClick={onClose} aria-label="Close panel" className="text-foreground/60 transition-colors hover:text-gold">
          <X size={18} />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
    </motion.aside>
  );
}

function SearchOverlay() {
  const { closePanel, addToCart, toggleWishlist, isWishlisted, toggleFavourite, isFavourite } = useShop();
  const [q, setQ] = useState("");
  const results = searchProducts(q);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePanel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className="fixed inset-x-0 top-0 z-[95] max-h-[85vh] overflow-y-auto border-b border-gold/15 bg-surface px-6 py-10 md:px-16"
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-4 border-b border-gold/20 pb-4">
          <Search size={18} className="text-gold" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search garments, fabrics, rooms…"
            aria-label="Search the collection"
            className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-muted-foreground/50 md:text-3xl"
          />
          <button type="button" onClick={closePanel} aria-label="Close search" className="text-foreground/60 hover:text-gold">
            <X size={20} />
          </button>
        </div>

        {!q && (
          <div className="mt-8 flex flex-wrap gap-3">
            {["cashmere", "silk", "boots", "evening", "streetwear"].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQ(s)}
                className="border border-gold/25 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {q && results.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">Nothing in the archive matches “{q}”.</p>
        )}

        <div className="mt-8 space-y-4">
          {results.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
              className="flex items-center gap-5 border border-gold/10 p-3 transition-colors hover:border-gold/40"
            >
              <img src={p.img} alt={p.name} loading="lazy" width={900} height={1200} className="h-24 w-20 object-cover" />
              <div className="flex-1">
                <h3 className="font-display text-xl">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{p.detail}</p>
                <Link
                  to="/rooms/$roomId"
                  params={{ roomId: p.room }}
                  onClick={closePanel}
                  className="mt-2 inline-block text-[10px] uppercase tracking-[0.25em] text-gold"
                >
                  {ROOMS[p.room].title} room →
                </Link>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-mono text-sm text-gold">{formatPrice(p.price)}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => toggleWishlist(p.id)} aria-label={`Save ${p.name}`} className="border border-gold/25 p-2 hover:border-gold">
                    <Heart size={13} className={isWishlisted(p.id) ? "fill-gold text-gold" : ""} />
                  </button>
                  <button type="button" onClick={() => toggleFavourite(p.id)} aria-label={`Favourite ${p.name}`} className="border border-gold/25 p-2 hover:border-gold">
                    <Star size={13} className={isFavourite(p.id) ? "fill-gold text-gold" : ""} />
                  </button>
                  <button type="button" onClick={() => addToCart(p.id)} aria-label={`Add ${p.name} to bag`} className="border border-gold/25 p-2 hover:border-gold">
                    <ShoppingBag size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function WishlistPanel() {
  const { closePanel, wishlistProducts, toggleWishlist, addToCart } = useShop();
  return (
    <Panel title="Wishlist" onClose={closePanel}>
      {wishlistProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing saved yet. Tap the heart on any piece to keep it here.
        </p>
      ) : (
        <div className="space-y-5">
          {wishlistProducts.map((p) => (
            <div key={p.id} className="flex gap-4">
              <img src={p.img} alt={p.name} loading="lazy" width={900} height={1200} className="h-28 w-22 w-[5.5rem] object-cover" />
              <div className="flex-1">
                <h3 className="font-display text-xl">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{p.detail}</p>
                <p className="mt-1 font-mono text-sm text-gold">{formatPrice(p.price)}</p>
                <div className="mt-3 flex gap-3">
                  <button type="button" onClick={() => addToCart(p.id)} className="text-[10px] uppercase tracking-[0.25em] text-gold hover:underline">
                    Add to bag
                  </button>
                  <button type="button" onClick={() => toggleWishlist(p.id)} className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function FavouritesPanel() {
  const { closePanel, favouriteProducts, toggleFavourite, addToCart } = useShop();
  return (
    <Panel title="Favourites" onClose={closePanel}>
      {favouriteProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No favourites yet. Tap the star on any article to pin it here.
        </p>
      ) : (
        <div className="space-y-5">
          {favouriteProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="flex gap-4"
            >
              <img src={p.img} alt={p.name} loading="lazy" width={900} height={1200} className="h-28 w-[5.5rem] object-cover" />
              <div className="flex-1">
                <h3 className="font-display text-xl">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{p.detail}</p>
                <p className="mt-1 font-mono text-sm text-gold">{formatPrice(p.price)}</p>
                <div className="mt-3 flex gap-3">
                  <button type="button" onClick={() => addToCart(p.id)} className="text-[10px] uppercase tracking-[0.25em] text-gold hover:underline">
                    Add to bag
                  </button>
                  <button type="button" onClick={() => toggleFavourite(p.id)} className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function CartPanel() {
  const { closePanel, cartProducts, cartTotal, setQty, removeFromCart } = useShop();
  return (
    <Panel title="Your bag" onClose={closePanel}>
      {cartProducts.length === 0 ? (
        <p className="text-sm text-muted-foreground">Your bag is empty — the atelier awaits.</p>
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-6">
            {cartProducts.map(({ product: p, qty }) => (
              <div key={p.id} className="flex gap-4">
                <img src={p.img} alt={p.name} loading="lazy" width={900} height={1200} className="h-28 w-[5.5rem] object-cover" />
                <div className="flex-1">
                  <h3 className="font-display text-xl">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.detail}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <button type="button" onClick={() => setQty(p.id, qty - 1)} aria-label="Decrease quantity" className="border border-gold/25 p-1 hover:border-gold">
                      <Minus size={12} />
                    </button>
                    <span className="font-mono text-sm">{qty}</span>
                    <button type="button" onClick={() => setQty(p.id, qty + 1)} aria-label="Increase quantity" className="border border-gold/25 p-1 hover:border-gold">
                      <Plus size={12} />
                    </button>
                    <button type="button" onClick={() => removeFromCart(p.id)} className="ml-auto text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground">
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-mono text-sm text-gold">{formatPrice(p.price * qty)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-gold/15 pt-6">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Subtotal</span>
              <span className="font-mono text-lg text-gold">{formatPrice(cartTotal)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Complimentary tailoring & worldwide delivery.</p>
            <button type="button" className="btn-gold mt-6 w-full">Proceed to checkout</button>
          </div>
        </div>
      )}
    </Panel>
  );
}

export function ShopOverlays() {
  const { panel, closePanel } = useShop();
  return (
    <AnimatePresence>
      {panel && (
        <>
          <Backdrop key="backdrop" onClick={closePanel} />
          {panel === "search" && <SearchOverlay key="search" />}
          {panel === "wishlist" && <WishlistPanel key="wishlist" />}
          {panel === "favourites" && <FavouritesPanel key="favourites" />}
          {panel === "cart" && <CartPanel key="cart" />}
        </>
      )}
    </AnimatePresence>
  );
}
