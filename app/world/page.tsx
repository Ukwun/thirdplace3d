import type { Metadata } from "next";
import WorldCanvas from "@/src/components/world/WorldCanvas";

export const metadata: Metadata = {
  title: "The Neighbourhood | THIRDPLACE",
  description: "Take a walk through a small Abuja neighborhood in THIRDPLACE.",
};

export default function WorldPage() {
  return <WorldCanvas />;
}
