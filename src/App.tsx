import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard, BookOpen, Layers, ListChecks, ClipboardList, Workflow,
  BarChart3, GitFork, GitCompareArrows,
} from "lucide-react";
import Overview from "./pages/Overview";
import Metrics from "./pages/Metrics";
import Datasets from "./pages/Datasets";
import Assertions from "./pages/Assertions";
import Tasks from "./pages/Tasks";
import Pipeline from "./pages/Pipeline";
import Analysis from "./pages/Analysis";
import Attribution from "./pages/Attribution";
import Regression from "./pages/Regression";

const NAV = [
  { group: "总览", items: [{ id: "overview", label: "总览", icon: LayoutDashboard, desc: "四屏：健康 / 漏斗 / 诊断 / 质量与数据可信度" }] },
  {
    group: "评测资产",
    items: [
      { id: "metrics", label: "指标字典", icon: BookOpen, desc: "69 个指标 × 18 字段：产品侧 / 技术侧 / 护栏 / 数据门禁 / 评测工程" },
      { id: "datasets", label: "评测集", icon: Layers, desc: "四类资产 · 分布校验门禁 · 用例浏览" },
      { id: "assertions", label: "断言库", icon: ListChecks, desc: "Rubric 二元化 · κ / 人机一致率 / unknown 监控" },
    ],
  },
  {
    group: "评测执行",
    items: [
      { id: "tasks", label: "评测任务", icon: ClipboardList, desc: "四版本绑定：Agent × 数据 × 评测集 × 裁判" },
      { id: "pipeline", label: "判分管线", icon: Workflow, desc: "红线独立 → L1 → L2 → L3 仲裁 → 人评抽检" },
    ],
  },
  {
    group: "分析与改进",
    items: [
      { id: "analysis", label: "结果分析", icon: BarChart3, desc: "0922 批次：可用率 66% 的逐条拆解" },
      { id: "attribution", label: "归因双 Loop", icon: GitFork, desc: "Agent Loop 修系统 / Rubric Loop 校裁判" },
      { id: "regression", label: "回归对比", icon: GitCompareArrows, desc: "8 情境 × 3 版本矩阵 + Trace 回放" },
    ],
  },
];

const PAGES: Record<string, React.ComponentType> = {
  overview: Overview, metrics: Metrics, datasets: Datasets, assertions: Assertions,
  tasks: Tasks, pipeline: Pipeline, analysis: Analysis, attribution: Attribution, regression: Regression,
};

export default function App() {
  const [page, setPage] = useState("overview");
  const Page = useMemo(() => PAGES[page] ?? Overview, [page]);
  const current = NAV.flatMap(g => g.items).find(i => i.id === page);

  return (
    <div className="flex h-screen bg-[#f5f6f8] text-zinc-900" style={{ fontFamily: "-apple-system, 'PingFang SC', 'Segoe UI', sans-serif" }}>
      <aside className="flex w-[220px] shrink-0 flex-col border-r border-zinc-200/80 bg-white">
        <div className="border-b border-zinc-100 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-[13px] font-bold text-white">评</div>
            <div className="text-[14px] font-semibold tracking-tight">房产 Agent 评测平台</div>
          </div>
          <div className="mt-1.5 text-[10.5px] leading-relaxed text-zinc-400">业务研发平台 · 内部 B 端 · v0.9 demo</div>
        </div>
        <nav className="flex-1 overflow-y-auto px-2.5 py-3">
          {NAV.map(g => (
            <div key={g.group} className="mb-5">
              <div className="px-2 pb-1.5 text-[10.5px] font-medium uppercase tracking-wider text-zinc-400">{g.group}</div>
              {g.items.map(it => (
                <button key={it.id} onClick={() => setPage(it.id)}
                  className={`mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-all ${
                    page === it.id ? "bg-zinc-900 font-medium text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"}`}>
                  <it.icon size={15} strokeWidth={page === it.id ? 2.2 : 1.8} />
                  {it.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-zinc-100 px-4 py-3 text-[10.5px] leading-relaxed text-zinc-400">
          被评对象：小安 C 端 · 千问端外 · 到家履约（沙箱）
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 border-b border-zinc-200/80 bg-white/85 px-6 py-3 backdrop-blur">
          <div className="flex items-baseline gap-3">
            <h1 className="text-[15px] font-semibold">{current?.label}</h1>
            <span className="text-[12px] text-zinc-500">{current?.desc}</span>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }} className="p-6">
            <Page />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
