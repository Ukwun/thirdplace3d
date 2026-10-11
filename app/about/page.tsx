import type { Metadata } from "next";
import PlaceholderPage from "@/src/components/landing/PlaceholderPage";

export const metadata: Metadata = { title: "About | THIRDPLACE" };

export default function AboutPage() {
  return (
    <PlaceholderPage
      eyebrow="WHY THIRDPLACE"
      title="A place between places."
      description="THIRDPLACE is being shaped as a calmer way to spend time in a shared virtual neighbourhood inspired by Nigerian city life."
      note="This first local build is a small, single-player walk through an Abuja-inspired block. It is the beginning of the world, not a connected social experience yet."
    />
  );
}
