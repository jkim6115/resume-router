import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Router",
  description: "Company-specific resume delivery app",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
