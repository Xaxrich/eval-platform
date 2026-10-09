import { ASSERTIONS } from "../data/platform";
import { SectionHead, FadeIn, Card, Pill } from "../components/bits";
import { AgreeBars } from "../components/charts";

const stTone = (s: string) =>
  s === "机评" ? "green" : s === "规则判定" ? "blue" : s === "红线管线" ? "red" : s === "机评试点" ? "amber" : "zinc";

export default function Assertions() {
  const groups = [...new Set(ASSERTIONS.map(a => a.group))];
  const chartData = ASSERTIONS.filter(a => a.kappa !== "—").map(a => ({
    id: a.id, kappa: parseFloat(a.kappa), hm: parseFloat(a.hm) / 100,
  }));
  return (
    <div className="space-y-5">
      <FadeIn>
        <div className="grid grid-cols-4 gap-3">
          {[
            { k: "人人一致率门槛", v: "≥85%", n: "单条断言 κ；不过门槛只许人评" },
            { k: "人机一致率门槛", v: "≥90%", n: "达标才允许机评放量；跌破自动降级" },
            { k: "unknown 告警线", v: ">10%", n: "Rubric 定义不充分的诊断信号" },
            { k: "机评信任原则", v: "挣来的", n: "先 100% 人评对照跑影子，达标再放量" },
          ].map(c => (
            <Card key={c.k} className="p-3.5">
              <div className="text-[11px] text-zinc-400">{c.k}</div>
              <div className="mt-0.5 text-[20px] font-semibold tabular-nums">{c.v}</div>
              <div className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">{c.n}</div>
            </Card>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Card className="p-4">
          <SectionHead title="一致率监控（C 系列断言，影子批口径）" desc="κ=人人一致（深灰）· 人机一致率（蓝）；C4/C7 未过门槛 → 维持人评并下钻" />
          <AgreeBars data={chartData} />
        </Card>
      </FadeIn>

      {groups.map((g, gi) => (
        <FadeIn key={g} delay={0.08 + gi * 0.02}>
          <div className="mb-1.5 text-[12px] font-medium text-zinc-500">{g}</div>
          <Card className="overflow-hidden">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-500">
                  <th className="px-3 py-2 font-medium">断言</th><th className="px-3 py-2 font-medium">内容</th>
                  <th className="px-3 py-2 font-medium">证据锚点</th><th className="px-3 py-2 font-medium">κ</th>
                  <th className="px-3 py-2 font-medium">人机一致率</th><th className="px-3 py-2 font-medium">unknown</th>
                  <th className="px-3 py-2 font-medium">判定方式</th>
                </tr>
              </thead>
              <tbody>
                {ASSERTIONS.filter(a => a.group === g).map(a => (
                  <tr key={a.id} className="border-b border-zinc-50 transition-colors hover:bg-zinc-50">
                    <td className="px-3 py-2 font-mono text-[11px] text-zinc-400">{a.id}</td>
                    <td className="px-3 py-2 text-zinc-800">{a.text}</td>
                    <td className="px-3 py-2 font-mono text-[11px] text-zinc-500">{a.anchor}</td>
                    <td className="px-3 py-2 tabular-nums">{a.kappa}</td>
                    <td className="px-3 py-2 tabular-nums">{a.hm}</td>
                    <td className="px-3 py-2 tabular-nums">{a.unknown}</td>
                    <td className="px-3 py-2"><Pill tone={stTone(a.status) as never}>{a.status}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </FadeIn>
      ))}
      <p className="text-[12px] text-zinc-500">
        断言三纪律：可判定（有证据锚点）· 证据锚点人评机评共用 · 允许 unknown。D1–D7 为到家业务不变量断言（规则判定）；C 系列为千问/小安业务断言。
      </p>
    </div>
  );
}
