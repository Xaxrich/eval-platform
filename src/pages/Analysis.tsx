import { ANALYSIS_0922 } from "../data/platform";
import { SectionHead, FadeIn, Card } from "../components/bits";
import { ScoreDonut, HBars } from "../components/charts";
import CaseBrowser from "../components/CaseBrowser";

export default function Analysis() {
  const d = ANALYSIS_0922;
  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="grid grid-cols-4 gap-3">
          {[
            { k: "端到端可用率", v: "66%", s: "准入 ≥85% · 未达", tone: "text-amber-600" },
            { k: "安全用例", v: "6/7", s: "私联未拒答 1 条 → 红线独立", tone: "text-red-600" },
            { k: "坏案（0/1 分）", v: "17/50", s: "P0/P1/P2 分级进坏案闭环", tone: "text-zinc-900" },
            { k: "95% 置信区间", v: "±13pp", s: "n=50 的统计诚实：报数必报区间", tone: "text-zinc-900" },
          ].map(c => (
            <Card key={c.k} className="p-4">
              <div className="text-[11px] text-zinc-400">{c.k}</div>
              <div className={`mt-1 text-[28px] font-semibold tabular-nums ${c.tone}`}>{c.v}</div>
              <div className="mt-0.5 text-[11px] text-zinc-500">{c.s}</div>
            </Card>
          ))}
        </div>
      </FadeIn>

      <div className="grid grid-cols-2 gap-3">
        <FadeIn delay={0.05}>
          <Card className="p-4">
            <div className="mb-1 text-[13px] font-semibold">分数分布</div>
            <ScoreDonut data={d.dist} />
            <div className="mt-1 grid grid-cols-4 text-center text-[11px] text-zinc-500">
              {d.dist.map(r => <div key={r.score}><b className="tabular-nums">{r.count}</b> 条 · {r.pct}%<br />{r.score}</div>)}
            </div>
            <p className="mt-2 border-t border-zinc-100 pt-2 text-[11px] text-zinc-500">
              备注曾写「1 分可用」而汇总按 2/3 分计——判分口径漂移事故，见「归因双 Loop」Rubric Loop 案例。
            </p>
          </Card>
        </FadeIn>
        <FadeIn delay={0.1}>
          <Card className="p-4">
            <div className="mb-1 text-[13px] font-semibold">坏案标签分布（17 条，可重叠）</div>
            <HBars data={d.labels.map(l => ({ name: l.label, value: l.count }))} />
            <p className="mt-2 border-t border-zinc-100 pt-2 text-[11px] leading-relaxed text-zinc-500">{d.note}</p>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.15}>
        <div className="grid grid-cols-3 gap-3">
          {[
            ["Availability", "出卡链路成功率是短板（坏案 11/17 挂出卡标签）→ 出卡策略修复为 P0 工程项"],
            ["Behavioral", "遗忘类坏案全部出现在多轮组 → 上下文装配缺陷，不是模型检索能力问题"],
            ["Cost / 口径", "本批为人评批次；机评影子批 T-EVAL-L1 正在对照计算一致率与成本"],
          ].map(([t, s]) => (
            <Card key={t} className="p-3.5">
              <div className="font-mono text-[11.5px] font-semibold text-zinc-500">{t}</div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-zinc-600">{s}</p>
            </Card>
          ))}
        </div>
      </FadeIn>

      <section>
        <SectionHead title="用例明细（50 Session）" desc="筛选 / 搜索 / 展开预期表现与标签；多轮用例按序连续执行、不得新开会话" />
        <FadeIn delay={0.2}><CaseBrowser /></FadeIn>
      </section>
    </div>
  );
}
