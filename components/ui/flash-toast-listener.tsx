"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { consumeFlashToast } from "@/lib/ui/flash-toast";

/** Shows one-shot toasts set before a hard navigation (e.g. post-login). */
export function FlashToastListener() {
  useEffect(() => {
    const flash = consumeFlashToast();
    if (!flash) return;
    if (flash.type === "success") toast.success(flash.message);
    else if (flash.type === "error") toast.error(flash.message);
    else toast.message(flash.message);
  }, []);

  return null;
}
