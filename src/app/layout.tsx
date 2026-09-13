import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { PROFILE } from "@/content/profile";
import "@/styles/globals.css";

// Loaded here rather than via a CSS @import: kills a render-blocking request
// and avoids fighting `@import "tailwindcss"` for @import ordering.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

const title = `${PROFILE.name} — ${PROFILE.title}`;

export const metadata: Metadata = {
  title: {
    default: title,
    template: `%s · ${PROFILE.name}`,
  },
  description: PROFILE.summary,
  keywords: [
    "Full Stack Software Engineer",
    ".NET 9",
    "ASP.NET Core",
    "React",
    "TypeScript",
    "SQL Server",
    "Azure",
    "RabbitMQ",
    "Redis",
    "ERP",
  ],
  authors: [{ name: PROFILE.name }],
  openGraph: {
    title,
    description: PROFILE.summary,
    type: "website",
    siteName: PROFILE.name,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: PROFILE.summary,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0f14",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
