"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AnalyticsOverview } from "@/types/commerce";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function ChartTooltip({
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
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      {label ? <p className="mb-1 font-medium">{label}</p> : null}
      {payload.map((p, i) => (
        <p key={i} className="text-muted-foreground">
          <span style={{ color: p.color }}>{p.name ?? "Value"}: </span>
          <span className="font-medium text-foreground">
            {money && typeof p.value === "number"
              ? formatMoney(p.value)
              : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

function EmptyChart({ label = "No data yet" }: { label?: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

type Props = {
  data: AnalyticsOverview;
};

export function HomeAnalyticsCharts({ data }: Props) {
  const gmvSeries = useMemo(() => {
    const rows = data.charts?.gmvByDay ?? [];
    return rows.map((r) => ({
      date: r.date.slice(5),
      gmvCents: r.gmvCents,
    }));
  }, [data.charts?.gmvByDay]);

  const funnelBars = useMemo(() => {
    const f = data.funnel;
    return [
      { name: "Creators", value: f.creators, fill: COLORS[0] },
      { name: "Invited", value: f.contactedOrInvited, fill: COLORS[1] },
      { name: "Outreach", value: f.outreachSent, fill: COLORS[2] },
      { name: "Orders", value: f.orders, fill: COLORS[3] },
    ];
  }, [data.funnel]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2">
        <div className="mb-3">
          <h2 className="text-sm font-semibold tracking-tight">
            Shop GMV by day
          </h2>
          <p className="text-xs text-muted-foreground">
            Paid and pending attributed orders in the selected range
          </p>
        </div>
        <div className="h-56 w-full">
          {gmvSeries.length === 0 ? (
            <EmptyChart label="No shop GMV in this range" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gmvSeries} margin={{ left: 4, right: 8, top: 8 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${Math.round(Number(v) / 100)}`}
                />
                <Tooltip content={<ChartTooltip money />} />
                <Bar
                  dataKey="gmvCents"
                  name="GMV"
                  fill={COLORS[1]}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2">
        <div className="mb-3">
          <h2 className="text-sm font-semibold tracking-tight">
            Affiliate funnel
          </h2>
          <p className="text-xs text-muted-foreground">
            Creators through outreach to attributed orders
          </p>
        </div>
        <div className="h-56 w-full">
          {funnelBars.every((b) => b.value === 0) ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelBars}
                margin={{ left: 4, right: 8, top: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="value"
                  name="Count"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                >
                  {funnelBars.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
