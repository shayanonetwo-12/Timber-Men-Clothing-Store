import { createFileRoute } from "@tanstack/react-router";

import { SmoothScroll } from "../components/timber/SmoothScroll";
import { LoadingScreen } from "../components/timber/LoadingScreen";
import { Navigation } from "../components/timber/Navigation";
import { Hero } from "../components/timber/Hero";
import { Marquee } from "../components/timber/Marquee";
import { Products } from "../components/timber/Products";
import { Collections } from "../components/timber/Collections";
import { Atelier } from "../components/timber/Atelier";
import { Manifesto } from "../components/timber/Manifesto";
import { Footer } from "../components/timber/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TIMBER — A Living Atelier for Luxury Menswear" },
      {
        name: "description",
        content:
          "Step into the TIMBER showroom. Interactive luxury menswear — hand-tailored garments, cinematic collections, and a wardrobe cut for the modern gentleman.",
      },
      { property: "og:title", content: "TIMBER — A Living Atelier for Luxury Menswear" },
      { property: "og:description", content: "Interactive luxury menswear. Hand-tailored, cinematic, uncompromising." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <LoadingScreen />
      
      <SmoothScroll>
        <Navigation />
        <main className="relative">
          <Hero />
          <Marquee />
          <Products />
          <Collections />
          <Atelier />
          <Manifesto />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
