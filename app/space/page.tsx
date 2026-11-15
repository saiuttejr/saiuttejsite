import type { Metadata, Viewport } from "next";
import { SiteExperience } from "@/components/SiteExperience";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Space",
  description:
    "Photos, films, books and chess from Sai Uttej Rajoju, plus Letterboxd, Lichess, MyAnimeList, and Goodreads.",
  path: "/space",
});

export const viewport: Viewport = {
  themeColor: "#6a3d45",
};

export default function SpacePage() {
  return <SiteExperience initialRoom="space" />;
}
