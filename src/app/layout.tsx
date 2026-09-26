import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getSessionUser } from "@/lib/auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Campus Geeks — what's happening around campus",
    template: "%s · Campus Geeks",
  },
  description:
    "Discover matches, trips, movie nights, workshops and society events happening around campus this week.",
  openGraph: {
    type: "website",
    siteName: "Campus Geeks",
    title: "Campus Geeks — what's happening around campus",
    description:
      "Discover matches, trips, movie nights, workshops and society events happening around campus this week.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <SiteHeader user={user} />
        <main className="min-h-screen pt-16 md:pt-20">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
