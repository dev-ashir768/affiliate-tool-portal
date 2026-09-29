import Link from "next/link";
import { pageMetadata } from "@/lib/site-metadata";

export const metadata = pageMetadata({
  title: "Checkout canceled",
  description:
    "Your Stripe checkout was canceled. You can return to billing anytime to subscribe to Tiksly.",
});
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BillingCancelPage() {
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Checkout cancelled</CardTitle>
        <CardDescription>
          No changes were made to your subscription. You can return to billing
          to choose a plan when you are ready.
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
