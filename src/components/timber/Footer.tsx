export function Footer() {
  return (
    <footer className="relative border-t border-border/50 px-6 py-16 md:px-16">
      <div className="grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gold">
              <path d="M4 6 L20 6 M12 6 L12 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
              <circle cx="12" cy="6" r="1.5" fill="currentColor" />
            </svg>
            <span className="font-display text-2xl tracking-[0.25em]">TIMBER</span>
          </div>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            A living atelier. Menswear cut, coded, and choreographed for the
            next generation of gentlemen.
          </p>
          <form className="mt-8 flex max-w-sm items-center gap-2 border-b border-gold/40 pb-2">
            <input
              type="email"
              placeholder="your.address@atelier.com"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            />
            <button data-cursor="hover" className="text-[10px] uppercase tracking-[0.3em] text-gold">
              Enter
            </button>
          </form>
        </div>

        <div>
          <p className="eyebrow mb-6">Atelier</p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><a data-cursor="hover" className="hover:text-gold" href="#">Made to Measure</a></li>
            <li><a data-cursor="hover" className="hover:text-gold" href="#">Book a Fitting</a></li>
            <li><a data-cursor="hover" className="hover:text-gold" href="#">The Journal</a></li>
            <li><a data-cursor="hover" className="hover:text-gold" href="#">Care Guide</a></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-6">Houses</p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>Milano · Via Manzoni 14</li>
            <li>London · Savile Row 22</li>
            <li>Kyoto · Gion North</li>
            <li>New York · SoHo</li>
          </ul>
        </div>
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border/40 pt-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <p>© MMXXVI TIMBER — All rites reserved.</p>
        <p>Cut in Milano · Coded in Kyoto</p>
      </div>
    </footer>
  );
}
