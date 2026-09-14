"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.classList.toggle("light", !dark);
  localStorage.setItem("theme", dark ? "dark" : "light");
}

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  function toggle() {
    applyTheme(!document.documentElement.classList.contains("dark"));
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          delay={200}
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={label}
              className="text-topbar-foreground hover:bg-topbar-accent hover:text-topbar-accent-foreground"
            />
          }
        >
          {dark ? (
            <SunIcon className="size-5" />
          ) : (
            <MoonIcon className="size-5" />
          )}
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
