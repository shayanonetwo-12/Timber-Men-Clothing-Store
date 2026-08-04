import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "./firebase";

export type CartLine = { id: string; qty: number };

export type Wardrobe = {
  cart: CartLine[];
  wishlist: string[];
  favourites: string[];
};

export const EMPTY_WARDROBE: Wardrobe = { cart: [], wishlist: [], favourites: [] };

function wardrobeDoc(uid: string) {
  return doc(getFirebaseDb(), "wardrobes", uid);
}

export async function fetchWardrobe(uid: string): Promise<Wardrobe | null> {
  const snap = await getDoc(wardrobeDoc(uid));
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<Wardrobe>;
  return {
    cart: Array.isArray(data.cart) ? data.cart.filter((l) => l && typeof l.id === "string") : [],
    wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
    favourites: Array.isArray(data.favourites) ? data.favourites : [],
  };
}

export async function saveWardrobe(uid: string, wardrobe: Wardrobe): Promise<void> {
  await setDoc(wardrobeDoc(uid), { ...wardrobe, updatedAt: Date.now() }, { merge: true });
}

/** Union of saved pieces; for the bag we keep the larger quantity per line. */
export function mergeWardrobes(local: Wardrobe, remote: Wardrobe): Wardrobe {
  const cart = new Map<string, number>();
  for (const line of [...remote.cart, ...local.cart]) {
    cart.set(line.id, Math.max(cart.get(line.id) ?? 0, line.qty));
  }
  return {
    cart: [...cart].map(([id, qty]) => ({ id, qty })),
    wishlist: [...new Set([...remote.wishlist, ...local.wishlist])],
    favourites: [...new Set([...remote.favourites, ...local.favourites])],
  };
}
