import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] } }}
        >
          {/* Wardrobe doors */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 bg-surface"
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: "-100%", transition: { duration: 0.9, ease: [0.83, 0, 0.17, 1], delay: 0.1 } }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 bg-surface"
            exit={{ x: "100%", transition: { duration: 0.9, ease: [0.83, 0, 0.17, 1], delay: 0.1 } }}
          />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold/40 to-transparent" />

          <div className="relative z-10 text-center">
            <svg viewBox="0 0 400 100" width="320" height="80" className="mx-auto">
              <defs>
                <linearGradient id="stitchGrad" x1="0" x2="1">
                  <stop offset="0" stopColor="oklch(0.86 0.1 88)" />
                  <stop offset="1" stopColor="oklch(0.6 0.13 70)" />
                </linearGradient>
              </defs>
              <motion.text
                x="200" y="70" textAnchor="middle"
                fontFamily="Cormorant Garamond, serif"
                fontSize="72" fontWeight="500"
                fill="none"
                stroke="url(#stitchGrad)"
                strokeWidth="1"
                strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.8, ease: [0.19, 1, 0.22, 1] }}
                letterSpacing="0.15em"
              >
                TIMBER
              </motion.text>
              <motion.text
                x="200" y="70" textAnchor="middle"
                fontFamily="Cormorant Garamond, serif"
                fontSize="72" fontWeight="500"
                fill="url(#stitchGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
                letterSpacing="0.15em"
              >
                TIMBER
              </motion.text>
            </svg>
            <motion.p
              className="eyebrow mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
            >
              Atelier — Est. MMXXVI
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
