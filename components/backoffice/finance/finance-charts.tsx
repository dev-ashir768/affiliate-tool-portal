"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BillingOverview } from "@/types/platform";

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

type Props = { data: BillingOverview };

export function FinanceCharts({ data }: Props) {
  const funnelData = useMemo(() => {
    const f = data.funnel;
    if (!f) return [];
    return [
      { name: "Registered", value: f.registered, fill: COLORS[0] },
      { name: "Subscribed", value: f.subscribed, fill: COLORS[1] },
      { name: "Renewed", value: f.renewed, fill: COLORS[2] },
      { name: "Upgraded", value: f.upgraded, fill: COLORS[3] },
      { name: "Canceled", value: f.canceled, fill: COLORS[4] },
    ].filter((d) => d.value > 0 || d.name === "Registered");
  }, [data.funnel]);

  const statusData = useMemo(() => {
    const rows = [
      ...data.subscriptionsByStatus.map((r) => ({
        name: r.status,
        value: r.count,
      })),
      ...(data.noSubscriptionCount > 0
        ? [{ name: "NONE", value: data.noSubscriptionCount }]
        : []),
    ];
    return rows.filter((r) => r.value > 0);
  }, [data.subscriptionsByStatus, data.noSubscriptionCount]);

  const mrrData = useMemo(
    () =>
      data.revenueByPlan
        .filter((r) => r.orgCount > 0)
        .map((r) => ({
          name: r.planName,
          mrrCents: r.mrrCents,
          orgs: r.orgCount,
        })),
    [data.revenueByPlan],
  );

  const planMix = useMemo(
    () =>
      data.orgsByPlan
        .filter((r) => r.count > 0)
        .map((r) => ({ name: r.planName, value: r.count })),
    [data.orgsByPlan],
  );

  const accessMix = useMemo(
    () =>
      [
        { name: "With access", value: data.withProductAccessCount },
        {
          name: "No access",
          value: Math.max(
            0,
            data.organizationCount - data.withProductAccessCount,
          ),
        },
      ].filter((r) => r.value > 0),
    [data.organizationCount, data.withProductAccessCount],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2">
        <div className="mb-3">
          <h2 className="text-sm font-semibold tracking-tight">
            Customer funnel
          </h2>
          <p className="text-xs text-muted-foreground">
            Register → subscribe → renew / upgrade / cancel at a glance
            {data.funnel ? ` · ${data.funnel.conversionRate}% conversion` : ""}
          </p>
        </div>
        <div className="h-64 w-full">
          {funnelData.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip content={<ChartTooltip />} />
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                  <LabelList
                    position="right"
                    fill="var(--foreground)"
                    stroke="none"
                    dataKey="name"
                    className="text-xs"
                  />
                  <LabelList
                    position="center"
                    fill="var(--primary-foreground)"
                    stroke="none"
                    dataKey="value"
                    className="text-xs font-semibold"
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3">
          <h2 className="text-sm font-semibold tracking-tight">
            Subscription health
          </h2>
          <p className="text-xs text-muted-foreground">
            Active vs at-risk vs inactive mix
          </p>
        </div>
        <div className="h-56 w-full">
          {statusData.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={2}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3">
          <h2 className="text-sm font-semibold tracking-tight">
            Access coverage
          </h2>
          <p className="text-xs text-muted-foreground">
            Customers with product access vs locked
          </p>
        </div>
        <div className="h-56 w-full">
          {accessMix.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={accessMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                >
                  <Cell fill={COLORS[1]} />
                  <Cell fill={COLORS[4]} />
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3">
          <h2 className="text-sm font-semibold tracking-tight">
            Paying MRR by plan
          </h2>
          <p className="text-xs text-muted-foreground">
            Catalog MRR from access-granting subscribers
          </p>
        </div>
        <div className="h-56 w-full">
          {mrrData.length === 0 ? (
            <EmptyChart label="No paying MRR yet" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mrrData} margin={{ left: 4, right: 8, top: 8 }}>
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
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${Math.round(Number(v) / 100)}`}
                />
                <Tooltip content={<ChartTooltip money />} />
                <Bar
                  dataKey="mrrCents"
                  name="MRR"
                  fill={COLORS[1]}
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3">
          <h2 className="text-sm font-semibold tracking-tight">
            Customers by plan
          </h2>
          <p className="text-xs text-muted-foreground">
            Plan mix across all organizations
          </p>
        </div>
        <div className="h-56 w-full">
          {planMix.length === 0 ? (
            <EmptyChart />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={planMix}
                margin={{ left: 8, right: 16, top: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="var(--border)"
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={72}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="value"
                  name="Customers"
                  fill={COLORS[0]}
                  radius={[0, 6, 6, 0]}
                  maxBarSize={28}
                >
                  {planMix.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
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

function EmptyChart({ label = "No data yet" }: { label?: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}
