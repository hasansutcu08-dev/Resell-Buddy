import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resell Buddy",
  description: "Subscription-based marketplace monitoring for resellers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#fafafa", color: "#111" }}>{children}</body>
    </html>
  );
}
