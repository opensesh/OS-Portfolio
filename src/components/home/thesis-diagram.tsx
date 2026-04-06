"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// SVG path data (inlined from unmarked SVGs — 700x700 viewBox)
// ---------------------------------------------------------------------------

// Before: 3 cream circles + 1 orange connector blob
const BEFORE_PATHS = [
  // Top-right cream circle (Design + Creative)
  {
    d: "M556.151 286.8C620.173 286.8 672.072 234.91 672.072 170.9C672.072 106.89 620.173 55 556.151 55C492.13 55 440.23 106.89 440.23 170.9C440.23 234.91 492.13 286.8 556.151 286.8Z",
    fill: "#FFFAEE",
  },
  // Bottom cream circle (Builders + Engineers)
  {
    d: "M350.444 645C414.466 645 466.365 593.11 466.365 529.1C466.365 465.091 414.466 413.2 350.444 413.2C286.423 413.2 234.523 465.091 234.523 529.1C234.523 593.11 286.423 645 350.444 645Z",
    fill: "#FFFAEE",
  },
  // Top-left cream circle (Product + Marketing)
  {
    d: "M143.921 286.8C207.942 286.8 259.842 234.91 259.842 170.9C259.842 106.89 207.942 55 143.921 55C79.8995 55 28 106.89 28 170.9C28 234.91 79.8995 286.8 143.921 286.8Z",
    fill: "#FFFAEE",
  },
  // Central orange blob (Brand connector)
  {
    d: "M478.471 311.814C469.609 311.571 461.21 313.447 453.745 316.979C448.27 319.57 442.121 314.933 443.218 308.98C444.241 303.425 444.777 297.691 444.777 291.844C444.777 251.911 419.881 217.793 384.766 204.149C379.25 202.005 378.316 194.704 383.068 191.188C396.333 181.345 404.959 165.614 405.056 147.852C405.219 118.404 381.476 93.9264 352.031 93.2279C321.416 92.5051 296.373 117.097 296.373 147.544C296.373 165.467 305.056 181.353 318.443 191.245C323.162 194.737 322.147 202.03 316.672 204.149C281.549 217.785 256.652 251.911 256.652 291.844C256.652 297.699 257.188 303.425 258.212 308.98C259.309 314.933 253.16 319.57 247.685 316.979C240.22 313.447 231.821 311.571 222.959 311.814C194.155 312.61 170.77 336.146 170.169 364.952C169.511 396.163 195.179 421.542 226.5 420.421C253.996 419.43 276.626 397.681 278.681 370.255C278.698 370.069 278.706 369.874 278.722 369.687C279.112 363.653 286.154 360.502 290.817 364.359C307.087 377.816 327.955 385.905 350.723 385.905C373.491 385.905 394.359 377.816 410.629 364.359C415.291 360.502 422.334 363.653 422.724 369.687C422.74 369.874 422.748 370.069 422.764 370.255C424.819 397.689 447.449 419.438 474.945 420.421C506.259 421.55 531.935 396.163 531.277 364.952C530.668 336.154 507.282 312.61 478.487 311.814H478.471Z",
    fill: "#FE5102",
  },
];

// After: single large orange blob
const AFTER_PATH = {
  d: "M649.467 466.677C615.644 443.586 573.486 442.126 539.292 459.207C527.93 464.88 515.013 455.207 516.867 442.622C518.059 434.497 518.686 426.177 518.686 417.716C518.686 346.665 475.063 285.826 413.199 260.656C401.581 255.929 400.036 240.078 410.409 233.015C439.536 213.208 458.606 179.656 458.35 141.652C457.944 82.4245 409.933 33.8884 350.868 33.0122C289.835 32.1094 240.076 81.4332 240.076 142.404C240.076 180.293 259.287 213.677 288.475 233.308C298.822 240.264 297.127 256.115 285.597 260.85C224.007 286.154 180.623 346.85 180.623 417.707C180.623 426 181.223 434.16 182.371 442.135C184.189 454.711 171.291 464.155 159.884 458.605C125.875 442.064 84.221 443.71 50.7246 466.571C0.903681 500.574 -11.9864 568.635 21.9339 618.578C55.8541 668.521 123.747 681.443 173.568 647.439C202.686 627.561 219.196 596.054 221.111 563.333C221.844 550.783 236.403 544.119 246.326 551.81C274.896 573.963 310.732 587.15 349.65 587.15C388.567 587.15 424.986 573.75 453.662 551.27C463.709 543.393 478.356 550.164 479.045 562.935C480.819 595.832 497.338 627.552 526.605 647.528C576.426 681.54 644.32 668.627 678.249 618.684C712.178 568.741 699.296 500.681 649.476 466.668L649.467 466.677Z",
  fill: "#FE5102",
};

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const svgVariants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const } },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface ThesisDiagramProps {
  activeState: "past" | "future";
  className?: string;
}

export function ThesisDiagram({ activeState, className }: ThesisDiagramProps) {
  const isPast = activeState === "past";

  return (
    <div className={cn("relative w-full aspect-square max-w-[560px] mx-auto", className)}>
      {/* Ambient glow behind SVG */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: isPast
            ? "radial-gradient(circle at 50% 50%, rgba(254,81,2,0.12) 0%, rgba(254,81,2,0.04) 40%, transparent 70%)"
            : "radial-gradient(circle at 50% 55%, rgba(254,81,2,0.2) 0%, rgba(254,81,2,0.08) 45%, transparent 75%)",
        }}
        animate={{
          opacity: [0.7, 1, 0.7],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* SVG diagram */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeState}
          variants={svgVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative w-full h-full"
        >
          <svg
            viewBox="0 0 700 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            role="img"
            aria-label={
              isPast
                ? "Diagram showing disconnected departments sharing brand materials"
                : "Diagram showing brand as the unified container for all content"
            }
          >
            {/* Glow filter */}
            <defs>
              <filter id={`glow-${activeState}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Blurred glow layer */}
            {isPast ? (
              <g opacity="0.25" filter={`url(#glow-${activeState})`}>
                {BEFORE_PATHS.filter((p) => p.fill === "#FE5102").map((path, i) => (
                  <path key={i} d={path.d} fill={path.fill} />
                ))}
              </g>
            ) : (
              <g opacity="0.3" filter={`url(#glow-${activeState})`}>
                <path d={AFTER_PATH.d} fill={AFTER_PATH.fill} />
              </g>
            )}

            {/* Main paths */}
            {isPast ? (
              BEFORE_PATHS.map((path, i) => (
                <path key={i} d={path.d} fill={path.fill} />
              ))
            ) : (
              <path d={AFTER_PATH.d} fill={AFTER_PATH.fill} />
            )}
          </svg>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
