import { redirect } from "next/navigation";

/** Fallback if proxy does not run — prefer session-aware redirect in proxy.ts. */
export default function RootPage() {
  redirect("/login");
}
