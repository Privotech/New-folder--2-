import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrivoKeep - Your Personal Notes",
  description:
    "Your Personal Note-Taking and Task Management Platform built with Next.js, TypeScript, and Tailwind CSS",
  openGraph: {
    title: "PrivoKeep",
    description:
      "Your Personal Note-Taking and Task Management Platform built with Next.js, TypeScript, and Tailwind CSS",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
