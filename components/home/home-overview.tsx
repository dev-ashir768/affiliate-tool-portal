"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Welcome{me?.user.name ? `, ${me.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            {org
              ? `${org.name} · ${org.plan.name} plan`
              : "Your organization dashboard"}
            {currentMembership ? ` · ${currentMembership.role}` : null}
          </p>
        </div>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          disabled={analyticsQuery.isFetching}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardDescription>Shops</CardDescription>
            <CardTitle>
              {activeShops}
              {org ? (
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  / {org.shopLimit}
                </span>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/shops"
              className={buttonVariants({
                variant: "link",
                className: "h-auto px-0",
              })}
            >
              Manage shops
            </Link>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Team</CardDescription>
            <CardTitle>
              {memberTotal ?? "—"}
              {org ? (
                <span className="text-base font-normal text-muted-foreground">
                  {" "}
                  / {org.seatLimit} seats
                </span>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/team"
              className={buttonVariants({
                variant: "link",
                className: "h-auto px-0",
              })}
            >
              Manage team
            </Link>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Billing</CardDescription>
            <CardTitle>{org?.plan.name ?? "—"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-xs text-muted-foreground">
              Status: {org?.subscriptionStatus ?? "None"}
            </p>
            <Link
              href="/billing"
              className={buttonVariants({
                variant: "link",
                className: "h-auto px-0",
              })}
            >
              View billing
            </Link>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Creators</CardDescription>
            <CardTitle>{funnel?.creators ?? "—"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/creators"
              className={buttonVariants({
                variant: "link",
                className: "h-auto px-0",
              })}
            >
              Open CRM
            </Link>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Outreach sent</CardDescription>
            <CardTitle>{funnel?.outreachSent ?? "—"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href="/outreach"
              className={buttonVariants({
                variant: "link",
                className: "h-auto px-0",
              })}
            >
              Send outreach
            </Link>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardDescription>Shop GMV</CardDescription>
            <CardTitle>
              {funnel
                ? cents(analyticsQuery.data?.gmv?.shop.gmvCents ?? funnel.gmvCents)
                : "—"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-xs text-muted-foreground">
              {funnel?.orders ?? 0} attributed orders
              {analyticsQuery.data?.gmv?.marketplace.creatorsWithParsableGmv
                ? ` · ${analyticsQuery.data.gmv.marketplace.creatorsWithParsableGmv} creators w/ marketplace GMV`
                : ""}
            </p>
            <Link
              href="/analytics"
              className={buttonVariants({
                variant: "link",
                className: "h-auto px-0",
              })}
            >
              View analytics
            </Link>
          </CardContent>
        </Card>
      </div>

      {analyticsQuery.isLoading ? (
        <Skeleton className="h-72 w-full" />
      ) : analyticsQuery.data ? (
        <HomeAnalyticsCharts data={analyticsQuery.data} />
      ) : null}
    </div>
  );
}
