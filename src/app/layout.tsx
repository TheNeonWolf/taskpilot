import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskPilot",
  description: "AI-powered project and task management platform",
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