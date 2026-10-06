"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ─── palette ──────────────────────────────────────────────────────── */
const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function fmt(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.length === 3 ? currency : "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/* ─── shared tooltip ────────────────────────────────────────────── */
function ChartTip({
  active,
  payload,
  label,
  money,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
  money?: boolean;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      {label ? <p className="mb-1 font-medium">{label}</p> : null}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-1.5 text-muted-foreground">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: p.color }}
          />
          <span style={{ color: p.color }}>{p.name ?? "Value"}:</span>
          <span className="font-semibold text-foreground">
            {money && typeof p.value === "number" ? fmt(p.value) : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

/* ─── empty placeholders ────────────────────────────────────────── */
function EmptyChart({
  label = "No data yet",
  height = 200,
}: {
  label?: string;
  height?: number;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted"
      style={{ height }}
    >
      <div className="flex h-12 items-end gap-1.5 opacity-20">
        {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
          <div
            key={i}
            className="w-4 rounded-t-md bg-muted-foreground"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function EmptyDonut({ label = "No data yet" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-4">
      <div className="relative h-32 w-32 opacity-20">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            className="text-muted-foreground"
          />
        </svg>
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

/* ─── sparkline (mini area chart inside KPI cards) ──────────────── */
export function Sparkline({
  data,
  color = PALETTE[1],
}: {
  data: number[];
  color?: string;
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-10 items-end gap-0.5 opacity-20">
        {[3, 5, 4, 6, 5, 7, 6].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-muted-foreground"
            style={{ height: `${h * 10}%` }}
          />
        ))}
      </div>
    );
  }
  const series = data.map((v, i) => ({ i, v }));
  const id = `spark-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={series} margin={{ top: 2, right: 0, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#${id})`}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ─── GMV by day bar chart ──────────────────────────────────────── */
export function GmvByDayChart({
  data,
}: {
  data: Array<{ date: string; gmvCents: number }>;
}) {
  if (data.length === 0)
    return <EmptyChart label="No shop GMV in this range" height={220} />;
  const series = data.map((r) => ({ date: r.date.slice(5), gmv: r.gmvCents }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={series} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="gmv-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTE[1]} stopOpacity={1} />
            <stop offset="100%" stopColor={PALETTE[0]} stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--border)"
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${Math.round(Number(v) / 100)}`}
          width={52}
        />
        <Tooltip content={<ChartTip money />} />
        <Bar
          dataKey="gmv"
          name="GMV"
          fill="url(#gmv-bar)"
          radius={[6, 6, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── Order status donut ────────────────────────────────────────── */
export function OrderStatusDonut({
  orders,
}: {
  orders: Array<{ status: string }>;
}) {
  if (orders.length === 0) return <EmptyDonut label="No orders yet" />;

  const counts: Record<string, number> = {};
  for (const o of orders) {
    const s = o.status ?? "UNKNOWN";
    counts[s] = (counts[s] ?? 0) + 1;
  }
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));
  const total = orders.length;

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-36 w-36 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={62}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const p = payload[0];
                return (
                  <div className="rounded-lg border border-border bg-popover px-2 py-1 text-xs shadow-lg">
                    <span style={{ color: (p.payload as { fill?: string })?.fill }}>
                      {p.name}:
                    </span>{" "}
                    <strong>{p.value}</strong>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tabular-nums">{total}</span>
          <span className="text-[10px] text-muted-foreground">total</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2 text-sm">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ background: PALETTE[i % PALETTE.length] }}
            />
            <span className="text-muted-foreground capitalize">
              {d.name.toLowerCase()}
            </span>
            <span className="ml-auto font-semibold tabular-nums">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Funnel bar chart ──────────────────────────────────────────── */
export function FunnelChart({
  data,
}: {
  data: Array<{ name: string; value: number }>;
}) {
  const hasData = data.some((d) => d.value > 0);
  if (!hasData) return <EmptyChart label="No funnel data yet" height={180} />;
  const series = data.map((d, i) => ({
    ...d,
    fill: PALETTE[i % PALETTE.length],
  }));
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={series} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--border)"
        />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip content={<ChartTip />} />
        <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {series.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ─── Creator GMV horizontal bar chart ─────────────────────────── */
export function CreatorGmvChart({
  data,
}: {
  data: Array<{ handle: string | null; gmvCents: number }>;
}) {
  if (data.length === 0)
    return <EmptyChart label="No creator GMV yet" height={160} />;
  const series = data
    .slice(0, 8)
    .map((d) => ({ name: `@${d.handle ?? "—"}`, gmv: d.gmvCents }));
  return (
    <ResponsiveContainer
      width="100%"
      height={Math.max(160, series.length * 36)}
    >
      <BarChart
        data={series}
        layout="vertical"
        margin={{ left: 0, right: 24, top: 4, bottom: 4 }}
      >
        <defs>
          <linearGradient id="creator-bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={PALETTE[0]} stopOpacity={0.8} />
            <stop offset="100%" stopColor={PALETTE[1]} stopOpacity={1} />
          </linearGradient>
        </defs>
        <XAxis
          type="number"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${Math.round(Number(v) / 100)}`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          axisLine={false}
          tickLine={false}
          width={72}
        />
        <Tooltip content={<ChartTip money />} />
        <Bar
          dataKey="gmv"
          name="GMV"
          fill="url(#creator-bar)"
          radius={[0, 6, 6, 0]}
          maxBarSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
