"use client";

import { useMemo, useState } from "react";
import { KeyRoundIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useGrantPlatformOrganizationAccess,
  usePlatformPlans,
} from "@/hooks/use-platform";

const GRANT_SUCCESS_MESSAGE =
  "Access granted. Merchant may need to sign in again to pick up access.";

export function GrantAccessDialog({ organizationId }: { organizationId: string }) {
  const grant = useGrantPlatformOrganizationAccess();
  const plansQuery = usePlatformPlans();
  const [open, setOpen] = useState(false);
  const [planCode, setPlanCode] = useState("");
  const [periodEndLocal, setPeriodEndLocal] = useState("");
  const [note, setNote] = useState("");

  const grantablePlans = useMemo(() => {
    const plans = plansQuery.data?.plans ?? [];
    return plans.filter((p) => p.code !== "free" && p.active);
  }, [plansQuery.data?.plans]);

  function resetForm() {
    setPlanCode("");
    setPeriodEndLocal("");
    setNote("");
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetForm();
  }

  async function onSubmit() {
    if (!planCode) {
      toast.error("Select a plan");
      return;
    }
    const trimmedNote = note.trim();
    const currentPeriodEnd = periodEndLocal.trim()
      ? new Date(periodEndLocal).toISOString()
      : null;
    try {
      await grant.mutateAsync({
        id: organizationId,
        body: {
          planCode,
          currentPeriodEnd,
          ...(trimmedNote ? { note: trimmedNote } : {}),
        },
      });
      toast.success(GRANT_SUCCESS_MESSAGE);
      handleOpenChange(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to grant access");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button type="button" variant="outline" size="sm" />}
      >
        <KeyRoundIcon data-icon="inline-start" />
        Grant access
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Grant complimentary access</DialogTitle>
          <DialogDescription>
            Assign a paid plan without Stripe billing. Optional end date limits
            how long access lasts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="grant-plan"
              className="text-xs font-medium text-muted-foreground"
            >
              Plan
            </label>
            <Select
              value={planCode || undefined}
              onValueChange={(value) => setPlanCode(value ?? "")}
              disabled={plansQuery.isLoading || grantablePlans.length === 0}
            >
              <SelectTrigger id="grant-plan" className="w-full">
                <SelectValue placeholder="Select plan…" />
              </SelectTrigger>
              <SelectContent>
                {grantablePlans.map((p) => (
                  <SelectItem key={p.id} value={p.code}>
                    {p.name} ({p.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="grant-period-end"
              className="text-xs font-medium text-muted-foreground"
            >
              Access ends (optional)
            </label>
            <Input
              id="grant-period-end"
              type="datetime-local"
              value={periodEndLocal}
              onChange={(e) => setPeriodEndLocal(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="grant-note"
              className="text-xs font-medium text-muted-foreground"
            >
              Note (optional)
            </label>
            <Textarea
              id="grant-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Reason or ticket reference"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={grant.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={grant.isPending || !planCode}
            onClick={() => void onSubmit()}
          >
            {grant.isPending ? "Granting…" : "Grant access"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
