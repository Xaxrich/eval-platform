import { KPI_CARDS, FUNNEL, GUARD_STATUS, DATA_GATES, ANALYSIS_0922 } from "../data/platform";
import { SectionHead, FadeIn, Card, Pill } from "../components/bits";
import { ScoreDonut } from "../components/charts";
import { ArrowRight } from "lucide-react";

export default function Overview() {
  return (
    <div className="space-y-6">
      {/* 第一屏 */}
      <section>
        <SectionHead title="第一屏 · 产品健康" desc="核心结果与门禁同屏；C 级指标在 episode 结算上线前只报测量状态，不虚构数值" />
        <div className="grid grid-cols-3 gap-3">
          {KPI_CARDS.map((k, i) => (
            <FadeIn key={k.id} delay={i * 0.05}>
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10.5px] text-zinc-400">{k.id}</span>
                  <Pill tone={k.level === "已实测" ? "green" : k.level.startsWith("C") ? "zinc" : "amber"}>{k.level}</Pill>
                </div>
                <div className="mt-1 text-[12.5px] font-medium text-zinc-600">{k.name}</div>
                <div className="mt-1.5 text-[26px] font-semibold tabular-nums tracking-tight">{k.value}</div>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{k.note}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 第二屏 漏斗 + 0922 实测速览 */}
      <div className="grid grid-cols-5 gap-3">
        <section className="col-span-3">
          <SectionHead title="第二屏 · 价值漏斗（V0 → V5）" desc="task episode 为统计单位；证据 A=业务真值 / B=行为代理" />
          <FadeIn delay={0.1}>
            <Card className="p-4">
              <div className="overflow-x-auto">
                <div className="flex items-stretch gap-1.5" style={{ minWidth: 900 }}>
                  {FUNNEL.map((f, i) => (
                    <div key={f.stage} className="flex flex-1 items-center gap-1.5">
                      <div className="flex-1 rounded-lg border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 p-2.5 transition-shadow hover:shadow-sm">
                        <div className="text-[12px] font-medium">{f.stage}</div>
                        <div className="mt-0.5 font-mono text-[10px] text-zinc-400">{f.event}</div>
                        <div className="mt-1.5"><Pill tone={f.level.startsWith("B") ? "amber" : "zinc"}>{f.level}</Pill></div>
                        <p className="mt-1.5 text-[10.5px] leading-relaxed text-zinc-500">{f.note}</p>
                      </div>
                      {i < FUNNEL.length - 1 && <ArrowRight size={12} className="shrink-0 text-zinc-300" />}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </FadeIn>
        </section>
        <section className="col-span-2">
          <SectionHead title="最新批次速览" desc="0922 千问 50 Session" />
          <FadeIn delay={0.15}>
            <Card className="flex items-center gap-2 p-4">
              <div className="w-36 shrink-0"><ScoreDonut data={ANALYSIS_0922.dist} /></div>
              <div className="min-w-0 flex-1">
                <div className="text-[26px] font-semibold tabular-nums">66%<span className="ml-1 text-[12px] font-normal text-zinc-400">±13pp</span></div>
                <div className="text-[11px] text-zinc-500">可用率（2/3 分计可用）· 准入 ≥85% 未达</div>
                <div className="mt-2 space-y-1">
                  {ANALYSIS_0922.labels.slice(0, 3).map(l => (
                    <div key={l.label} className="flex justify-between text-[11px] text-zinc-600">
                      <span>{l.label}</span><span className="tabular-nums text-zinc-400">{l.count} 条</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </FadeIn>
        </section>
      </div>

      {/* 第三屏 */}
      <section>
        <SectionHead title="第三屏 · 联合诊断" desc="完成率降+组件失败率升=工程故障；完成率降+组件全绿+分布漂移=用户结构漂移" />
        <div className="grid grid-cols-3 gap-3">
          {[
            { t: "Availability", items: ["Skill/Tool 成功率", "失败率与错误码分布", "P95 超时率"], demo: "出卡链路成功率是短板：17 条坏案 11 条挂出卡标签" },
            { t: "Cost", items: ["Token（输入/缓存/输出分列）", "平均步数与轮次", "每完成任务成本"], demo: "口径纪律：Harness 整段开销 ≠ 单条 Prompt 成本" },
            { t: "Behavioral", items: ["任务类型分布", "Skill 调用频次分布", "平均轮次"], demo: "遗忘类坏案全部出现在多轮组 → 上下文装配短板" },
          ].map((c, i) => (
            <FadeIn key={c.t} delay={0.2 + i * 0.05}>
              <Card className="p-4">
                <div className="font-mono text-[12.5px] font-semibold">{c.t}</div>
                <ul className="mt-2 space-y-1 text-[12px] text-zinc-600">{c.items.map(x => <li key={x}>· {x}</li>)}</ul>
                <div className="mt-3 rounded-md bg-zinc-50 p-2.5 text-[11px] leading-relaxed text-zinc-500">{c.demo}</div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 第四屏 */}
      <section>
        <SectionHead title="第四屏 · 质量、风险与数据可信度" desc="数据门禁先于业务解读：不可信时先宣布「不可决策」" />
        <div className="grid grid-cols-2 gap-3">
          <FadeIn delay={0.3}>
            <Card className="p-4">
              <div className="mb-2 text-[12.5px] font-semibold">硬护栏 <span className="text-[11px] font-normal text-red-500">一票否决级</span></div>
              <div className="grid grid-cols-2 gap-1.5">
                {GUARD_STATUS.map(g => (
                  <div key={g.id} className="flex items-center justify-between rounded-md border border-zinc-100 px-2.5 py-2 hover:bg-zinc-50">
                    <span className="text-[11.5px]"><span className="mr-1 font-mono text-[10px] text-zinc-400">{g.id}</span>{g.name}</span>
                    <span className="text-[10.5px] text-zinc-400">{g.state}</span>
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>
          <FadeIn delay={0.35}>
            <Card className="p-4">
              <div className="mb-2 text-[12.5px] font-semibold">数据可信度门禁</div>
              <div className="grid grid-cols-2 gap-1.5">
                {DATA_GATES.map(g => (
                  <div key={g.id} className="flex items-center justify-between rounded-md border border-zinc-100 px-2.5 py-2 hover:bg-zinc-50">
                    <span className="text-[11.5px]"><span className="mr-1 font-mono text-[10px] text-zinc-400">{g.id}</span>{g.name}</span>
                    <Pill tone={g.state.startsWith("B") ? "amber" : "zinc"}>{g.state}</Pill>
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
