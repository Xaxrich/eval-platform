import { useState } from "react";
import { motion } from "framer-motion";
import { REGRESSION } from "../data/platform";
import { SectionHead, FadeIn, Card } from "../components/bits";
import TraceViewer from "../components/TraceViewer";

const cellUI = (c: string, onClick?: () => void) => {
  const inner = c === "pass"
    ? <span className="block w-full rounded-md bg-emerald-100 px-1 py-1.5 text-center text-[11px] font-medium text-emerald-800">pass</span>
    : c === "fail"
    ? <span className="block w-full rounded-md bg-red-100 px-1 py-1.5 text-center text-[11px] font-medium text-red-700">fail</span>
    : <span className="block w-full rounded-md bg-amber-100 px-1 py-1.5 text-center text-[11px] font-medium text-amber-800">unknown</span>;
  return onClick
    ? <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onClick} className="w-full cursor-pointer">{inner}</motion.button>
    : inner;
};

export default function Regression() {
  const [traceOpen, setTraceOpen] = useState(false);
  return (
    <div className="space-y-5">
      <FadeIn>
        <Card className="p-5">
          <SectionHead title="到家履约 · 8 故障情境 × 3 版本（24 次确定性运行）" desc="点击「写入成功但请求超时」行的 V0 / V2 单元格，回放逐步 Trace 对照" />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]" style={{ minWidth: 720 }}>
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
                  <th className="px-3 py-2 font-medium">故障情境</th>
                  {REGRESSION.versions.map(v => <th key={v.id} className="px-3 py-2 font-medium">{v.id} · {v.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {REGRESSION.scenarios.map((s, i) => (
                  <tr key={s} className="border-b border-zinc-100">
                    <td className="px-3 py-2 text-zinc-700">
                      {s}
                      {i === 1 && <span className="ml-1.5 rounded bg-zinc-900 px-1 py-0.5 text-[10px] text-white">可回放</span>}
                    </td>
                    {REGRESSION.versions.map(v => (
                      <td key={v.id} className="px-3 py-1.5">
                        {cellUI(v.cells[i], i === 1 && v.id !== "V1" ? () => setTraceOpen(true) : undefined)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-zinc-50 font-medium">
                  <td className="px-3 py-2 text-zinc-500">合计</td>
                  {REGRESSION.versions.map(v => (
                    <td key={v.id} className="px-3 py-2 tabular-nums">
                      <b>{v.pass}</b> pass / {v.fail} fail / {v.unknown} unknown
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="rounded-xl bg-zinc-900 p-5 text-white">
          <div className="text-[13px] font-semibold">回归分析的题眼</div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-zinc-300">{REGRESSION.note}</p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-3 gap-3">
        {[
          ["双向 case 清单", "回归报告必列「成功→失败」与「失败→成功」两组明细，不许只报净变化——净 +2 可能掩盖 5 升 3 降。"],
          ["unknown 单列", "人工未受理不是 Agent 失败（过程合规、外部未闭环），不计 pass 也不计 fail，单独跟踪上游 SLA。"],
          ["机制归因", "V0→V2 每步补一类不变量（查证→对象/确认/幂等/回执），通过率随不变量补齐单调上升——「判断交模型、不变量交代码」被证实。"],
        ].map(([t, s], i) => (
          <FadeIn key={t} delay={0.15 + i * 0.05}>
            <Card className="p-3.5 text-[12px] leading-relaxed text-zinc-600"><b className="text-zinc-800">{t}</b>：{s}</Card>
          </FadeIn>
        ))}
      </div>

      <TraceViewer open={traceOpen} onClose={() => setTraceOpen(false)} />
    </div>
  );
}
