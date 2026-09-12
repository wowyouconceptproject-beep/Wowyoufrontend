import type { Metadata } from "next";

import {
  Inter,
  Space_Grotesk,
} from "next/font/google";

import "./globals.css";
import "./react-datepicker.css";

const inter = Inter({
  subsets: ["latin"],

  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],

  variable: "--font-number",
});

export const metadata: Metadata = {
  title: "WowYou EventTech",

  description:
    "Create, sell, manage and operate professional events from one intelligent platform.",

  themeColor: "#072933",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="bg-background"
    >
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} bg-background text-white`}
      >
        {children}
      </body>
    </html>
  );
}