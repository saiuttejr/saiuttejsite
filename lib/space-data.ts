import { SITE_PROFILE } from "./site-data";

export interface SpacePhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** Photos of Sai in the hero, left to right. Whole frames, never cropped. */
export interface SpaceHeroCard extends SpacePhoto {
  id: "walk" | "tunnel" | "lanterns" | "seawall";
}

export const SPACE_HERO_CARDS: readonly SpaceHeroCard[] = [
  {
    id: "walk",
    src: "/images/space/me-walk.jpg",
    width: 506,
    height: 900,
    alt: "Sai from behind, walking down a wooden path between green hills",
  },
  {
    id: "tunnel",
    src: "/images/space/me-tunnel.jpg",
    width: 670,
    height: 890,
    alt: "Sai from behind, walking through a glowing blue aquarium tunnel",
  },
  {
    id: "lanterns",
    src: "/images/space/me-lanterns.jpg",
    width: 678,
    height: 900,
    alt: "Sai bending over with his face hidden, red lanterns hanging above",
  },
  {
    id: "seawall",
    src: "/images/space/me-seawall.jpg",
    width: 678,
    height: 900,
    alt: "Sai leaning on a sea wall with a domed hotel behind him",
  },
];

export type SpacePhotoShape = "portrait" | "wide" | "standard";

interface SpaceTileBase {
  id: string;
  /** CSS grid-column / grid-row of the 12-column wall. */
  col: string;
  row: string;
}

export interface SpacePhotoTile extends SpaceTileBase {
  kind: "photo";
  photo: SpacePhoto;
  shape: SpacePhotoShape;
  /** CSS object-position, so the crop keeps the interesting part. */
  position: string;
}

export interface SpaceCoversTile extends SpaceTileBase {
  kind: "covers";
  title: string;
  covers: readonly SpacePhoto[];
}

export interface SpaceChessTile extends SpaceTileBase {
  kind: "chess";
  href: string;
  handle: string;
}

export type SpaceTile = SpacePhotoTile | SpaceCoversTile | SpaceChessTile;

const photo = (name: string, width: number, height: number, alt: string): SpacePhoto => ({
  src: `/images/space/${name}.jpg`,
  width,
  height,
  alt,
});

const cover = (name: string, width: number, height: number, alt: string): SpacePhoto => ({
  src: `/images/space/covers/${name}.jpg`,
  width,
  height,
  alt,
});

/** Reading order is also the order on small screens, where the wall is two columns. */
export const SPACE_TILES: readonly SpaceTile[] = [
  {
    kind: "photo",
    id: "golden-sky",
    col: "1 / 4",
    row: "1 / 5",
    shape: "portrait",
    position: "50% 30%",
    photo: photo("golden-sky", 788, 1400, "Orange and peach clouds over tea hills at sunset"),
  },
  {
    kind: "photo",
    id: "blue-vidhana",
    col: "4 / 10",
    row: "1 / 3",
    shape: "wide",
    position: "50% 82%",
    photo: photo("blue-vidhana", 1400, 885, "A grand stone government building under a blue sky"),
  },
  {
    kind: "photo",
    id: "dusk-city",
    col: "4 / 10",
    row: "3 / 5",
    shape: "wide",
    position: "50% 45%",
    photo: photo("dusk-city", 1400, 788, "A city at dusk seen from a footbridge, railway lines below"),
  },
  {
    kind: "photo",
    id: "red-museum",
    col: "10 / 13",
    row: "1 / 5",
    shape: "portrait",
    position: "50% 45%",
    photo: photo("red-museum", 788, 1400, "A red brick museum against a blue sky"),
  },
  {
    kind: "covers",
    id: "watching",
    col: "1 / 4",
    row: "5 / 7",
    title: "Watching",
    covers: [
      cover("monster", 240, 330, "Monster"),
      cover("byousoku", 240, 340, "5 Centimeters per Second"),
      cover("naruto", 240, 339, "Naruto"),
    ],
  },
  {
    kind: "covers",
    id: "reading",
    col: "1 / 4",
    row: "7 / 9",
    title: "Reading",
    covers: [
      cover("whitenights", 240, 348, "White Nights"),
      cover("ackroyd", 226, 360, "The Murder of Roger Ackroyd"),
      cover("mockingbird", 230, 360, "To Kill a Mockingbird"),
    ],
  },
  {
    kind: "photo",
    id: "pink-wires",
    col: "4 / 10",
    row: "5 / 7",
    shape: "wide",
    position: "50% 92%",
    photo: photo("pink-wires", 1400, 1145, "Power lines against a pale pink dusk sky"),
  },
  {
    kind: "photo",
    id: "noodles",
    col: "4 / 10",
    row: "7 / 9",
    shape: "wide",
    position: "50% 55%",
    photo: photo("noodles", 1400, 887, "Two bowls of noodles on a red tray"),
  },
  {
    kind: "photo",
    id: "day-birds",
    col: "10 / 13",
    row: "5 / 9",
    shape: "portrait",
    position: "50% 38%",
    photo: photo("day-birds", 788, 1400, "Birds flying across a big blue sky with clouds"),
  },
  {
    kind: "photo",
    id: "night-temple",
    col: "1 / 4",
    row: "9 / 13",
    shape: "portrait",
    position: "50% 58%",
    photo: photo("night-temple", 788, 1400, "A gold-lit temple and its reflection at night"),
  },
  {
    kind: "photo",
    id: "night-lanterns",
    col: "4 / 10",
    row: "9 / 13",
    shape: "wide",
    position: "50% 35%",
    photo: photo(
      "night-lanterns",
      1400,
      1095,
      "Red lanterns hanging under a glass roof at night"
    ),
  },
  {
    kind: "photo",
    id: "golden-hills",
    col: "10 / 13",
    row: "9 / 11",
    shape: "standard",
    position: "50% 30%",
    photo: photo("golden-hills", 1400, 788, "Low sun over terraced tea hills"),
  },
  {
    kind: "chess",
    id: "lichess",
    col: "10 / 13",
    row: "11 / 13",
    href: SITE_PROFILE.links.lichess,
    handle: SITE_PROFILE.links.lichess.split("/").pop() ?? "Lichess",
  },
];

export type SpaceWindowId = "letterboxd" | "lichess" | "myanimelist" | "goodreads" | "email";

export interface SpaceWindow {
  id: SpaceWindowId;
  label: string;
  href: string;
  external: boolean;
}

/** One lit window per link in the building at the bottom of the page. */
export const SPACE_WINDOWS: readonly SpaceWindow[] = [
  { id: "letterboxd", label: "Letterboxd", href: SITE_PROFILE.links.letterboxd, external: true },
  { id: "lichess", label: "Lichess", href: SITE_PROFILE.links.lichess, external: true },
  { id: "myanimelist", label: "MyAnimeList", href: SITE_PROFILE.links.myanimelist, external: true },
  { id: "goodreads", label: "Goodreads", href: SITE_PROFILE.links.goodreads, external: true },
  {
    id: "email",
    label: SITE_PROFILE.links.emailAddress,
    href: SITE_PROFILE.links.email,
    external: false,
  },
];
