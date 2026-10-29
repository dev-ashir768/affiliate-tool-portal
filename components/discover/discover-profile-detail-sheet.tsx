"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { DiscoveryProfile } from "@/types/commerce";

function formatMoney(
  amount: string | null | undefined,
  currency: string | null | undefined,
  range?: string | null,
) {
  if (range?.trim()) return range.trim();
  if (amount?.trim()) {
    return `${amount}${currency ? ` ${currency}` : ""}`.trim();
  }
  return "—";
}

function formatUnits(row: DiscoveryProfile) {
  if (row.unitsSoldRange?.trim()) return row.unitsSoldRange.trim();
  if (row.unitsSold != null) return row.unitsSold.toLocaleString();
  return "—";
}

function formatGender(row: DiscoveryProfile) {
  if (!row.majorGender) return "—";
  const pct =
    row.majorGenderPct != null
      ? ` ${Math.round(row.majorGenderPct / 100)}%`
      : "";
  return `${row.majorGender}${pct}`;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-2 border-b border-border/60 py-2 last:border-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm break-words">{value}</dd>
    </div>
  );
}

export function DiscoverProfileDetailSheet({
  profile,
  open,
  onOpenChange,
  onSave,
  saving,
}: {
  profile: DiscoveryProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (profileId: string) => void;
  saving?: boolean;
}) {
  const saved = Boolean(profile?.savedToCrm);
  const ages = (profile?.ageRanges ?? [])
    .map((a) => a.replace(/^AGE_RANGE_/, "").replace(/_/g, "-"))
    .join(", ");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {profile ? (
          <>
            <SheetHeader className="border-b">
              <div className="flex items-center gap-3 pr-8">
                {profile.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatarUrl}
                    alt=""
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-12 shrink-0 rounded-full bg-muted" />
                )}
                <div className="min-w-0">
                  <SheetTitle className="truncate">@{profile.handle}</SheetTitle>
                  <SheetDescription className="truncate">
                    {profile.displayName?.trim() || "Creator details"}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4">
              <dl>
                <DetailRow label="Region" value={profile.region ?? "—"} />
                <DetailRow
                  label="Followers"
                  value={profile.followerCount?.toLocaleString() ?? "—"}
                />
                <DetailRow
                  label="Level"
                  value={profile.creatorLevel ?? "—"}
                />
                <DetailRow
                  label="GMV"
                  value={formatMoney(
                    profile.gmvAmount,
                    profile.gmvCurrency,
                    profile.gmvRange,
                  )}
                />
                <DetailRow
                  label="Video GMV"
                  value={formatMoney(
                    profile.videoGmvAmount,
                    profile.gmvCurrency,
                  )}
                />
                <DetailRow
                  label="Live GMV"
                  value={formatMoney(
                    profile.liveGmvAmount,
                    profile.gmvCurrency,
                  )}
                />
                <DetailRow
                  label="Product card GMV"
                  value={formatMoney(
                    profile.productCardGmvAmount,
                    profile.gmvCurrency,
                  )}
                />
                <DetailRow label="Units" value={formatUnits(profile)} />
                <DetailRow
                  label="GPM"
                  value={formatMoney(
                    profile.gpmAmount,
                    profile.gpmCurrency,
                    profile.gpmRange,
                  )}
                />
                <DetailRow
                  label="Commission"
                  value={profile.avgCommissionRange?.trim() || "—"}
                />
                <DetailRow
                  label="Avg video views"
                  value={
                    profile.avgEcVideoViewCount?.toLocaleString() ?? "—"
                  }
                />
                <DetailRow
                  label="Avg live UV"
                  value={profile.avgEcLiveUv?.toLocaleString() ?? "—"}
                />
                <DetailRow label="Audience" value={formatGender(profile)} />
                <DetailRow label="Age ranges" value={ages || "—"} />
                <DetailRow
                  label="Email"
                  value={profile.contactEmail?.trim() || "—"}
                />
                <DetailRow
                  label="Synced"
                  value={
                    profile.metricsSyncedAt
                      ? new Date(profile.metricsSyncedAt).toLocaleString()
                      : "—"
                  }
                />
                <DetailRow
                  label="Categories"
                  value={
                    profile.categories?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {profile.categories.map((cat) => (
                          <Badge
                            key={cat}
                            variant="secondary"
                            className="bg-muted text-muted-foreground"
                          >
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      "—"
                    )
                  }
                />
                <DetailRow
                  label="Bio"
                  value={profile.bio?.trim() || "—"}
                />
              </dl>
            </div>

            <SheetFooter className="border-t">
              <Button
                type="button"
                variant="outline"
                disabled={saving || saved}
                onClick={() => {
                  if (!saved) onSave(profile.id);
                }}
              >
                {saving ? "Saving…" : saved ? "Saved" : "Save to CRM"}
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
