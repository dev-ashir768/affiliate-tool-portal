/**
 * After a deploy, tabs opened on the previous build request JS chunks that no
 * longer exist. Detect that and do one hard reload to pick up the new build.
 */
const RELOAD_KEY = "chunk-reload-at";

export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "ChunkLoadError" ||
    /Loading chunk [\w-]+ failed|Failed to load chunk|Failed to fetch dynamically imported module|Importing a module script failed/i.test(
      error.message,
    )
  );
}

/** Reload once per minute at most, so a genuinely broken build cannot loop. */
export function reloadForNewBuild(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < 60_000) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // Storage blocked — still try a single reload.
  }
  window.location.reload();
  return true;
}
