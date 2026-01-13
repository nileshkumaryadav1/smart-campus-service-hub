import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import ClientWrapper from "./client-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Campus Service Hub - Katihar Engineering College",
  description:
    "A unified digital platform for managing campus events, notices, lost & found, and student issues — with real-time admin control.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
