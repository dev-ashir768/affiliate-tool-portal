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
  /** Range restored by "Reset" (defaults to the last 30 days). */
  defaultValue?: DateRangeValue;
  className?: string;
  disabled?: boolean;
};

function presetFor(value: DateRangeValue): string {
  if (!value.from && !value.to) return "all";
  for (const p of PRESETS) {
    if (!p.days) continue;
    const expected = rangeFromDays(p.days);
    if (expected.from === value.from && expected.to === value.to) return p.id;
  }
  return "custom";
}

function toDayRange(value: DateRangeValue): DateRange | undefined {
  const from = fromIso(value.from);
  if (!from) return undefined;
  return { from, to: fromIso(value.to) };
}

/**
 * shadcn date range picker: Popover + range Calendar with presets.
 * Picks are staged in a draft; "Apply" commits them, "Reset" restores the
 * page's default range, closing without Apply discards the draft.
 */
export function DateRangePicker({
  value,
  onChange,
  defaultValue,
  className,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRangeValue>(value);

  const appliedPreset = useMemo(() => presetFor(value), [value]);
  const draftPreset = useMemo(() => presetFor(draft), [draft]);
  const draftRange = useMemo(() => toDayRange(draft), [draft]);

  function onOpenChange(next: boolean) {
    // Start every session from the applied value.
    if (next) setDraft(value);
    setOpen(next);
  }

  function onSelect(range: DateRange | undefined) {
    setDraft({
      from: range?.from ? toIso(range.from) : "",
      to: range?.to ? toIso(range.to) : "",
    });
  }

  function apply() {
    // A single picked day means a one-day range.
    onChange(draft.from && !draft.to ? { from: draft.from, to: draft.from } : draft);
    setOpen(false);
  }

  function reset() {
    const initial = defaultValue ?? rangeFromDays(30);
    setDraft(initial);
    onChange(initial);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        disabled={disabled}
        render={
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={cn("min-w-56 justify-start font-normal", className)}
          />
        }
      >
        <CalendarIcon className="text-muted-foreground" />
        <span className="truncate">{labelFor(value, appliedPreset)}</span>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-row flex-wrap gap-1 border-b p-2 sm:w-36 sm:flex-col sm:border-r sm:border-b-0">
            {PRESETS.map((p) => (
              <Button
                key={p.id}
                type="button"
                size="sm"
                variant={draftPreset === p.id ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() =>
                  setDraft(p.days ? rangeFromDays(p.days) : emptyDateRange())
                }
              >
                {p.label}
              </Button>
            ))}
          </div>
          <Calendar
            mode="range"
            defaultMonth={draftRange?.from ?? subDays(new Date(), 30)}
            selected={draftRange}
            onSelect={onSelect}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
          />
        </div>
        <div className="flex items-center justify-between gap-2 border-t p-3">
          <span className="truncate text-xs text-muted-foreground">
            {labelFor(draft, draftPreset)}
          </span>
          <div className="flex shrink-0 gap-2">
            <Button type="button" variant="outline" onClick={reset}>
              Reset
            </Button>
            <Button type="button" onClick={apply}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
