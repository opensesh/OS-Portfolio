"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGLTF, useVideoTexture } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";

const MODEL_PATH = "/models/crt-tv.glb";
const VIDEO_PATH = "/videos/crt-channel.mp4";
const MAX_ROTATION_X = 0.15; // ~8.5 degrees
const MAX_ROTATION_Y = 0.25; // ~14 degrees
const MOUSE_DAMPING = 4;
const DRAG_SNAP_BACK = 2; // How fast drag rotation springs back
const DRAG_SENSITIVITY = 4;

interface CRTTVModelProps {
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
}

export function CRTTVModel({ mouseRef }: CRTTVModelProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  // drei's useVideoTexture handles element creation, loading, and playback
  const videoTexture = useVideoTexture(VIDEO_PATH, {
    muted: true,
    loop: true,
    playsInline: true,
    crossOrigin: "anonymous",
  });

  // Force-loop: the loop attribute can silently fail, so manually restart on end
  useEffect(() => {
    const video = (videoTexture as THREE.VideoTexture).image as HTMLVideoElement;
    if (!video) return;

    video.loop = true;

    const restart = () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    // Restart when video ends (belt-and-suspenders with loop attr)
    video.addEventListener("ended", restart);
    // Resume if browser paused it (tab switch, visibility change)
    const onVisible = () => {
      if (document.visibilityState === "visible" && video.paused) {
        video.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      video.removeEventListener("ended", restart);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [videoTexture]);

  // Find the screen mesh and swap its material for the video texture
  useEffect(() => {
    const originals: Array<{ mesh: THREE.Mesh; material: THREE.Material }> = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.Material;
        // Debug: log all mesh material names so we can verify
        console.log("[CRT-TV] mesh:", child.name, "material:", mat.name);

        if (mat.name === "TVScreen") {
          originals.push({ mesh: child, material: mat });

          child.material = new THREE.MeshBasicMaterial({
            map: videoTexture,
            toneMapped: false,
          });
        }
      }
    });

    return () => {
      originals.forEach(({ mesh, material }) => {
        (mesh.material as THREE.Material).dispose();
        mesh.material = material;
      });
    };
  }, [scene, videoTexture]);

  // Drag state — all refs to avoid re-renders
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragRotation = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    const dx = (e.clientX - dragStart.current.x) / window.innerWidth;
    const dy = (e.clientY - dragStart.current.y) / window.innerHeight;
    dragRotation.current.y = dx * DRAG_SENSITIVITY;
    dragRotation.current.x = -dy * DRAG_SENSITIVITY;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    dragStart.current = { x: 0, y: 0 };
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current || !mouseRef.current) return;

    const factor = 1 - Math.exp(-MOUSE_DAMPING * delta);

    if (isDragging.current) {
      const targetX = dragRotation.current.x;
      const targetY = Math.PI + dragRotation.current.y;
      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * factor;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * factor;
    } else {
      const snapFactor = 1 - Math.exp(-DRAG_SNAP_BACK * delta);
      dragRotation.current.x *= 1 - snapFactor;
      dragRotation.current.y *= 1 - snapFactor;

      const targetX = -mouseRef.current.y * MAX_ROTATION_X + dragRotation.current.x;
      const targetY = Math.PI + mouseRef.current.x * MAX_ROTATION_Y + dragRotation.current.y;

      groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * factor;
      groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * factor;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.3, 0]}
      rotation={[0, Math.PI, 0]}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);
