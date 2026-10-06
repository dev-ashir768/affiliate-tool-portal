"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import {
  DateRangePicker,
  rangeFromDays,
  type DateRangeValue,
} from "@/components/ui/date-range-picker";
import { useMe } from "@/hooks/use-me";
import { useOrg } from "@/hooks/use-org";
import { useShops } from "@/hooks/use-shops";
import { useMembersQuery } from "@/hooks/use-members";
import { useAnalyticsOverview } from "@/hooks/use-commerce";
import { HomeAnalyticsCharts } from "@/components/home/home-analytics-charts";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
function cents(n: number) {
  return (n / 100).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

export function HomeOverview() {
  const [dateRange, setDateRange] = useState<DateRangeValue>(() =>
    rangeFromDays(30),
  );
  const analyticsParams = useMemo(
    () => ({
      from: dateRange.from || undefined,
      to: dateRange.to || undefined,
    }),
    [dateRange.from, dateRange.to],
  );

  const meQuery = useMe();
  const orgQuery = useOrg();
  const shopsQuery = useShops();
  const membersQuery = useMembersQuery({ page: 1, pageSize: 1 });
  const analyticsQuery = useAnalyticsOverview(analyticsParams);

  const isLoading =
    meQuery.isLoading || orgQuery.isLoading || shopsQuery.isLoading;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  const me = meQuery.data;
  const org = orgQuery.data;
  const shops = shopsQuery.data?.shops ?? [];
  const activeShops = shops.filter((s) => s.status !== "DISCONNECTED").length;
  const memberTotal = membersQuery.data?.meta.total;
  const funnel = analyticsQuery.data?.funnel;

  const currentMembership = me?.memberships.find(
    (m) => m.organization.id === me.currentOrganizationId,
  );

  const linkClass = buttonVariants({
    variant: "link",
    className: "h-auto px-0",
  });

  const tiles = [
    {
      label: "Shops",
      value: (
        <>
          {activeShops}
          {org ? (
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              / {org.shopLimit}
            </span>
          ) : null}
        </>
      ),
      hint: "Connected TikTok Shops",
      href: "/shops",
      cta: "Manage shops",
    },
    {
      label: "Team",
      value: (
        <>
          {memberTotal ?? "—"}
          {org ? (
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              / {org.seatLimit} seats
            </span>
          ) : null}
        </>
      ),
      hint: "Members in your organization",
      href: "/team",
      cta: "Manage team",
    },
    {
      label: "Billing",
      value: org?.plan.name ?? "—",
      hint: `Status: ${org?.subscriptionStatus ?? "None"}`,
      href: "/billing",
      cta: "View billing",
    },
    {
      label: "Creators",
      value: funnel?.creators ?? "—",
      hint: "Creators in your CRM",
      href: "/creators",
      cta: "Open CRM",
    },
    {
      label: "Outreach sent",
      value: funnel?.outreachSent ?? "—",
      hint: "Emails delivered in this range",
      href: "/outreach",
      cta: "Send outreach",
    },
    {
      label: "Shop GMV",
      value: funnel
        ? cents(analyticsQuery.data?.gmv?.shop.gmvCents ?? funnel.gmvCents)
        : "—",
      hint: `${funnel?.orders ?? 0} attributed orders${
        analyticsQuery.data?.gmv?.marketplace.creatorsWithParsableGmv
          ? ` · ${analyticsQuery.data.gmv.marketplace.creatorsWithParsableGmv} creators w/ marketplace GMV`
          : ""
      }`,
      href: "/analytics",
      cta: "View analytics",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Welcome${me?.user.name ? `, ${me.user.name.split(" ")[0]}` : ""}`}
        description={
          <>
            {org
              ? `${org.name} · ${org.plan.name} plan`
              : "Your organization dashboard"}
            {currentMembership ? ` · ${currentMembership.role}` : null}
          </>
        }
        actions={
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            disabled={analyticsQuery.isFetching}
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((t) => (
          <StatCard key={t.label} label={t.label} value={t.value} hint={t.hint}>
            <Link href={t.href} className={linkClass}>
              {t.cta}
            </Link>
          </StatCard>
        ))}
      </div>

      {analyticsQuery.isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : analyticsQuery.data ? (
        <HomeAnalyticsCharts data={analyticsQuery.data} />
      ) : null}
    </div>
  );
}
