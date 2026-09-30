"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

function Counter({ target }: { target: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || reducedMotion) return;

    const duration = 1600; // ms
    let start: number | null = null;
    let frame: number;

    const tick = (now: number) => {
      if (start === null) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cúbico
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, reducedMotion]);

  const display = reducedMotion ? target : value;

  return (
    <span ref={ref} aria-label={String(target)}>
      {display}
    </span>
  );
}

export function Magnitude() {
  const { t } = useLanguage();

  return (
    <section className="bg-paper-alt px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-serif text-2xl font-light text-ink sm:text-3xl"
        >
          {t.magnitude.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "0px 0px -20% 0px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-12 font-serif text-7xl font-medium tabular-nums text-moss sm:text-8xl"
        >
          <Counter target={t.magnitude.counterValue} />
        </motion.p>

        <p className="mt-2 font-sans text-sm uppercase tracking-[0.25em] text-ink-soft">
          {t.magnitude.counterSuffix}
        </p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -15% 0px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mx-auto mt-12 max-w-lectura font-sans text-base leading-relaxed text-ink-soft"
        >
          {t.magnitude.body}
        </motion.p>
      </div>
    </section>
  );
}
