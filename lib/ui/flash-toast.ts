const KEY = "tiksly:flash-toast";

export type FlashToast = {
  message: string;
  type: "success" | "error" | "message";
};

export function setFlashToast(toast: FlashToast) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(toast));
  } catch {
    // ignore quota / private mode
  }
}

export function consumeFlashToast(): FlashToast | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const parsed = JSON.parse(raw) as FlashToast;
    if (!parsed?.message || typeof parsed.message !== "string") return null;
    if (
      parsed.type !== "success" &&
      parsed.type !== "error" &&
      parsed.type !== "message"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
