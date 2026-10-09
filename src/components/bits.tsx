import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHead({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-2 flex items-baseline gap-2">
      <h2 className="text-[14px] font-semibold">{title}</h2>
      {desc && <span className="text-[12px] text-zinc-500">{desc}</span>}
    </div>
  );
}

export function FadeIn({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export const levelColor = (lv: string) =>
  lv.startsWith("A") || lv === "已实测" ? "bg-emerald-50 text-emerald-700 border-emerald-200"
  : lv.startsWith("B") || lv === "估算" || lv === "试点中" ? "bg-amber-50 text-amber-700 border-amber-200"
  : "bg-zinc-100 text-zinc-500 border-zinc-200";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-zinc-200 bg-white ${className}`}>{children}</div>;
}

export function Pill({ children, tone = "zinc" }: { children: ReactNode; tone?: "zinc" | "green" | "amber" | "red" | "blue" | "violet" }) {
  const map = {
    zinc: "bg-zinc-100 text-zinc-600 border-zinc-200", green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200", red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200", violet: "bg-violet-50 text-violet-700 border-violet-200",
  };
  return <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${map[tone]}`}>{children}</span>;
}
