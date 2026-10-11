"use client";

import Link from "next/link";

export default function WorldRouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{ minHeight: "100dvh", display: "grid", placeContent: "center", gap: 14, padding: 24, background: "#e6e8d9", color: "#27483c", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ margin: 0, fontSize: 22 }}>We couldn’t open the neighborhood</h1>
      <p style={{ margin: 0, color: "#697a6d" }}>Something interrupted the world. Give it another try.</p>
      <button type="button" onClick={reset} style={{ justifySelf: "center", minHeight: 42, padding: "0 18px", border: 0, borderRadius: 12, color: "white", background: "#50755e", fontWeight: 700, cursor: "pointer" }}>Try again</button>
      <Link href="/" style={{ color: "#50755e" }}>Return to menu</Link>
    </main>
  );
}
