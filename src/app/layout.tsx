import type { Metadata } from "next";
import { Noto_Sans, Mukta } from "next/font/google"; // Import standard Google Fonts
import "./globals.css";
import { SatyaHeader } from "@/components/SatyaHeader";
import { GovFooter } from "@/components/GovFooter";
import { AccessibilityWrapper } from "@/components/AccessibilityWrapper";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TabProvider } from "@/contexts/TabContext";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["300", "400", "500", "600", "700", "800"], // Comprehensive weights
});

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  variable: "--font-mukta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Official Government Fact Check Portal",
  description: "Official portal to verify news and combat misinformation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${mukta.variable} font-sans antialiased bg-[#fbfaf9]`}>
        <LanguageProvider>
          <TabProvider>
            <AccessibilityWrapper>
              <noscript>
                <div className="bg-red-600 text-white p-4 text-center font-bold">
                  JavaScript is disabled in your browser. Some features of the S.A.T.Y.A portal (AI verification, Voice, Contrast mode) require JavaScript to function.
                </div>
              </noscript>
              <SatyaHeader />
              {children}
              <GovFooter />
            </AccessibilityWrapper>
          </TabProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
