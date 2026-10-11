import type { Metadata } from "next";
import PlaceholderPage from "@/src/components/landing/PlaceholderPage";

export const metadata: Metadata = { title: "Community | THIRDPLACE" };

export default function CommunityPage() {
  return (
    <PlaceholderPage
      eyebrow="COMMUNITY"
      title="The neighbourhood is quiet for now."
      description="The world is being prepared as a welcoming place to meet, wander, and spend time together."
      note="Multiplayer, chat, and community spaces are not connected in this local prototype yet. For now, you can explore the neighbourhood on your own."
    />
  );
}
