import type { Metadata } from "next";
import BrochureAdmin from "@/components/brochure/BrochureAdmin";

export const metadata: Metadata = {
  title: "Panel de informes privados · Quiroz Automotriz",
  robots: { index: false, follow: false, nocache: true },
};

export default function InformeAdminPage() {
  return <BrochureAdmin />;
}
