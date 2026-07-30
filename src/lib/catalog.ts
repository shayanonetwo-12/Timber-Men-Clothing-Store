import blazer from "../assets/product-blazer.jpg";
import coat from "../assets/product-coat.jpg";
import boots from "../assets/product-boots.jpg";
import shirt from "../assets/product-shirt.jpg";
import waistcoat from "../assets/product-waistcoat.jpg";
import trousers from "../assets/product-trousers.jpg";
import hoodie from "../assets/product-hoodie.jpg";
import bomber from "../assets/product-bomber.jpg";
import formalRoom from "../assets/collection-formal.jpg";
import streetRoom from "../assets/collection-street.jpg";

export type RoomId = "formal" | "streetwear";

export type Product = {
  id: string;
  name: string;
  detail: string;
  price: number;
  img: string;
  room: RoomId;
  featured?: boolean;
  story: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "ombra-blazer",
    name: "Ombra Blazer",
    detail: "Super 150s wool · Milan",
    price: 1890,
    img: blazer,
    room: "formal",
    featured: true,
    story: "Full-canvas construction, hand-padded lapel, 42 hours on the bench.",
  },
  {
    id: "vello-overcoat",
    name: "Vello Overcoat",
    detail: "Baby cashmere · Piedmont",
    price: 3240,
    img: coat,
    room: "formal",
    featured: true,
    story: "Woven in Piedmont from under-fleece cashmere, brushed nine times.",
  },
  {
    id: "notte-silk-shirt",
    name: "Notte Silk Shirt",
    detail: "24mm mulberry silk",
    price: 620,
    img: shirt,
    room: "formal",
    featured: true,
    story: "Mother-of-pearl buttons, single-needle side seams, French placket.",
  },
  {
    id: "fero-boots",
    name: "Fero Boots",
    detail: "Hand-lasted calf leather",
    price: 980,
    img: boots,
    room: "streetwear",
    featured: true,
    story: "Goodyear welt, hand-burnished toe, resolable for a lifetime.",
  },
  {
    id: "sera-waistcoat",
    name: "Sera Waistcoat",
    detail: "Charcoal worsted wool",
    price: 740,
    img: waistcoat,
    room: "formal",
    story: "Cut to sit a half-inch below the belt line, back in bemberg satin.",
  },
  {
    id: "mezzanotte-trousers",
    name: "Mezzanotte Trousers",
    detail: "Satin-striped evening wool",
    price: 690,
    img: trousers,
    room: "formal",
    story: "Single reverse pleat, side adjusters, no belt loops. Evening only.",
  },
  {
    id: "bruma-hoodie",
    name: "Bruma Hoodie",
    detail: "Double-face cashmere",
    price: 1120,
    img: hoodie,
    room: "streetwear",
    story: "Boxed shoulder, dropped sleeve, cashmere heavy enough to hold shape.",
  },
  {
    id: "corvo-bomber",
    name: "Corvo Bomber",
    detail: "Matte technical shell",
    price: 1460,
    img: bomber,
    room: "streetwear",
    story: "Three-layer Japanese shell, storm-sealed seams, gold-anodised hardware.",
  },
];

export const ROOMS: Record<
  RoomId,
  { id: RoomId; tag: string; title: string; body: string; img: string }
> = {
  formal: {
    id: "formal",
    tag: "Room I",
    title: "Formal",
    body: "The boardroom. The vow. The night. Full-canvas tailoring for moments that outlive the wearer.",
    img: formalRoom,
  },
  streetwear: {
    id: "streetwear",
    tag: "Room II",
    title: "Streetwear",
    body: "Cashmere hoodies. Technical overcoats. The city softened, sharpened, and cut to move.",
    img: streetRoom,
  },
};

export const ROOM_LIST = [ROOMS.formal, ROOMS.streetwear];

export const formatPrice = (n: number) =>
  `€${n.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);

export function searchProducts(q: string) {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return PRODUCTS.filter((p) =>
    [p.name, p.detail, p.room, p.story].join(" ").toLowerCase().includes(term),
  );
}
