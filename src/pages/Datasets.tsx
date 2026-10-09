import { useState } from "react";
import { DATASETS, DIST_ROWS } from "../data/platform";
import { SectionHead, FadeIn, Card, Pill } from "../components/bits";
import { DistBars } from "../components/charts";
import CaseBrowser from "../components/CaseBrowser";
import { ChevronRight } from "lucide-react";

export default function Datasets() {
  const [browse, setBrowse] = useState(false);
  const distChart = DIST_ROWS.map(r => ({ name: r.item.length > 6 ? r.item.slice(0, 6) + "…" : r.item, 目标: r.target, 实际: r.actual }));
  return (
    <div className="space-y-6">
      <section>
        <SectionHead title="四类资产 · 每类只回答一个问题" desc="混用资产是常见错误：拿回归集报能力、拿对抗集报体验，都会误导" />
        <div className="grid grid-cols-2 gap-3">
          {DATASETS.map((d, i) => (
            <FadeIn key={d.id} delay={i * 0.04}>
              <Card className="group p-4">
                <div className="flex items-center justify-between">
                  <Pill tone="zinc">{d.cls}</Pill>
                  <span className="font-mono text-[10.5px] text-zinc-400">{d.id} · {d.version}</span>
                </div>
                <div className="mt-1.5 text-[14px] font-medium">{d.name}</div>
                <div className="mt-1 text-[12px] text-zinc-600"><span className="text-zinc-400">回答：</span>{d.answer}</div>
                <div className="mt-0.5 text-[12px] text-zinc-600"><span className="text-zinc-400">规模：</span>{d.cases > 0 ? `${d.cases} 条` : "建设中"}</div>
                <p className="mt-2 rounded-md bg-zinc-50 p-2 text-[11px] leading-relaxed text-zinc-500">{d.note}</p>
                {d.id === "DS-E2E-50" && (
                  <button onClick={() => setBrowse(b => !b)}
                    className="mt-2 inline-flex items-center gap-1 text-[12px] font-medium text-zinc-900 hover:underline">
                    浏览 50 条用例 <ChevronRight size={13} className={`transition-transform ${browse ? "rotate-90" : ""}`} />
                  </button>
                )}
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {browse && (
        <FadeIn>
          <CaseBrowser />
        </FadeIn>
      )}

      <section>
        <SectionHead title="分布校验门禁 · 千问 50 Session v1.2" desc="目标 vs 实际；偏差超 3pp 阻止出数；取整纪律「最接近整数，偏差 ≤1pp」" />
        <div className="grid grid-cols-2 gap-3">
          <FadeIn delay={0.05}>
            <Card className="p-4"><DistBars data={distChart} />
              <p className="mt-1 text-[11px] text-zinc-500">灰 = 目标比例，蓝 = 实际比例；全部偏差 ≤1pp，校验通过</p>
            </Card>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Card className="overflow-hidden">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
                    <th className="px-3 py-2 font-medium">维度</th><th className="px-3 py-2 font-medium">档</th>
                    <th className="px-3 py-2 font-medium">目标</th><th className="px-3 py-2 font-medium">实际</th><th className="px-3 py-2 font-medium">偏差</th>
                  </tr>
                </thead>
                <tbody>
                  {DIST_ROWS.map((r, i) => (
                    <tr key={i} className="border-b border-zinc-50">
                      <td className="px-3 py-1.5 text-zinc-500">{r.dim}</td>
                      <td className="px-3 py-1.5 text-zinc-700">{r.item}</td>
                      <td className="px-3 py-1.5 tabular-nums">{r.target}%</td>
                      <td className="px-3 py-1.5 tabular-nums">{r.count} 条 / {r.actual}%</td>
                      <td className="px-3 py-1.5"><Pill tone="green">{r.dev > 0 ? `+${r.dev}` : r.dev}pp</Pill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-zinc-100 bg-zinc-50 px-3 py-2 text-[11px] text-zinc-400">
                防「V2 批次简单题变多」式假象提升：分布漂移是自我感动式提升的头号来源
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
