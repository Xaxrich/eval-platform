// 到家「写入成功，但请求超时」情境的逐步 trace（机制细节来自真实运行记录）
export interface TraceStep {
  n: number; kind: "user" | "tool" | "reply" | "violation";
  actor?: string; action?: string; args?: string; result?: string;
  text?: string; bad?: boolean; note?: string;
}
export interface TraceVersion { id: string; name: string; verdict: string; steps: TraceStep[] }

export const WRITE_TIMEOUT_TRACE: TraceVersion[] = [
  {
    id: "V0", name: "直接串工具（无对象绑定/无确认/无幂等）", verdict: "fail：未知结果下重复写入尝试 + 无证据承诺",
    steps: [
      { n: 1, kind: "user", text: "师傅怎么还没来？我中午必须出门，能不能改到明天下午？" },
      { n: 2, kind: "tool", action: "submit_reschedule", args: "order_id=列表第一单（按位置推断）", result: "⏱ TIMEOUT（后台实际已写入）", note: "对象未绑定：凭列表顺序取单" },
      { n: 3, kind: "tool", action: "submit_reschedule", args: "idempotency_key=K:retry（换键重试）", result: "REJECTED（版本校验拒绝）", bad: true, note: "违反「写入唯一」：同一意图换了幂等键重试，制造重复写入风险" },
      { n: 4, kind: "reply", text: "已帮您改约到明天下午 14:00。", bad: true, note: "违反「承诺证据」：没有成功回执支撑；违反「未知查证」：UNKNOWN 未核查" },
    ],
  },
  {
    id: "V2", name: "对象 + 确认 + 幂等 + 回执（完整不变量）", verdict: "pass：同一句话，但证据链完整",
    steps: [
      { n: 1, kind: "user", text: "师傅怎么还没来？我中午必须出门，能不能改到明天下午？" },
      { n: 2, kind: "tool", action: "list_orders → get_order", args: "账户下两笔订单逐一核对", result: "绑定 O-1001 保洁（今天 10:00–12:00）", note: "对象一致：不凭最近一单推断" },
      { n: 3, kind: "tool", action: "find_slots → propose_reschedule", args: "明天下午时段快照", result: "生成待确认提案（draft，不落业务库）" },
      { n: 4, kind: "user", text: "确认将保洁单改到明天 14:00–16:00" },
      { n: 5, kind: "tool", action: "get_confirmation", args: "读取服务端 consent", result: "token=digest(提案, goal_version) 有效", note: "确认有效：与当前目标版本匹配" },
      { n: 6, kind: "tool", action: "submit_reschedule", args: "idempotency_key=K（首次提交）", result: "⏱ TIMEOUT（后台实际已写入）" },
      { n: 7, kind: "tool", action: "lookup_operation", args: "idempotency_key=K（原键查账）", result: "SUCCESS：账本显示已写入", note: "未知查证：先消除不确定性再行动" },
      { n: 8, kind: "tool", action: "get_order", args: "order_id=O-1001（回读）", result: "appointment=明天 14:00–16:00，version+1" },
      { n: 9, kind: "reply", text: "已改约到明天 14:00–16:00（操作单号 OP-…，可随时查看）。", note: "承诺证据：每个结论性陈述都有回执" },
    ],
  },
];
