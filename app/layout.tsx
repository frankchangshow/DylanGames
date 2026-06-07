import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chang Brother Games",
  description: "Simple game launchers for Dylan and Brayden"
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
