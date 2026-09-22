"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BillingSuccessPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    toast.success("Payment successful — unlocking your workspace");
    let cancelled = false;

    async function syncSession() {
      try {
        await fetch("/api/auth/refresh", { method: "POST" });
      } catch {
        // Cookie may still refresh on next navigation via proxy.
      }
      if (cancelled) return;
      await queryClient.invalidateQueries({ queryKey: ["org", "current"] });
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      router.refresh();
    }

    void syncSession();
    return () => {
      cancelled = true;
    };
  }, [queryClient, router]);

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>You are subscribed</CardTitle>
        <CardDescription>
          Thank you. Your trial or plan is activating. Open the dashboard once
          Stripe confirms — usually within a few seconds.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Link href="/home" className={buttonVariants()}>
          Go to dashboard
        </Link>
        <Link
          href="/billing"
          className={buttonVariants({ variant: "outline" })}
        >
          Manage billing
        </Link>
      </CardContent>
    </Card>
  );
}
