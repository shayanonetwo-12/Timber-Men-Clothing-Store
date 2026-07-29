import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;
    setEnabled(true);

    const ring = ringRef.current!;
    const dot = dotRef.current!;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let rx = x, ry = y;

    const onMove = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;

      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest("a, button, [data-cursor='hover'], input, textarea, select");
      setHovered(interactive);
    };

    let rafId = 0;
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) rotate(${(x - rx) * 0.6}deg)`;
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="timber-cursor" style={{
        border: `1px solid var(--gold)`,
        borderRadius: hovered ? "999px" : "1px",
        width: hovered ? 60 : 28,
        height: hovered ? 60 : 28,
        background: hovered ? "color-mix(in oklab, var(--gold) 15%, transparent)" : "transparent",
      }}>
        {/* Needle */}
        {!hovered && (
          <svg viewBox="0 0 28 28" width="28" height="28" style={{ position: "absolute", inset: 0 }}>
            <line x1="4" y1="24" x2="24" y2="4" stroke="var(--gold)" strokeWidth="1.2" />
            <circle cx="4" cy="24" r="2" fill="none" stroke="var(--gold)" strokeWidth="1" />
          </svg>
        )}
      </div>
      <div ref={dotRef} className="timber-cursor-dot" />
    </>
  );
}
