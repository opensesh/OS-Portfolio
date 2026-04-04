"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { CRTTVModel } from "./crt-tv-model";
import { devProps } from "@/utils/dev-props";

// Responsive camera distances — TV fills most of the frame with padding,
// end position puts the viewer inches from the screen (inside the bezel).
// xOffset shifts camera left so the TV appears in the right half of the viewport;
// it lerps to 0 as scroll progresses, centering the TV.
function getCameraDistances(width: number) {
  if (width < 640) {
    // Mobile — centered, further back for narrower viewport
    return { start: 1.4, end: 0.15, xOffset: 0 };
  }
  if (width < 1024) {
    // Tablet — slight right shift
    return { start: 1.1, end: 0.12, xOffset: -0.15 };
  }
  // Desktop — TV centered in right half
  return { start: 0.95, end: 0.1, xOffset: -0.3 };
}

interface CameraControllerProps {
  scrollRef: React.RefObject<number | null>;
}

// The screen center in world space (model at Y=-0.3, screen ~0.3 above base)
// Camera targets this Y as it zooms in so we enter the screen dead center
const SCREEN_CENTER_Y = 0.0;

function CameraController({ scrollRef }: CameraControllerProps) {
  const { camera, size } = useThree();
  const distances = useRef(getCameraDistances(size.width));
  const currentZ = useRef(distances.current.start);
  const currentY = useRef(0);
  const currentX = useRef(distances.current.xOffset);

  useEffect(() => {
    distances.current = getCameraDistances(size.width);
  }, [size.width]);

  useFrame((_state, delta) => {
    const progress = scrollRef.current ?? 0;
    const { start, end, xOffset } = distances.current;
    const targetZ = start + (end - start) * progress;
    // Gradually shift camera Y toward screen center as we zoom in
    const targetY = SCREEN_CENTER_Y * progress;
    // X offset: start shifted left (TV appears right), lerp to 0 (centered)
    const targetX = xOffset * (1 - progress);

    const factor = 1 - Math.exp(-3 * delta);
    currentX.current += (targetX - currentX.current) * factor;
    currentZ.current += (targetZ - currentZ.current) * factor;
    currentY.current += (targetY - currentY.current) * factor;
    camera.position.x = currentX.current;
    camera.position.z = currentZ.current;
    camera.position.y = currentY.current;
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
      : { start: 0.95, end: 0.1, xOffset: -0.3 }
  );

  return (
    <div className={className} {...devProps('CRTTVScene')}>
      <Canvas
        camera={{ position: [initialDistances.current.xOffset, 0, initialDistances.current.start], fov: 45 }}
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
