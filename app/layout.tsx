import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Fastbreak Event Dashboard",
  description: "Sports Event Management Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-stone-100 text-gray-900">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
