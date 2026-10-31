import type { Metadata } from "next";
import { SiteExperience } from "@/components/SiteExperience";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "After Hours · Off the Clock",
  description:
    "Off the clock with Sai Uttej Rajoju: Formula 1 start-lights reflex test, mate-in-one chess puzzles, and links to Letterboxd, MyAnimeList, and Goodreads.",
  path: "/space",
});

export default function SpacePage() {
  return <SiteExperience initialRoom="space" />;
}
