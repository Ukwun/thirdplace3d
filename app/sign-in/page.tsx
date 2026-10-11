import type { Metadata } from "next";
import PlaceholderPage from "@/src/components/landing/PlaceholderPage";

export const metadata: Metadata = { title: "Sign In | THIRDPLACE" };

export default function SignInPage() {
  return (
    <PlaceholderPage
      eyebrow="ACCOUNT ACCESS"
      title="Your account is not connected yet."
      description="Sign in is not available in this prototype because authentication has not been configured."
      note="No account details are requested or stored here. You can still walk through the local neighbourhood as a guest."
    />
  );
}
