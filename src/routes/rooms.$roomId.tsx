import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingBag, Star } from "lucide-react";
import { Navigation } from "../components/timber/Navigation";
import { Footer } from "../components/timber/Footer";
import { PRODUCTS, ROOMS, formatPrice, type RoomId } from "../lib/catalog";
import { useShop } from "../lib/shop";

export const Route = createFileRoute("/rooms/$roomId")({
  loader: ({ params }) => {
    const room = ROOMS[params.roomId as RoomId];
    if (!room) throw notFound();
    return { room };
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.room.title} Room — TIMBER` : "Room — TIMBER";
    const description = loaderData
      ? `${loaderData.room.body} Explore the TIMBER ${loaderData.room.title} collection.`
      : "Explore the TIMBER collection rooms.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: RoomPage,
});

function RoomPage() {
  const { room } = Route.useLoaderData();
  const { addToCart, toggleWishlist, isWishlisted, toggleFavourite, isFavourite } = useShop();
  const items = PRODUCTS.filter((p) => p.room === room.id);

  return (
    <>
      <Navigation />
      <main className="relative">
        <section className="relative h-[70vh] w-full overflow-hidden">
          <img
            src={room.img}
            alt={`${room.title} collection room`}
            width={1400}
            height={1000}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/70" />
          <div className="absolute inset-x-0 bottom-16 px-6 md:px-16">
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-gold">
              <ArrowLeft size={14} /> Back to showroom
            </Link>
            <p className="eyebrow text-gold">{room.tag}</p>
            <h1 className="mt-3 font-display text-6xl leading-[0.9] md:text-8xl">{room.title}</h1>
            <p className="mt-6 max-w-lg text-sm text-muted-foreground md:text-base">{room.body}</p>
          </div>
        </section>

        <section className="px-6 py-24 md:px-16">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-display text-3xl md:text-4xl">
              {items.length} pieces in this room
            </h2>
            <Link
              to="/rooms/$roomId"
              params={{ roomId: room.id === "formal" ? "streetwear" : "formal" }}
              className="btn-outline-gold"
            >
              Next room
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                whileHover={{ y: -8 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    width={900}
                    height={1200}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute right-4 top-4 flex flex-col gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.12 }}
                      type="button"
                      onClick={() => toggleWishlist(p.id)}
                      aria-label={isWishlisted(p.id) ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
                      className="rounded-full border border-gold/30 bg-background/60 p-2 backdrop-blur transition-colors hover:border-gold"
                    >
                      <Heart size={15} className={isWishlisted(p.id) ? "fill-gold text-gold" : "text-foreground/70"} />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      whileHover={{ scale: 1.12 }}
                      type="button"
                      onClick={() => toggleFavourite(p.id)}
                      aria-label={isFavourite(p.id) ? `Remove ${p.name} from favourites` : `Add ${p.name} to favourites`}
                      className="rounded-full border border-gold/30 bg-background/60 p-2 backdrop-blur transition-colors hover:border-gold"
                    >
                      <Star size={15} className={isFavourite(p.id) ? "fill-gold text-gold" : "text-foreground/70"} />
                    </motion.button>
                  </div>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl">{p.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{p.detail}</p>
                    <p className="mt-3 max-w-xs text-xs leading-relaxed text-muted-foreground/80">{p.story}</p>
                  </div>
                  <p className="font-mono text-sm text-gold">{formatPrice(p.price)}</p>
                </div>
                <button type="button" onClick={() => addToCart(p.id)} className="btn-gold mt-5 inline-flex items-center gap-2">
                  <ShoppingBag size={14} /> Add to bag
                </button>
              </motion.article>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
