"use client";

import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/lib/LanguageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LanguageProvider>
  );
}
