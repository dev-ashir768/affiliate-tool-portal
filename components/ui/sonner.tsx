"use client";

import { useSyncExternalStore } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onStoreChange);
  return () => {
    observer.disconnect();
    mq.removeEventListener("change", onStoreChange);
  };
}

function getTheme(): NonNullable<ToasterProps["theme"]> {
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getServerTheme(): NonNullable<ToasterProps["theme"]> {
  return "light";
}

/** Brand-token overrides — beat Sonner’s default HSL richColors. */
function brandToastVars(theme: "light" | "dark"): React.CSSProperties {
  const warning =
    theme === "dark"
      ? {
          "--warning-bg": "oklch(0.28 0.04 85)",
          "--warning-border": "oklch(0.35 0.06 85)",
          "--warning-text": "oklch(0.85 0.08 85)",
        }
      : {
          "--warning-bg": "oklch(0.97 0.04 85)",
          "--warning-border": "oklch(0.9 0.08 85)",
          "--warning-text": "oklch(0.5 0.12 55)",
        };

  return {
    "--normal-bg": "var(--popover)",
    "--normal-bg-hover": "var(--accent)",
    "--normal-border": "var(--border)",
    "--normal-border-hover": "var(--border)",
    "--normal-text": "var(--popover-foreground)",
    "--border-radius": "var(--radius)",
    "--success-bg": "color-mix(in oklch, var(--primary) 12%, var(--popover))",
    "--success-border":
      "color-mix(in oklch, var(--primary) 28%, var(--border))",
    "--success-text": "var(--primary)",
    "--info-bg": "color-mix(in oklch, var(--secondary) 8%, var(--popover))",
    "--info-border": "color-mix(in oklch, var(--secondary) 20%, var(--border))",
    "--info-text": "var(--secondary)",
    ...warning,
    "--error-bg":
      "color-mix(in oklch, var(--destructive) 12%, var(--popover))",
    "--error-border":
      "color-mix(in oklch, var(--destructive) 28%, var(--border))",
    "--error-text": "var(--destructive)",
  } as React.CSSProperties;
}

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={brandToastVars(theme)}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "cn-toast group-[.toaster]:border-border group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:shadow-lg",
          title: "group-[.toast]:text-sm group-[.toast]:font-medium",
          description:
            "group-[.toast]:text-sm group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton:
            "group-[.toast]:border-border group-[.toast]:bg-popover group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
