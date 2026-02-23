import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
