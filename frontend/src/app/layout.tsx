import type { Metadata } from "next";
import "./globals.css";
import { WorldClassFooter } from "@/components/WorldClassFooter";

export const metadata: Metadata = {
  title: "LifeEvent AI — Financial Journeys in Medical Emergencies",
  description:
    "One guided deterministic financial journey connecting insurance, lending, and payments for Indian families in medical crises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white font-sans">
        <main className="flex-grow">{children}</main>
        <WorldClassFooter />
      </body>
    </html>
  );
}
