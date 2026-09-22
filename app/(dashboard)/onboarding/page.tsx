import { Suspense } from "react";
import { OnboardingPageContent } from "@/components/onboarding/onboarding-page-content";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Choose a plan",
  description: "Subscribe to unlock Tiksly product features",
};

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-10">
          <Skeleton className="h-16 w-full max-w-xl" />
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        </div>
      }
    >
      <OnboardingPageContent />
    </Suspense>
  );
}
