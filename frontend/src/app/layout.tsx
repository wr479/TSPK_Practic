import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Роща славы — всероссийская программа благодарности",
  description:
    "Сообщество волонтеров, семей и компаний, объединённых желанием сохранять память и восстанавливать природу через посадку деревьев.",
  keywords: [
    "Роща славы",
    "всероссийская программа",
    "посадка деревьев",
    "патриотические проекты",
    "волонтерское движение",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} relative min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
