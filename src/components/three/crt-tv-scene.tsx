"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { CRTTVModel } from "./crt-tv-model";
import { devProps } from "@/utils/dev-props";

// Three-phase camera config per breakpoint:
//   zStart  — initial zoom distance (hero landing state)
//   zHold   — "TV centered" distance (TV fully visible with padding)
//   zEnd    — final zoom (into the screen, transition to next section)
//   yStart  — initial camera Y
//   yHold   — camera Y when TV is centered (visual center of TV model)
//   yEnd    — camera Y at max zoom (screen center for entering the screen)
function getCameraConfig(width: number) {
  if (width < 640) {
    // Mobile: pull camera closer and center TV vertically (accounting for nav)
    return { zStart: 1.55, zHold: 0.95, zEnd: 0.25, yStart: -0.03, yHold: -0.08, yEnd: 0.04 };
  }
  if (width < 1024) {
    // Tablet: tighter hold zoom with better vertical centering
    return { zStart: 1.3, zHold: 0.78, zEnd: 0.20, yStart: -0.03, yHold: -0.07, yEnd: 0.04 };
  }
  // Desktop: yStart slightly above TV center so TV appears centered accounting for nav
  return { zStart: 1.05, zHold: 0.9, zEnd: 0.18, yStart: -0.08, yHold: -0.05, yEnd: 0.04 };
}

interface CameraControllerProps {
  scrollRef: React.RefObject<number | null>;
}

// Scroll phases (matched to hero.tsx):
//   Phase 1: 0–0.15   → TV slides to center, camera moves to zHold/yHold
//   Phase 2: 0.15–0.55 → TV holds centered (dwell time)
//   Phase 3: 0.55–1.0  → camera zooms into screen (zEnd/yEnd)
const P1_END = 0.15;
const P2_END = 0.55;

function CameraController({ scrollRef }: CameraControllerProps) {
  const { camera, size } = useThree();
  const config = useRef(getCameraConfig(size.width));
  const currentZ = useRef(config.current.zStart);
  const currentY = useRef(config.current.yStart);
  const smoothedScroll = useRef(0);

  useEffect(() => {
    config.current = getCameraConfig(size.width);
  }, [size.width]);

  useFrame((_state, delta) => {
    const rawProgress = Math.max(0, Math.min(1, scrollRef.current ?? 0));
    const scrollFactor = 1 - Math.exp(-8 * delta);
    smoothedScroll.current += (rawProgress - smoothedScroll.current) * scrollFactor;
    const progress = smoothedScroll.current;

    const { zStart, zHold, zEnd, yStart, yHold, yEnd } = config.current;

    let targetZ: number;
    let targetY: number;

    if (progress <= P1_END) {
      // Phase 1: lerp from start → hold
      const t = progress / P1_END;
      targetZ = zStart + (zHold - zStart) * t;
      targetY = yStart + (yHold - yStart) * t;
    } else if (progress <= P2_END) {
      // Phase 2: hold centered
      targetZ = zHold;
      targetY = yHold;
    } else {
      // Phase 3: lerp from hold → end (into the screen)
      const t = (progress - P2_END) / (1 - P2_END);
      targetZ = zHold + (zEnd - zHold) * t;
      targetY = yHold + (yEnd - yHold) * t;
    }

    const factor = 1 - Math.exp(-8 * delta);
    currentZ.current += (targetZ - currentZ.current) * factor;
    currentY.current += (targetY - currentY.current) * factor;
    camera.position.set(0, currentY.current, currentZ.current);
  });

  return null;
}

interface CRTTVSceneProps {
  scrollRef: React.RefObject<number | null>;
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
  activeChannel: string;
  className?: string;
}

export function CRTTVScene({ scrollRef, mouseRef, activeChannel, className }: CRTTVSceneProps) {
  const initialConfig = useRef(
    typeof window !== "undefined"
      ? getCameraConfig(window.innerWidth)
      : { zStart: 1.05, zHold: 0.9, zEnd: 0.18, yStart: -0.08, yHold: -0.05, yEnd: 0.04 }
  );

  return (
    <div className={className} {...devProps('CRTTVScene')}>
      <Canvas
        camera={{ position: [0, initialConfig.current.yStart, initialConfig.current.zStart], fov: 45 }}
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
          <CRTTVModel mouseRef={mouseRef} activeChannel={activeChannel} />
        </Suspense>
      </Canvas>
    </div>
  );
}
