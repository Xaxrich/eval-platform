import { motion } from "framer-motion";
import { PIPELINE_STAGES } from "../data/platform";
import { SectionHead, FadeIn, Card } from "../components/bits";
import { CostBars } from "../components/charts";
import { ShieldAlert, Cpu, Scale, Gavel, UserCheck } from "lucide-react";

const ICONS = [ShieldAlert, Cpu, Scale, Gavel, UserCheck];

export default function Pipeline() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <Card className="p-5">
          <SectionHead title="断言机评管线" desc="对齐 WOWService 四步判分管线：任务降维 · 红线独立 · 冲突仲裁 · 人工抽检" />
          <div className="flex items-stretch gap-2">
            {PIPELINE_STAGES.map((s, i) => {
              const Icon = ICONS[i];
              return (
                <div key={s.stage} className="flex flex-1 items-center gap-2">
                  <motion.div whileHover={{ y: -2, boxShadow: "0 4px 14px rgba(0,0,0,0.08)" }}
                    className={`h-full flex-1 rounded-xl border p-3.5 transition-colors ${i === 0 ? "border-red-200 bg-red-50/60" : "border-zinc-200 bg-white"}`}>
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${i === 0 ? "bg-red-100 text-red-600" : "bg-zinc-100 text-zinc-600"}`}>
                      <Icon size={14} />
                    </div>
                    <div className="mt-2 text-[13px] font-medium">{s.stage}</div>
                    <div className="mt-0.5 font-mono text-[10.5px] text-zinc-400">{s.share}</div>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-600">{s.desc}</p>
                    <div className="mt-2 border-t border-zinc-100 pt-1.5 text-[10.5px] text-zinc-500"><span className="text-zinc-400">成本：</span>{s.cost}</div>
                  </motion.div>
                  {i < PIPELINE_STAGES.length - 1 && <div className="shrink-0 text-[16px] text-zinc-300">→</div>}
                </div>
              );
            })}
          </div>
        </Card>
      </FadeIn>

      <div className="grid grid-cols-2 gap-3">
        <FadeIn delay={0.1}>
          <Card className="p-4">
            <div className="mb-2 text-[13px] font-semibold">判定成本结构（报数字先报口径）</div>
            <CostBars />
            <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
              分级管线 ≈0.021 元/case vs 全量旗舰 ≈0.31 元/case，降幅约一个数量级。
              前提是 Rubric 二元化：序数评分无法用轻量模型判，二分类可以。
            </p>
          </Card>
        </FadeIn>
        <FadeIn delay={0.15}>
          <Card className="p-4">
            <div className="mb-2 text-[13px] font-semibold">三个设计要点</div>
            <ul className="space-y-2.5 text-[12px] leading-relaxed text-zinc-600">
              <li><b>① 任务降维</b>：序数评分（-1/0/1/2）拆成独立二分类——每个裁判决策边界清晰，κ 可单独监控。</li>
              <li><b>② 红线独立</b>：红线规则最复杂，单独判别避免污染体验档；0922「私联未拒答被打 1 分混入均分」是反面教材。</li>
              <li><b>③ 冲突仲裁</b>：异源旗舰模型只处理边界样本；仲裁案例回流修 Rubric。</li>
            </ul>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.2}>
        <Card className="p-4">
          <div className="text-[13px] font-semibold">基座隔离口径（评模型 ≠ 评系统）</div>
          <p className="mt-2 text-[12px] leading-relaxed text-zinc-600">
            基座评估与系统工程/工具/KB 解耦：数据集按难度与长度分层抽样，每样本跑 3 次取均值；指标报 total score / usability rate / perfect rate。
            换模型只换模型，Harness、上下文策略、评测集、裁判全部固定——结论才能归因到模型。裁判模型与生产模型异源，写进平台规则，防同源放水。
          </p>
        </Card>
      </FadeIn>
    </div>
  );
}
