import { TASKS } from "../data/platform";
import { FadeIn, Card, Pill } from "../components/bits";

const modeTone: Record<string, "zinc" | "blue" | "green" | "violet"> = { "影子": "zinc", "AB": "blue", "巡检": "green", "离线回归": "violet" };
const stTone: Record<string, "green" | "amber" | "zinc"> = { "已完成": "green", "运行中": "amber", "排期中": "zinc" };

export default function Tasks() {
  return (
    <div className="space-y-4">
      <FadeIn>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] leading-relaxed text-amber-800">
          <b>出数纪律</b>：任务必须四版本绑定（Agent × 数据 × 评测集 × 裁判），缺一不许出数。
          「66%→82%」这类宣称若只有前半段有四版本证据，平台不予出数——0922 证据链断裂事故后立的平台规则。
        </div>
      </FadeIn>
      {TASKS.map((t, i) => (
        <FadeIn key={t.id} delay={i * 0.05}>
          <Card className="p-4 transition-shadow hover:shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-zinc-400">{t.id}</span>
              <Pill tone={modeTone[t.mode]}>{t.mode}</Pill>
              <Pill tone={stTone[t.status]}>{t.status}</Pill>
              <span className="text-[13.5px] font-medium">{t.name}</span>
              <span className="ml-auto text-[11px] tabular-nums text-zinc-400">{t.biz} · {t.cases} case · 重复 ×{t.repeats}</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[
                ["Agent 版本", t.agentVersion], ["数据版本", t.dataVersion],
                ["评测集版本", t.datasetVersion], ["裁判版本", t.judgeVersion],
              ].map(([k, v]) => (
                <div key={k} className="rounded-lg bg-zinc-50 px-2.5 py-2">
                  <div className="text-[10px] text-zinc-400">{k}</div>
                  <div className="mt-0.5 truncate font-mono text-[11px] text-zinc-700" title={v}>{v}</div>
                </div>
              ))}
            </div>
            {(t.result || t.gate) && (
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t border-zinc-100 pt-2.5 text-[12px]">
                {t.result && <span className="text-zinc-700"><span className="text-zinc-400">结果：</span>{t.result}</span>}
                {t.gate && <span className="text-zinc-700"><span className="text-zinc-400">门禁：</span>{t.gate}</span>}
              </div>
            )}
          </Card>
        </FadeIn>
      ))}
    </div>
  );
}
