const WORDS = [
  "Hand-stitched",
  "Full-canvas",
  "Sartoria Italiana",
  "Cashmere",
  "Loro Piana",
  "Bespoke",
  "Made to Measure",
  "MMXXVI",
];

export function Marquee() {
  const items = [...WORDS, ...WORDS, ...WORDS];
  return (
    <div className="relative overflow-hidden border-y border-border/40 py-6">
      <div className="flex w-max animate-marquee gap-14 whitespace-nowrap">
        {items.map((w, i) => (
          <span
            key={i}
            className="flex items-center gap-14 font-display text-4xl italic tracking-tight text-foreground/40 md:text-6xl"
          >
            {w}
            <svg width="20" height="20" viewBox="0 0 20 20" className="text-gold">
              <circle cx="10" cy="10" r="2" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
