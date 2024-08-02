/**
 * Imports
 */
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import dynamic from "next/dynamic";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
const Header = dynamic(() => import("@/components/header"), { ssr: false });

/**
 * Metadata
 */
export const metadata: Metadata = {
  title: "Star Wars | Planets",
  icons: {
    icon: "/favicon.ico",
  },
};

/**
 * Viewport
 */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

/**
 * Component
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <Header />
                {children}
              </section>
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <div className="flex items-center gap-1 text-current">
                <span className="text-default-600">Developed</span>
                <p className="text-primary">João Azevedo</p>
                <span className="text-default-600">to</span>
                <p className="text-primary">Lumenalta</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
