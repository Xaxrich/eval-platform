import { useMemo, useState } from "react";
import { METRICS, SIDE_META, SIDES, type Metric, type MetricSide } from "../data/metrics";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

const levelColor = (lv: string) =>
  lv.startsWith("A") ? "bg-emerald-50 text-emerald-700 border-emerald-200"
  : lv.startsWith("B") ? "bg-amber-50 text-amber-700 border-amber-200"
  : "bg-zinc-100 text-zinc-500 border-zinc-200";

const sideBadge: Record<MetricSide, string> = {
  product: "bg-blue-50 text-blue-700 border-blue-200",
  tech: "bg-violet-50 text-violet-700 border-violet-200",
  guard: "bg-red-50 text-red-700 border-red-200",
  data: "bg-zinc-100 text-zinc-600 border-zinc-200",
  eval: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function Metrics() {
  const [side, setSide] = useState<MetricSide | "all">("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Metric | null>(null);

  const list = useMemo(() => METRICS.filter(m =>
    (side === "all" || m.side === side) &&
    (!q || (m.id + m.name + m.category + m.definition + m.question).toLowerCase().includes(q.toLowerCase()))
  ), [side, q]);

  const counts = useMemo(() => Object.fromEntries(SIDES.map(s => [s, METRICS.filter(m => m.side === s).length])), []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setSide("all")}
          className={`rounded-md border px-3 py-1.5 text-[12px] ${side === "all" ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"}`}>
          全部 {METRICS.length}
        </button>
        {SIDES.map(s => (
          <button key={s} onClick={() => setSide(s)}
            className={`rounded-md border px-3 py-1.5 text-[12px] ${side === s ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"}`}>
            {SIDE_META[s].label} {counts[s]}
          </button>
        ))}
        <div className="ml-auto w-64"><Input value={q} onChange={e => setQ(e.target.value)} placeholder="搜索指标 / 定义 / 决策问题…" className="h-8 text-[12px]" /></div>
      </div>

      {side !== "all" && <p className="text-[12px] text-zinc-500">{SIDE_META[side].desc}</p>}

      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
        <table className="w-full text-left text-[12px]">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
              <th className="px-3 py-2 font-medium">ID</th>
              <th className="px-3 py-2 font-medium">指标</th>
              <th className="px-3 py-2 font-medium">侧</th>
              <th className="px-3 py-2 font-medium">类型</th>
              <th className="px-3 py-2 font-medium">回答的决策问题</th>
              <th className="px-3 py-2 font-medium">口径（定义）</th>
              <th className="px-3 py-2 font-medium">窗口</th>
              <th className="px-3 py-2 font-medium">测量等级</th>
            </tr>
          </thead>
          <tbody>
            {list.map(m => (
              <tr key={m.id} onClick={() => setSel(m)} className="cursor-pointer border-b border-zinc-100 hover:bg-zinc-50">
                <td className="px-3 py-2 font-mono text-[11px] text-zinc-400">{m.id}</td>
                <td className="px-3 py-2 font-medium text-zinc-800">{m.name}</td>
                <td className="px-3 py-2"><Badge variant="outline" className={sideBadge[m.side]}>{SIDE_META[m.side].label}</Badge></td>
                <td className="px-3 py-2 text-zinc-500">{m.category}</td>
                <td className="px-3 py-2 text-zinc-600">{m.question}</td>
                <td className="max-w-72 px-3 py-2 text-zinc-600"><span className="line-clamp-2">{m.definition}</span></td>
                <td className="px-3 py-2 text-zinc-500">{m.window}</td>
                <td className="px-3 py-2"><Badge variant="outline" className={levelColor(m.measureLevel)}>{m.measureLevel}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-zinc-200 bg-zinc-50 px-3 py-2 text-[11px] text-zinc-400">
          共 {list.length} 个指标 · 点击行查看完整 18 字段定义 · 目标值统一「待基线/门槛方法」，不虚构数值
        </div>
      </div>

      {/* 指标详情抽屉 */}
      <Sheet open={!!sel} onOpenChange={() => setSel(null)}>
        <SheetContent className="w-[520px] overflow-y-auto sm:max-w-[520px]">
          {sel && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] text-zinc-400">{sel.id}</span>
                  <Badge variant="outline" className={sideBadge[sel.side]}>{SIDE_META[sel.side].label}</Badge>
                  <Badge variant="outline" className={levelColor(sel.measureLevel)}>{sel.measureLevel}</Badge>
                </div>
                <SheetTitle className="text-[17px]">{sel.name}</SheetTitle>
                <SheetDescription className="text-[13px]">{sel.question}</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-4 px-1 pb-8">
                <Block title="业务定义" body={sel.definition} />
                <div className="grid grid-cols-2 gap-3">
                  <Block title="分子 / 计算" body={sel.numerator || "—"} />
                  <Block title="分母" body={sel.denominator || "—"} />
                  <Block title="单位" body={sel.unit || "—"} />
                  <Block title="统计窗口" body={sel.window || "—"} />
                  <Block title="成熟窗口" body={sel.matureWindow || "—"} />
                  <Block title="Owner" body={sel.owner || "—"} />
                </div>
                <Block title="必拆维度" body={sel.slices || "—"} />
                <Block title="数据源 / 事件" body={sel.source || "—"} mono />
                <Block title="去重 / 关联键" body={sel.joinKey || "—"} mono />
                <Block title="解释边界（什么不能从这个指标推出来）" body={sel.boundary || "—"} warn />
                <Block title="目标 / 门槛方法" body={sel.gateMethod || "—"} />
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Block({ title, body, mono, warn }: { title: string; body: string; mono?: boolean; warn?: boolean }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-medium text-zinc-400">{title}</div>
      <div className={`rounded-md border p-2.5 text-[12.5px] leading-relaxed ${warn ? "border-amber-200 bg-amber-50 text-amber-800" : "border-zinc-200 bg-zinc-50 text-zinc-700"} ${mono ? "font-mono text-[11.5px]" : ""}`}>
        {body}
      </div>
    </div>
  );
}
