"use client";

import { useEffect } from "react";
import Link from "next/link";
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

  useEffect(() => {
    toast.success("Payment successful — plan updating");
    void queryClient.invalidateQueries({ queryKey: ["org", "current"] });
    void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  }, [queryClient]);

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Payment successful</CardTitle>
        <CardDescription>
          Thank you for subscribing. Your plan limits may take a moment to
          update after Stripe confirms the subscription.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Link href="/billing" className={buttonVariants()}>
          Back to billing
        </Link>
        <Link href="/home" className={buttonVariants({ variant: "outline" })}>
          Go to dashboard
        </Link>
      </CardContent>
    </Card>
  );
}
