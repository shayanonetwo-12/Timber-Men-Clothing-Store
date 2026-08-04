import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ShopProvider } from "../lib/shop";
import { ShopOverlays } from "../components/timber/ShopOverlays";
import { Concierge } from "../components/timber/Concierge";
import { Toaster } from "../components/ui/sonner";
import { initFirebaseAnalytics } from "../lib/firebase";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404 — Off the rack</p>
        <h1 className="mt-6 text-6xl font-display text-foreground">Lost the thread.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The piece you're looking for has been retired from the collection.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn-outline-gold">Return to atelier</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Stitch dropped</p>
        <h1 className="mt-6 text-4xl font-display">Something unravelled.</h1>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-gold">
            Try again
          </button>
          <a href="/" className="btn-outline-gold">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TIMBER — Luxury Menswear, Reimagined" },
      { name: "description", content: "TIMBER 2.0 is an interactive luxury showroom for premium menswear. Tailored garments, cinematic craft, and a wardrobe that moves with you." },
      { name: "author", content: "TIMBER" },
      { name: "theme-color", content: "#0d0d0d" },
      { property: "og:title", content: "TIMBER — Luxury Menswear, Reimagined" },
      { property: "og:description", content: "An interactive luxury showroom for the modern gentleman. Tailored, cinematic, uncompromising." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    void initFirebaseAnalytics();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ShopProvider>

        <Outlet />
        <ShopOverlays />
        <Concierge />
        <Toaster position="bottom-left" />
      </ShopProvider>
    </QueryClientProvider>
  );
}
