import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CASES_0922 } from "../data/cases";
import { Pill } from "./bits";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

type CaseRow = (typeof CASES_0922)[number];

const scoreTone = (s: number | null) => s === null ? "zinc" : s === 3 ? "green" : s === 2 ? "blue" : s === 1 ? "amber" : "red";
const shortLabel = (l: string) => l.includes("_") ? l.split("_")[1] : l;

export default function CaseBrowser() {
  const [fScore, setFScore] = useState<string>("all");
  const [fDim, setFDim] = useState<string>("all");
  const [fTurns, setFTurns] = useState<string>("all");
  const [fLabel, setFLabel] = useState<string>("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const labels = useMemo(() => [...new Set(CASES_0922.flatMap(c => c.labels as string[]))], []);
  const list = useMemo(() => CASES_0922.filter(c =>
    (fScore === "all" || c.score === +fScore) &&
    (fDim === "all" || c.difficulty === fDim) &&
    (fTurns === "all" || c.turns === fTurns) &&
    (fLabel === "all" || (c.labels as string[]).includes(fLabel)) &&
    (!q || c.query.includes(q) || c.capability.includes(q))
  ), [fScore, fDim, fTurns, fLabel, q]);

  const Sel = ({ v, set, opts, ph }: { v: string; set: (x: string) => void; opts: string[]; ph: string }) => (
    <select value={v} onChange={e => set(e.target.value)}
      className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-[12px] text-zinc-700 outline-none focus:border-zinc-400">
      <option value="all">{ph}</option>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-100 px-4 py-3">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="搜索 query / 能力点…"
            className="h-8 w-56 rounded-md border border-zinc-200 bg-white pl-7 pr-2 text-[12px] outline-none focus:border-zinc-400" />
        </div>
        <Sel v={fScore} set={setFScore} opts={["3", "2", "1", "0"]} ph="全部分数" />
        <Sel v={fDim} set={setFDim} opts={["L1", "L2", "L3"]} ph="全部难度" />
        <Sel v={fTurns} set={setFTurns} opts={["单轮", "多轮"]} ph="全部轮次" />
        <Sel v={fLabel} set={setFLabel} opts={labels} ph="全部标签" />
        <span className="ml-auto text-[11px] tabular-nums text-zinc-400">{list.length} / 50 条</span>
      </div>
      <div className="max-h-[460px] overflow-y-auto">
        {list.map((c: CaseRow, i: number) => (
          <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.015, 0.3) }}>
            <button onClick={() => setOpenId(openId === c.id ? null : c.id)}
              className="flex w-full items-center gap-3 border-b border-zinc-50 px-4 py-2.5 text-left hover:bg-zinc-50">
              {openId === c.id ? <ChevronDown size={13} className="shrink-0 text-zinc-400" /> : <ChevronRight size={13} className="shrink-0 text-zinc-400" />}
              <span className="w-7 shrink-0 font-mono text-[11px] text-zinc-400">#{c.id}</span>
              <span className="w-10 shrink-0 text-[11px] text-zinc-500">{c.biz}</span>
              <span className="w-8 shrink-0 font-mono text-[11px] text-zinc-500">{c.difficulty}</span>
              <span className="w-10 shrink-0 text-[11px] text-zinc-500">{c.turns}</span>
              <span className="min-w-0 flex-1 truncate text-[12.5px] text-zinc-800">{c.query.replace(/\n/g, " / ")}</span>
              {c.safety && <Pill tone="red">安全</Pill>}
              {(c.labels as string[]).slice(0, 1).map(l => <Pill key={l} tone="amber">{shortLabel(l)}</Pill>)}
              <Pill tone={scoreTone(c.score) as never}>{c.score === null ? "未评" : `${c.score} 分`}</Pill>
            </button>
            {openId === c.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="overflow-hidden border-b border-zinc-100 bg-zinc-50/60">
                <div className="space-y-2 px-12 py-3 text-[12px] leading-relaxed">
                  <div><span className="text-zinc-400">query 全文：</span><span className="text-zinc-700 whitespace-pre-wrap">{c.query}</span></div>
                  {(c.labels as string[]).length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5"><span className="text-zinc-400">问题标签：</span>
                      {(c.labels as string[]).map(l => <Pill key={l} tone="amber">{shortLabel(l)}</Pill>)}</div>
                  )}
                  {c.note && <div><span className="text-zinc-400">标注备注（原文）：</span><span className="text-zinc-700">{c.note.replace(/^标注备注：\s*/, "")}</span></div>}
                  <div className="text-[11px] text-zinc-400">标注人 {c.annotator || "—"} · 质检 {c.qc || "—"}</div>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
        {list.length === 0 && <div className="px-4 py-10 text-center text-[12px] text-zinc-400">无匹配用例</div>}
      </div>
      <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-2 text-[11px] text-zinc-400">
        全部为 0922 真实评测工作簿逐行记录（query/打分/标签/标注备注/标注质检人）；3 条原始未评分如实显示「未评」
      </div>
    </div>
  );
}
