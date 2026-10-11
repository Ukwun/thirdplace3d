export default function WorldLoading() {
  return (
    <main
      role="status"
      aria-live="polite"
      style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#d3e0d5", color: "#284b3f", fontFamily: "Arial, sans-serif" }}
    >
      Warming up the neighborhood…
    </main>
  );
}
