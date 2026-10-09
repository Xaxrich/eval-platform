import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WRITE_TIMEOUT_TRACE } from "../data/traces";
import { Pill } from "./bits";
import { X, User, Wrench, MessageSquare, AlertTriangle } from "lucide-react";

function StepIcon({ kind, bad }: { kind: string; bad?: boolean }) {
  if (bad) return <AlertTriangle size={14} className="text-red-500" />;
  if (kind === "user") return <User size={14} className="text-blue-600" />;
  if (kind === "tool") return <Wrench size={14} className="text-zinc-500" />;
  return <MessageSquare size={14} className="text-emerald-600" />;
}

export default function TraceViewer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [ver, setVer] = useState(0);
  const v = WRITE_TIMEOUT_TRACE[ver];
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.97, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[84vh] w-[720px] overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-zinc-200 px-5 py-3.5">
              <div>
                <div className="text-[14px] font-semibold">Trace 回放 · 写入成功但请求超时</div>
                <div className="text-[11px] text-zinc-500">同一用户请求，两个版本的轨迹对照 —— 最后一句话相同，证据链完全不同</div>
              </div>
              <div className="ml-auto flex rounded-md border border-zinc-200 p-0.5">
                {WRITE_TIMEOUT_TRACE.map((t, i) => (
                  <button key={t.id} onClick={() => setVer(i)}
                    className={`rounded px-2.5 py-1 text-[12px] ${i === ver ? "bg-zinc-900 text-white" : "text-zinc-500 hover:bg-zinc-100"}`}>
                    {t.id}
                  </button>
                ))}
              </div>
              <button onClick={onClose} className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100"><X size={16} /></button>
            </div>
            <div className="max-h-[calc(84vh-110px)] overflow-y-auto px-5 py-4">
              <div className={`mb-3 rounded-lg border px-3 py-2 text-[12px] ${v.id === "V0" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
                {v.id} · {v.name}　——　判定：{v.verdict}
              </div>
              <div className="space-y-0">
                {v.steps.map((s, i) => (
                  <motion.div key={s.n} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="relative flex gap-3 pb-4">
                    {i < v.steps.length - 1 && <div className="absolute left-[7px] top-5 h-full w-px bg-zinc-200" />}
                    <div className={`z-10 mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${s.bad ? "bg-red-50" : "bg-zinc-100"}`}>
                      <StepIcon kind={s.kind} bad={s.bad} />
                    </div>
                    <div className="flex-1">
                      {s.kind === "user" && <div className="inline-block rounded-lg rounded-tl-none bg-blue-50 px-3 py-2 text-[12.5px] text-blue-900">{s.text}</div>}
                      {s.kind === "reply" && <div className={`inline-block rounded-lg rounded-tl-none px-3 py-2 text-[12.5px] ${s.bad ? "bg-red-50 text-red-900" : "bg-emerald-50 text-emerald-900"}`}>{s.text}</div>}
                      {s.kind === "tool" && (
                        <div className={`rounded-lg border px-3 py-2 ${s.bad ? "border-red-200 bg-red-50/40" : "border-zinc-200 bg-zinc-50"}`}>
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-[12px] font-medium text-zinc-800">{s.action}</code>
                            <span className="text-[11px] text-zinc-400">{s.args}</span>
                          </div>
                          <div className={`mt-1 font-mono text-[11.5px] ${s.bad ? "text-red-600" : "text-emerald-700"}`}>{s.result}</div>
                        </div>
                      )}
                      {s.note && <div className={`mt-1 text-[11px] leading-relaxed ${s.bad ? "text-red-500" : "text-zinc-500"}`}>{s.bad ? "✗ " : "✓ "}{s.note}</div>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 border-t border-zinc-200 bg-zinc-50 px-5 py-2.5 text-[11px] text-zinc-500">
              <Pill tone="red">V0 违例：写入唯一 / 未知查证 / 承诺证据</Pill>
              <Pill tone="green">V2 通过：对象一致 / 确认有效 / 幂等 / 回执</Pill>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
