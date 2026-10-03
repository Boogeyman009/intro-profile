import type { Metadata } from "next";
import AdPage from "@/components/AdPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Manoj Kumar Tudu — Profile",
  description: "Software Developer, Manager — Backend Engineering, System Design, CI/CD",
};

export default function AdvertisementPage() {
  return <AdPage />;
}
