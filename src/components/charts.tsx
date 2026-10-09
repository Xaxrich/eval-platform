import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

const C = { ink: "#18181b", mute: "#a1a1aa", green: "#10b981", amber: "#f59e0b", red: "#ef4444", blue: "#2563eb", violet: "#7c3aed" };

const tip = {
  contentStyle: { fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7", boxShadow: "0 2px 8px rgba(0,0,0,.06)" },
};

/** 分数分布环图 */
export function ScoreDonut({ data }: { data: { score: string; count: number; pct: number }[] }) {
  const colors = [C.green, "#3f3f46", C.amber, C.red];
  return (
    <ResponsiveContainer width="100%" height={190}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="score" innerRadius={52} outerRadius={78} paddingAngle={2} strokeWidth={0}>
          {data.map((_, i) => <Cell key={i} fill={colors[i]} />)}
        </Pie>
        <Tooltip {...tip} formatter={(v: number, n: string) => [`${v} 条`, n]} />
        <text x="50%" y="47%" textAnchor="middle" fontSize={22} fontWeight={600} fill={C.ink}>50</text>
        <text x="50%" y="58%" textAnchor="middle" fontSize={11} fill={C.mute}>Session</text>
      </PieChart>
    </ResponsiveContainer>
  );
}

/** 横向条形（坏案标签等） */
export function HBars({ data, color = C.ink, unit = "条" }: { data: { name: string; value: number }[]; color?: string; unit?: string }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(120, data.length * 38)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 34, top: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" width={118} tick={{ fontSize: 11.5, fill: "#52525b" }} axisLine={false} tickLine={false} />
        <Tooltip {...tip} formatter={(v: number) => [`${v} ${unit}`, "数量"]} cursor={{ fill: "#f4f4f5" }} />
        <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} barSize={16}>
          <LabelList dataKey="value" position="right" style={{ fontSize: 11.5, fill: "#52525b" }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 目标 vs 实际分布（评测集分布校验） */
export function DistBars({ data }: { data: { name: string; 目标: number; 实际: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} margin={{ left: -18, right: 8, top: 4, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#52525b" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} axisLine={false} tickLine={false} unit="%" />
        <Tooltip {...tip} cursor={{ fill: "#f4f4f5" }} />
        <Bar dataKey="目标" fill="#d4d4d8" radius={[4, 4, 0, 0]} barSize={14} />
        <Bar dataKey="实际" fill={C.blue} radius={[4, 4, 0, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 成本对比 */
export function CostBars() {
  const data = [
    { name: "全量旗舰判分", cost: 0.31 },
    { name: "分级管线", cost: 0.021 },
  ];
  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 44, top: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="name" width={104} tick={{ fontSize: 11.5, fill: "#52525b" }} axisLine={false} tickLine={false} />
        <Tooltip {...tip} formatter={(v: number) => [`${v} 元/case`, "成本"]} cursor={{ fill: "#f4f4f5" }} />
        <Bar dataKey="cost" radius={[0, 4, 4, 0]} barSize={18}>
          <Cell fill="#d4d4d8" /><Cell fill={C.green} />
          <LabelList dataKey="cost" position="right" formatter={(v: number) => `${v} 元`} style={{ fontSize: 11.5, fill: "#52525b" }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** 断言一致率（κ / 人机）双条 */
export function AgreeBars({ data }: { data: { id: string; kappa: number; hm: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(160, data.length * 26)}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }} barCategoryGap="24%">
        <XAxis type="number" domain={[0.6, 1]} hide />
        <YAxis type="category" dataKey="id" width={34} tick={{ fontSize: 11, fill: "#71717a", fontFamily: "monospace" }} axisLine={false} tickLine={false} />
        <Tooltip {...tip} cursor={{ fill: "#f4f4f5" }} />
        <Bar dataKey="kappa" name="κ 人人一致" fill="#71717a" radius={[0, 3, 3, 0]} barSize={7} />
        <Bar dataKey="hm" name="人机一致率" fill={C.blue} radius={[0, 3, 3, 0]} barSize={7} />
      </BarChart>
    </ResponsiveContainer>
  );
}
