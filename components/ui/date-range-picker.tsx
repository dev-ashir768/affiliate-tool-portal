"use client";

import { useMemo, useState } from "react";
import { format, isValid, parse, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/** ISO dates (yyyy-MM-dd); empty strings mean "no bound" (All time). */
export type DateRangeValue = {
  from: string;
  to: string;
};

const ISO = "yyyy-MM-dd";

type Preset = { id: string; label: string; days?: number };

const PRESETS: Preset[] = [
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
  { id: "all", label: "All time" },
];

function toIso(d: Date) {
  return format(d, ISO);
}

function fromIso(value: string): Date | undefined {
  if (!value) return undefined;
  const d = parse(value, ISO, new Date());
  return isValid(d) ? d : undefined;
}

export function rangeFromDays(days: number): DateRangeValue {
  const to = new Date();
  return { from: toIso(subDays(to, days - 1)), to: toIso(to) };
}

export function emptyDateRange(): DateRangeValue {
  return { from: "", to: "" };
}

function labelFor(value: DateRangeValue, presetId: string): string {
  const preset = PRESETS.find((p) => p.id === presetId);
  if (preset) return preset.label;
  const from = fromIso(value.from);
  const to = fromIso(value.to);
  if (from && to) return `${format(from, "MMM d, yyyy")} – ${format(to, "MMM d, yyyy")}`;
  if (from) return `From ${format(from, "MMM d, yyyy")}`;
  if (to) return `Until ${format(to, "MMM d, yyyy")}`;
  return "Pick a date range";
}

type Props = {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  className?: string;
  disabled?: boolean;
};

/** shadcn date range picker: Popover + range Calendar with quick presets. */
export function DateRangePicker({
  value,
  onChange,
  className,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);

  const activePreset = useMemo(() => {
    if (!value.from && !value.to) return "all";
    for (const p of PRESETS) {
      if (!p.days) continue;
      const expected = rangeFromDays(p.days);
      if (expected.from === value.from && expected.to === value.to) return p.id;
    }
    return "custom";
  }, [value.from, value.to]);

  const selected: DateRange | undefined = useMemo(() => {
    const from = fromIso(value.from);
    if (!from) return undefined;
    return { from, to: fromIso(value.to) };
  }, [value.from, value.to]);

  function applyPreset(p: Preset) {
    onChange(p.days ? rangeFromDays(p.days) : emptyDateRange());
    setOpen(false);
  }

  function onSelect(range: DateRange | undefined) {
    onChange({
      from: range?.from ? toIso(range.from) : "",
      to: range?.to ? toIso(range.to) : "",
    });
    // Close once both ends are picked.
    if (range?.from && range.to && range.from.getTime() !== range.to.getTime()) {
      setOpen(false);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={cn(
              "min-w-56 justify-start font-normal",
              activePreset === "custom" && !selected && "text-muted-foreground",
              className,
            )}
          />
        }
      >
        <CalendarIcon className="text-muted-foreground" />
        <span className="truncate">{labelFor(value, activePreset)}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-row flex-wrap gap-1 border-b p-2 sm:w-36 sm:flex-col sm:border-r sm:border-b-0">
            {PRESETS.map((p) => (
              <Button
                key={p.id}
                type="button"
                size="sm"
                variant={activePreset === p.id ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </Button>
            ))}
          </div>
          <Calendar
            mode="range"
            defaultMonth={selected?.from ?? subDays(new Date(), 30)}
            selected={selected}
            onSelect={onSelect}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
