import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "7GUIs - Next.js",
  description: "Implement the 7GUIs in React/Next.js",
};

export default function RootLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en">
    <body>
    <div className="drawer drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle"/>
      <div className="drawer-content">
        <main className={"p-4"}>
          {children}
        </main>
      </div>
      <div className="drawer-side">
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <li><Link href={"/1_counter"}>1. Counter</Link></li>
          <li><Link href={"/2_temperature_converter"}>2. Temperature Converter</Link></li>
        </ul>
      </div>
    </div>
    </body>
    </html>
  );
}
