import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Caveat, Instrument_Sans, JetBrains_Mono, Mr_Dafoe, Press_Start_2P } from "next/font/google";
import { profile } from "@/content/profile";
import { loaderBootScript } from "@/lib/intro";
import { Providers } from "@/components/ui/Providers";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-bricolage" });
const instrument = Instrument_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-instrument" });
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-caveat" });
const dafoe = Mr_Dafoe({ subsets: ["latin"], weight: "400", variable: "--font-dafoe" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-jetbrains" });
const pixel = Press_Start_2P({ subsets: ["latin"], weight: "400", variable: "--font-pixel" });

export const metadata: Metadata = {
  title: profile.seo.title,
  description: profile.seo.description,
  openGraph: { title: profile.seo.title, description: profile.seo.description, type: "website" },
};

export const viewport: Viewport = { themeColor: "#f4f2ec" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  const fonts = [bricolage, instrument, caveat, dafoe, jetbrains, pixel].map((f) => f.variable).join(" ");
  return (
    <html lang="en" className={fonts} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderBootScript }} />
        <link rel="preload" as="image" href="/assets/avatar/boy.webp" />
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
