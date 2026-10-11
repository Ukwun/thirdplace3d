import type { Metadata } from "next";
import WelcomeScreen from "@/src/components/landing/WelcomeScreen";

export const metadata: Metadata = {
  title: "THIRDPLACE | A place between places",
  description: "Take a breath. Take a walk. Find your own little corner of the neighbourhood.",
};

export default function Home() {
  return <WelcomeScreen />;
}
