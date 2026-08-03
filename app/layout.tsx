import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sanaresolutions.ca"),
  title: "Sanare Solutions | Practical AI and Business Automation",
  description:
    "Tailored AI consulting, workflow automation, Microsoft 365 and Google Workspace solutions, email automation, and team training for growing organizations.",
  alternates: { canonical: "/" },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://sanaresolutions.ca",
    siteName: "Sanare Solutions",
    title: "Sanare Solutions | Practical AI and Business Automation",
    description:
      "Practical AI consulting and automation designed around your people, processes, and existing technology.",
    images: [
      {
        url: "/og.png",
        width: 1733,
        height: 909,
        alt: "Sanare Solutions — Practical AI built around your business",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanare Solutions | Practical AI and Business Automation",
    description:
      "Practical AI consulting and automation designed around your business.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B211B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <body>{children}</body>
    </html>
  );
}
