import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "@/shared/style/globals.css";
import { AuthProvider } from "@/module/guard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeuroShield - Sistema de Detección y Gestión de Fraudes",
  description: "NeuroShield - Sistema de Detección y Gestión de Fraudes",
  generator: "NeuroShield - Sistema de Detección y Gestión de Fraudes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
