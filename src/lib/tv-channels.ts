export interface TVChannel {
  slug: string;
  label: string;
  number: string;
  videoSrc: string;
}

export const TV_CHANNELS: TVChannel[] = [
  { slug: "sketch",  label: "Sketch",  number: "CH-001", videoSrc: "/videos/ch-sketch.mp4" },
  { slug: "build",   label: "Build",   number: "CH-002", videoSrc: "/videos/ch-build.mp4" },
  { slug: "create",  label: "Create",  number: "CH-003", videoSrc: "/videos/ch-create.mp4" },
  { slug: "what-if", label: "What If", number: "CH-004", videoSrc: "/videos/ch-what-if.mp4" },
  { slug: "loading", label: "Loading", number: "CH-005", videoSrc: "/videos/ch-loading.mp4" },
  { slug: "globe",   label: "Globe",   number: "CH-006", videoSrc: "/videos/ch-globe.mp4" },
];

export const GLITCH_VIDEO_SRC = "/videos/ch-glitch.mp4";
export const DEFAULT_CHANNEL = "sketch";
export const LIVE_CHANNEL_SLUG = "__live__";
