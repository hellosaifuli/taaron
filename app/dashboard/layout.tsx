import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track your Taaron orders.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
