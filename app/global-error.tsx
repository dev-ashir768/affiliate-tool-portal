"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#111",
          color: "#fff",
        }}
      >
        <div style={{ textAlign: "center", padding: 24, maxWidth: 420 }}>
          <h1 style={{ fontSize: 22, marginBottom: 8 }}>
            This page couldn&apos;t load
          </h1>
          <p style={{ opacity: 0.75, marginBottom: 20, fontSize: 14 }}>
            Reload to try again, or go back to the home screen.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: "#fff",
                color: "#111",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => {
                window.location.assign("/");
              }}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #666",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
