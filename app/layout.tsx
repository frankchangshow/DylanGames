import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chang Family Games",
  description: "Simple game launchers for the Chang family"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
