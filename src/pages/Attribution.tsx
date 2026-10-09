import { BADCASES } from "../data/platform";
import { FadeIn, Card, Pill } from "../components/bits";
import { Wrench, Scale } from "lucide-react";

export default function Attribution() {
  const lanes = [
    { key: "Agent Loop", title: "Agent Loop · 修系统", icon: Wrench, tone: "blue" as const, desc: "修 Prompt / Skill / 路由 / 上下文 → 同一评测集回测 → 上线" },
    { key: "Rubric Loop", title: "Rubric Loop · 校裁判", icon: Scale, tone: "amber" as const, desc: "先校验裁判判得对不对 → 判错则迭代 Rubric 入库 → 重测受影响批次" },
  ];
  return (
    <div className="space-y-5">
      <FadeIn>
        <Card className="p-4">
          <div className="text-[13px] font-semibold">归因双路径（防 reward hacking 的结构性机制）</div>
          <p className="mt-2 text-[12px] leading-relaxed text-zinc-600">
            Bad case 沿 Trace 做组件级归因（意图 / 检索 / 生成 / 卡片 / 工具 / 数据），结论带证据指针（trace span + 业务单据号），随后分叉两路。
            只修 Agent 不校 Rubric，系统会被优化成「迎合评测分布」而非「解决用户问题」——Rubric Loop 是给「裁判也会错」开的制度性出口。
          </p>
        </Card>
      </FadeIn>

      <div className="grid grid-cols-2 items-start gap-3">
        {lanes.map((lane, li) => (
          <div key={lane.key}>
            <FadeIn delay={li * 0.06}>
              <div className={`mb-2 rounded-lg border p-3 ${lane.tone === "blue" ? "border-blue-200 bg-blue-50" : "border-amber-200 bg-amber-50"}`}>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold">
                  <lane.icon size={14} /> {lane.title}
                  <span className="ml-auto text-[11px] font-normal text-zinc-500">{BADCASES.filter(b => b.loop === lane.key).length} 条</span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">{lane.desc}</p>
              </div>
            </FadeIn>
            <div className="space-y-2">
              {BADCASES.filter(b => b.loop === lane.key).map((b, i) => (
                <FadeIn key={b.id} delay={0.08 + i * 0.04}>
                  <Card className="p-3.5 transition-shadow hover:shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-zinc-400">{b.id}</span>
                      <Pill tone={b.state === "已完成" ? "green" : lane.tone}>{b.state}</Pill>
                      <span className="text-[12.5px] font-medium text-zinc-800">{b.label}</span>
                      <span className="ml-auto text-[11px] tabular-nums text-zinc-400">{b.count > 0 ? `${b.count} 条` : "口径级"}</span>
                    </div>
                    <div className="mt-2 text-[12px] leading-relaxed text-zinc-600"><span className="text-zinc-400">处方：</span>{b.target}</div>
                    <div className="mt-1.5 flex items-center gap-3 border-t border-zinc-100 pt-2 text-[11px] text-zinc-500">
                      <span>关联断言 <code className="font-mono text-zinc-600">{b.assert}</code></span>
                      <span>验证：{b.verify}</span>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        ))}
      </div>

      <FadeIn delay={0.2}>
        <div className="rounded-xl bg-zinc-900 p-4 text-[12px] leading-relaxed text-zinc-300">
          <b className="text-white">真实案例</b>：私联交易未拒答（被打 1 分混入均分）——归因后发现是红线定义缺口而非 Agent 行为缺陷，走 Rubric Loop 把安全从均分独立为一票否决；
          「1 分可用」口径漂移——「可用」未判定化，走 Rubric Loop 拆为文本可用 / 端到端可用两条断言。若当时硬修 Agent，就是削足适履。
        </div>
      </FadeIn>
    </div>
  );
}
