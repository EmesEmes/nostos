import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Panel · NOSTOS", template: "%s · Panel NOSTOS" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-paper-alt">{children}</div>;
}
