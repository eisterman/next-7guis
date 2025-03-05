import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "7GUIs - Next.js",
  description: "Implement the 7GUIs in React/Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
