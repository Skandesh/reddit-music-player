import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Queue",
  description: "Manage your music queue. View, shuffle, and control your Reddit music playlist.",
};

export default function PlaylistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
