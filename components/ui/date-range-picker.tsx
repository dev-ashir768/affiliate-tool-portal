"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";

export type DateRangeValue = {
  from: string;
  to: string;
};

type Preset = {
  id: string;
  label: string;
  days?: number;
  all?: boolean;
};

const PRESETS: Preset[] = [
  { id: "7d", label: "7d", days: 7 },
  { id: "30d", label: "30d", days: 30 },
  { id: "90d", label: "90d", days: 90 },
  { id: "all", label: "All", all: true },
];

function toDateInput(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function rangeFromDays(days: number): DateRangeValue {
  const to = new Date();
  const from = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000);
  return { from: toDateInput(from), to: toDateInput(to) };
}

export function emptyDateRange(): DateRangeValue {
  return { from: "", to: "" };
}

type Props = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  className?: string;
  disabled?: boolean;
};

export function DateRangePicker({
  value,
  onChange,
  className,
  disabled,
}: Props) {
  const activePreset = useMemo(() => {
    if (!value.from && !value.to) return "all";
    for (const p of PRESETS) {
      if (!p.days) continue;
      const expected = rangeFromDays(p.days);
      if (expected.from === value.from && expected.to === value.to) return p.id;
    }
    return "custom";
  }, [value.from, value.to]);

  return (
    <div className={cn("flex flex-wrap items-end gap-2", className)}>
      <div className="flex flex-wrap gap-1">
        {PRESETS.map((p) => (
          <Button
            key={p.id}
            type="button"
            size="sm"
            variant={activePreset === p.id ? "default" : "outline"}
            disabled={disabled}
            onClick={() => {
              if (p.all) onChange(emptyDateRange());
              else if (p.days) onChange(rangeFromDays(p.days));
            }}
          >
            {p.label}
          </Button>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <label className="grid gap-1 text-xs text-muted-foreground">
          From
          <Input
            type="date"
            className="h-9 w-auto"
            value={value.from}
            disabled={disabled}
            onChange={(e) => onChange({ ...value, from: e.target.value })}
          />
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          To
          <Input
            type="date"
            className="h-9 w-auto"
            value={value.to}
            disabled={disabled}
            onChange={(e) => onChange({ ...value, to: e.target.value })}
          />
        </label>
      </div>
    </div>
  );
}
