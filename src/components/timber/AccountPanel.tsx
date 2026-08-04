import { motion } from "framer-motion";
import { useState } from "react";
import { Heart, LogOut, ShoppingBag, Star, X } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { useShop } from "../../lib/shop";

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.5-8 19.5-20 0-1.3-.1-2.7-.4-4z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.2 0-9.6-3-11.3-8l-6.5 5C9.6 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.2-4.1 5.6l6.2 5.2C40.9 35.6 43.5 30.5 43.5 24c0-1.3-.1-2.7-.4-4z" />
    </svg>
  );
}

export function AccountPanel() {
  const { closePanel, wishlist, favourites, cartCount, syncing } = useShop();
  const { user, displayName, signInEmail, signUpEmail, signInGoogle, signOut } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") await signInEmail(email, password);
      else await signUpEmail(email, password, name);
      setPassword("");
    } catch {
      /* toast already shown */
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setBusy(true);
    try {
      await signInGoogle();
    } catch {
      /* toast already shown */
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.aside
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col border-l border-gold/15 bg-surface"
    >
      <header className="flex items-center justify-between border-b border-gold/10 px-6 py-5">
        <p className="eyebrow text-gold">{user ? "Your wardrobe" : "The atelier account"}</p>
        <button type="button" onClick={closePanel} aria-label="Close panel" className="text-foreground/60 transition-colors hover:text-gold">
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        {user ? (
          <div className="space-y-8">
            <div>
              <p className="font-display text-3xl text-foreground">{displayName}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{user.email}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                {syncing ? "Syncing your wardrobe…" : "Your saved pieces and bag follow you across every device."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Heart, label: "Wishlist", value: wishlist.length },
                { icon: Star, label: "Favourites", value: favourites.length },
                { icon: ShoppingBag, label: "Bag", value: cartCount },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl border border-gold/15 px-3 py-4 text-center">
                  <Icon size={15} className="mx-auto text-gold" />
                  <p className="mt-2 font-mono text-lg text-foreground">{value}</p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => void signOut()}
              className="btn-outline-gold flex w-full items-center justify-center gap-2"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        ) : (
          <div className="space-y-7">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sign in to keep your wishlist, favourites and bag with you — on every device you dress from.
            </p>

            <button
              type="button"
              onClick={() => void google()}
              disabled={busy}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-gold/25 px-6 py-3 text-[11px] uppercase tracking-[0.28em] text-foreground transition-colors hover:border-gold hover:text-gold disabled:opacity-50"
            >
              <GoogleMark /> Continue with Google
            </button>

            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-gold/15" />
              <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">or</span>
              <span className="h-px flex-1 bg-gold/15" />
            </div>

            <form onSubmit={submit} className="space-y-5">
              {mode === "signup" && (
                <label className="block">
                  <span className="eyebrow">Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="mt-2 w-full border-b border-gold/20 bg-transparent pb-2 text-sm text-foreground outline-none transition-colors focus:border-gold"
                    placeholder="Your name"
                  />
                </label>
              )}
              <label className="block">
                <span className="eyebrow">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="mt-2 w-full border-b border-gold/20 bg-transparent pb-2 text-sm text-foreground outline-none transition-colors focus:border-gold"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block">
                <span className="eyebrow">Password</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  className="mt-2 w-full border-b border-gold/20 bg-transparent pb-2 text-sm text-foreground outline-none transition-colors focus:border-gold"
                  placeholder="••••••••"
                />
              </label>
              <button type="submit" disabled={busy} className="btn-gold w-full disabled:opacity-50">
                {busy ? "One moment…" : mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-gold"
            >
              {mode === "signin" ? "New here? Create an account" : "Already a client? Sign in"}
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
