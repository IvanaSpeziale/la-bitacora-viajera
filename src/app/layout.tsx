import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { AuthProvider } from "@/core/pods/auth/auth.provider";
import { AppShell } from "./appShell";
import { NextDestinationProvider } from "@/pods/home/next-destination-countdown/nextDestination.provider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La bitácora viajera",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* <NextDestinationProvider> */}
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
        {/* </NextDestinationProvider> */}
      </body>
    </html>
  );
}
