import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { PRODUCTS, productById, type Product } from "./catalog";
import { useAuth } from "./auth";
import { EMPTY_WARDROBE, fetchWardrobe, mergeWardrobes, saveWardrobe } from "./wardrobe";

export type CartLine = { id: string; qty: number };
export type PanelId = "search" | "wishlist" | "favourites" | "cart" | "account" | null;


type ShopContextValue = {
  cart: CartLine[];
  wishlist: string[];
  favourites: string[];
  cartCount: number;
  cartTotal: number;
  panel: PanelId;
  syncing: boolean;

  openPanel: (p: Exclude<PanelId, null>) => void;
  closePanel: () => void;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  toggleFavourite: (id: string) => void;
  isFavourite: (id: string) => boolean;
  favouriteProducts: Product[];
  cartProducts: { product: Product; qty: number }[];
  wishlistProducts: Product[];
};

const ShopContext = createContext<ShopContextValue | null>(null);

const CART_KEY = "timber.cart";
const WISH_KEY = "timber.wishlist";
const FAV_KEY = "timber.favourites";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [panel, setPanel] = useState<PanelId>(null);
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const syncedUid = useRef<string | null>(null);

  useEffect(() => {
    setCart(read<CartLine[]>(CART_KEY, []));
    setWishlist(read<string[]>(WISH_KEY, []));
    setFavourites(read<string[]>(FAV_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(FAV_KEY, JSON.stringify(favourites));
  }, [favourites, hydrated]);

  // On sign-in: pull the cloud wardrobe and merge it with what's on this device.
  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      syncedUid.current = null;
      return;
    }
    if (syncedUid.current === user.uid) return;
    let cancelled = false;
    setSyncing(true);
    (async () => {
      try {
        const remote = (await fetchWardrobe(user.uid)) ?? EMPTY_WARDROBE;
        if (cancelled) return;
        const merged = mergeWardrobes({ cart, wishlist, favourites }, remote);
        setCart(merged.cart);
        setWishlist(merged.wishlist);
        setFavourites(merged.favourites);
        syncedUid.current = user.uid;
        await saveWardrobe(user.uid, merged);
      } catch (err) {
        console.error("wardrobe sync failed", err);
        toast.error("Couldn't reach your cloud wardrobe just now.");
      } finally {
        if (!cancelled) setSyncing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, hydrated]);

  // Push local changes up once the initial merge for this account is done.
  useEffect(() => {
    if (!hydrated || !user || syncedUid.current !== user.uid) return;
    const t = setTimeout(() => {
      void saveWardrobe(user.uid, { cart, wishlist, favourites }).catch((err) =>
        console.error("wardrobe save failed", err),
      );
    }, 600);
    return () => clearTimeout(t);
  }, [cart, wishlist, favourites, user, hydrated]);


  const addToCart = useCallback((id: string, qty = 1) => {
    const p = productById(id);
    if (!p) return;
    setCart((prev) => {
      const found = prev.find((l) => l.id === id);
      return found
        ? prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l))
        : [...prev, { id, qty }];
    });
    toast.success(`${p.name} added to your bag`);
    setPanel("cart");
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.id !== id) : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleWishlist = useCallback((id: string) => {
    const p = productById(id);
    setWishlist((prev) => {
      const has = prev.includes(id);
      if (p) toast(has ? `${p.name} removed from wishlist` : `${p.name} saved to wishlist`);
      return has ? prev.filter((w) => w !== id) : [...prev, id];
    });
  }, []);

  const toggleFavourite = useCallback((id: string) => {
    const p = productById(id);
    setFavourites((prev) => {
      const has = prev.includes(id);
      if (p) toast(has ? `${p.name} removed from favourites` : `${p.name} added to favourites`);
      return has ? prev.filter((f) => f !== id) : [...prev, id];
    });
  }, []);

  const value = useMemo<ShopContextValue>(() => {
    const cartProducts = cart
      .map((l) => ({ product: PRODUCTS.find((p) => p.id === l.id)!, qty: l.qty }))
      .filter((l) => Boolean(l.product));
    return {
      cart,
      wishlist,
      favourites,
      panel,
      syncing,

      cartCount: cart.reduce((s, l) => s + l.qty, 0),
      cartTotal: cartProducts.reduce((s, l) => s + l.product.price * l.qty, 0),
      openPanel: (p) => setPanel(p),
      closePanel: () => setPanel(null),
      addToCart,
      setQty,
      removeFromCart,
      toggleWishlist,
      isWishlisted: (id: string) => wishlist.includes(id),
      toggleFavourite,
      isFavourite: (id: string) => favourites.includes(id),
      favouriteProducts: favourites
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
      cartProducts,
      wishlistProducts: wishlist
        .map((id) => PRODUCTS.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
    };
  }, [cart, wishlist, favourites, panel, syncing, addToCart, setQty, removeFromCart, toggleWishlist, toggleFavourite]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
