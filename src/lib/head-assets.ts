export interface HeadAsset {
  id: string;
  label: string;
  /** Path to the PNG/SVG image in /public/images/head-assets/ */
  src: string;
  /** Scale multiplier relative to detected head width (1.0 = exact head width) */
  scale: number;
  /** Vertical offset as fraction of head height (positive = up) */
  offsetY: number;
}

export const HEAD_ASSETS: HeadAsset[] = [
  {
    id: "tv-head",
    label: "TV Head",
    src: "/images/head-assets/tv-head.svg",
    scale: 1.6,
    offsetY: 0.1,
  },
  {
    id: "fishbowl",
    label: "Fishbowl",
    src: "/images/head-assets/fishbowl.svg",
    scale: 1.5,
    offsetY: 0.15,
  },
  {
    id: "alien",
    label: "Alien",
    src: "/images/head-assets/alien.svg",
    scale: 1.4,
    offsetY: 0.05,
  },
  {
    id: "astronaut",
    label: "Astronaut",
    src: "/images/head-assets/astronaut.svg",
    scale: 1.7,
    offsetY: 0.1,
  },
  {
    id: "disco-ball",
    label: "Disco Ball",
    src: "/images/head-assets/disco-ball.svg",
    scale: 1.3,
    offsetY: 0.1,
  },
  {
    id: "paper-bag",
    label: "Paper Bag",
    src: "/images/head-assets/paper-bag.svg",
    scale: 1.5,
    offsetY: 0.05,
  },
];
