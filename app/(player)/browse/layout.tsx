import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Subreddits",
  description: "Discover music communities on Reddit. Browse and select subreddits to create your perfect music playlist.",
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
