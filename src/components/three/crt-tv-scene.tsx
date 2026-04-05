"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { CRTTVModel } from "./crt-tv-model";
import { devProps } from "@/utils/dev-props";

// Responsive camera distances — canvas is always full viewport width.
// Horizontal positioning is handled by CSS translateX on the canvas container;
// camera stays centered (xOffset: 0) and only controls zoom.
function getCameraDistances(width: number) {
  if (width < 640) {
    // Mobile — full viewport canvas, TV centered; yStart pushes TV lower
    return { start: 1.4, end: 0.25, xOffset: 0, yStart: 0.1 };
  }
  if (width < 1024) {
    // Tablet — full viewport canvas
    return { start: 1.1, end: 0.20, xOffset: 0, yStart: 0 };
  }
  // Desktop — canvas positioning handled by CSS translateX; camera stays centered
  // yStart matches TV group position (y=-0.3) so TV is centered in viewport
  return { start: 1.2, end: 0.18, xOffset: 0, yStart: -0.3 };
}

interface CameraControllerProps {
  scrollRef: React.RefObject<number | null>;
}

// The screen center in world space (model at Y=-0.3, screen ~0.3 above base)
// Camera targets this Y as it zooms in so we enter the screen dead center
const SCREEN_CENTER_Y = 0.04;

function CameraController({ scrollRef }: CameraControllerProps) {
  const { camera, size } = useThree();
  const distances = useRef(getCameraDistances(size.width));
  const currentZ = useRef(distances.current.start);
  const currentY = useRef(distances.current.yStart);
  const currentX = useRef(distances.current.xOffset);
  const smoothedScroll = useRef(0);

  useEffect(() => {
    distances.current = getCameraDistances(size.width);
  }, [size.width]);

  useFrame((_state, delta) => {
    // Clamp raw scroll and smooth it to prevent jumps during fast scroll
    const rawProgress = Math.max(0, Math.min(1, scrollRef.current ?? 0));
    const scrollFactor = 1 - Math.exp(-8 * delta);
    smoothedScroll.current += (rawProgress - smoothedScroll.current) * scrollFactor;
    const progress = smoothedScroll.current;

    const { start, end, xOffset, yStart } = distances.current;
    const targetZ = start + (end - start) * progress;
    const targetY = yStart + (SCREEN_CENTER_Y - yStart) * progress;
    const targetX = xOffset * (1 - progress);

    const factor = 1 - Math.exp(-8 * delta);
    currentX.current += (targetX - currentX.current) * factor;
    currentZ.current += (targetZ - currentZ.current) * factor;
    currentY.current += (targetY - currentY.current) * factor;
    camera.position.set(currentX.current, currentY.current, currentZ.current);
  });

  return null;
}

interface CRTTVSceneProps {
  scrollRef: React.RefObject<number | null>;
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
  className?: string;
}

export function CRTTVScene({ scrollRef, mouseRef, className }: CRTTVSceneProps) {
  // Use initial viewport width for the Canvas camera start position
  const initialDistances = useRef(
    typeof window !== "undefined"
      ? getCameraDistances(window.innerWidth)
      : { start: 1.2, end: 0.18, xOffset: 0, yStart: 0 }
  );

  return (
    <div className={className} {...devProps('CRTTVScene')}>
      <Canvas
        camera={{ position: [initialDistances.current.xOffset, initialDistances.current.yStart, initialDistances.current.start], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            color="#fff8ee"
          />
          <pointLight
            position={[-3, 0, 3]}
            intensity={0.3}
            color="#fe5102"
          />
          <Environment preset="apartment" />

          <CameraController scrollRef={scrollRef} />
          <CRTTVModel mouseRef={mouseRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
