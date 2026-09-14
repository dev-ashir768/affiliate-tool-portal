"use client";

import { useEffect, useState } from "react";
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

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setReady(true);
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    applyTheme(next);
    setDark(next);
  }

  const label = dark ? "Switch to light mode" : "Switch to dark mode";

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
          {ready ? (
            dark ? (
              <SunIcon className="size-5" />
            ) : (
              <MoonIcon className="size-5" />
            )
          ) : (
            <MoonIcon className="size-5 opacity-0" />
          )}
        </TooltipTrigger>
        <TooltipContent side="bottom">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
