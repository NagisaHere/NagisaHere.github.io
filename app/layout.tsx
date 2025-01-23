import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import Background from "./components/Background";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NagisaHere",
  description: "Welcome to my Website!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Background/>
        {children}
      </body>
    </html>
  );
}
