"use client";

import { useRef, useEffect, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { Group } from "three";
import { TV_CHANNELS, GLITCH_VIDEO_SRC, LIVE_CHANNEL_SLUG } from "@/lib/tv-channels";
import { CRTScreenMaterial } from "@/components/three/crt-screen-material";

const MODEL_PATH = "/models/crt-tv.glb";
const MAX_ROTATION_X = 0.15;
const MAX_ROTATION_Y = 0.25;
const MOUSE_DAMPING = 4;
const DRAG_SNAP_BACK = 2;
const DRAG_SENSITIVITY = 4;

function createVideoEl(src: string, loop: boolean): HTMLVideoElement {
  const video = document.createElement("video");
  video.src = src;
  video.crossOrigin = "anonymous";
  video.muted = true;
  video.playsInline = true;
  video.loop = loop;
  video.preload = "auto";
  return video;
}

interface CRTTVModelProps {
  mouseRef: React.RefObject<{ x: number; y: number } | null>;
  activeChannel: string;
  cameraTextureRef?: React.RefObject<THREE.VideoTexture | null>;
  isLiveRef?: React.RefObject<boolean>;
  onSnapshotRequest?: React.MutableRefObject<(() => void) | null>;
}

export function CRTTVModel({
  mouseRef,
  activeChannel,
  cameraTextureRef,
  isLiveRef,
  onSnapshotRequest,
}: CRTTVModelProps) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_PATH);
  const { gl } = useThree();

  // Stable refs for video/texture management
  const screenMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const crtMatRef = useRef<InstanceType<typeof CRTScreenMaterial> | null>(null);
  const screenMeshRef = useRef<THREE.Mesh | null>(null);
  const originalMatRef = useRef<THREE.Material | null>(null);
  const isLiveModeRef = useRef(false);

  const glitchVideoRef = useRef<HTMLVideoElement | null>(null);
  const glitchTextureRef = useRef<THREE.VideoTexture | null>(null);

  const activeVideoRef = useRef<HTMLVideoElement | null>(null);
  const activeTextureRef = useRef<THREE.VideoTexture | null>(null);

  const currentSlugRef = useRef<string>("");
  const generationRef = useRef(0);
  const isTransitioningRef = useRef(false);

  // Find the TVScreen mesh and set up materials
  useEffect(() => {
    let screenMesh: THREE.Mesh | null = null;
    let originalMat: THREE.Material | null = null;

    scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        (child.material as THREE.Material).name === "TVScreen"
      ) {
        screenMesh = child;
        originalMat = child.material as THREE.Material;
      }
    });

    if (!screenMesh) return;

    // Default material for normal channels
    const mat = new THREE.MeshBasicMaterial({ toneMapped: false });
    (screenMesh as THREE.Mesh).material = mat;

    // CRT material for live mode (created once, swapped in when needed)
    const crtMat = new CRTScreenMaterial();
    crtMat.toneMapped = false;

    screenMeshRef.current = screenMesh;
    screenMatRef.current = mat;
    crtMatRef.current = crtMat;
    originalMatRef.current = originalMat;

    return () => {
      mat.dispose();
      crtMat.dispose();
      if (screenMesh && originalMat) {
        (screenMesh as THREE.Mesh).material = originalMat;
      }
    };
  }, [scene]);

  // Pre-load the glitch video once on mount
  useEffect(() => {
    const video = createVideoEl(GLITCH_VIDEO_SRC, false);
    video.load();

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = gl.outputColorSpace;

    glitchVideoRef.current = video;
    glitchTextureRef.current = texture;

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      texture.dispose();
      glitchVideoRef.current = null;
      glitchTextureRef.current = null;
    };
  }, [gl]);

  // Load a channel video and return a cleanup function
  const loadChannelVideo = useCallback(
    (slug: string): { video: HTMLVideoElement; texture: THREE.VideoTexture } | null => {
      const channel = TV_CHANNELS.find((c) => c.slug === slug);
      if (!channel) return null;

      const video = createVideoEl(channel.videoSrc, true);
      const texture = new THREE.VideoTexture(video);
      texture.colorSpace = gl.outputColorSpace;

      return { video, texture };
    },
    [gl]
  );

  // Dispose a channel video + texture pair
  const disposeChannel = useCallback(
    (video: HTMLVideoElement | null, texture: THREE.VideoTexture | null) => {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
      if (texture) {
        texture.dispose();
      }
    },
    []
  );

  // Enter live mode: swap to CRT material with camera + glitch overlay
  const enterLiveMode = useCallback(() => {
    const mesh = screenMeshRef.current;
    const crtMat = crtMatRef.current;
    const camTex = cameraTextureRef?.current;
    const glitchTex = glitchTextureRef.current;
    const glitchVideo = glitchVideoRef.current;

    if (!mesh || !crtMat || !camTex || !glitchTex || !glitchVideo) return;

    crtMat.uTexture = camTex;
    crtMat.uGlitchTexture = glitchTex;
    crtMat.uGlitchOpacity = 0.1;
    crtMat.needsUpdate = true;

    mesh.material = crtMat;

    // Loop glitch for persistent overlay
    glitchVideo.loop = true;
    glitchVideo.currentTime = 0;
    glitchVideo.play().catch(() => {});

    isLiveModeRef.current = true;
  }, [cameraTextureRef]);

  // Exit live mode: swap back to basic material
  const exitLiveMode = useCallback(() => {
    const mesh = screenMeshRef.current;
    const mat = screenMatRef.current;
    const glitchVideo = glitchVideoRef.current;

    if (!mesh || !mat) return;

    mesh.material = mat;

    if (glitchVideo) {
      glitchVideo.loop = false;
      glitchVideo.pause();
    }

    isLiveModeRef.current = false;
  }, []);

  // Handle channel changes with glitch transition
  useEffect(() => {
    const mat = screenMatRef.current;
    if (!mat) return;

    const isLiveChannel = activeChannel === LIVE_CHANNEL_SLUG;

    // Initial load — no glitch, just start playing
    if (currentSlugRef.current === "") {
      if (isLiveChannel) {
        // Can't start live on initial load — need a normal channel first
        return;
      }

      const result = loadChannelVideo(activeChannel);
      if (!result) return;

      const { video, texture } = result;

      const onReady = () => {
        mat.map = texture;
        mat.needsUpdate = true;
        video.play().catch(() => {});
        activeVideoRef.current = video;
        activeTextureRef.current = texture;
        currentSlugRef.current = activeChannel;
      };

      if (video.readyState >= 3) {
        onReady();
      } else {
        video.addEventListener("canplaythrough", onReady, { once: true });
        video.load();
      }

      return () => {
        video.removeEventListener("canplaythrough", onReady);
      };
    }

    // Same channel — nothing to do
    if (activeChannel === currentSlugRef.current) return;

    // Already transitioning — bump generation to cancel the pending one
    const gen = ++generationRef.current;
    isTransitioningRef.current = true;

    const glitchVideo = glitchVideoRef.current;
    const glitchTexture = glitchTextureRef.current;

    if (!glitchVideo || !glitchTexture) return;

    // If currently in live mode, exit it before transitioning
    if (isLiveModeRef.current) {
      exitLiveMode();
    }

    // Step 1: Show glitch immediately (always on basic material for transition)
    const mesh = screenMeshRef.current;
    if (mesh) mesh.material = mat;
    mat.map = glitchTexture;
    mat.needsUpdate = true;
    glitchVideo.loop = false;
    glitchVideo.currentTime = 0;
    glitchVideo.play().catch(() => {});

    // Step 2: Prepare the target (live camera or normal channel)
    if (isLiveChannel) {
      // Live mode: wait for glitch to end, then swap to CRT material
      const onGlitchEnd = () => {
        if (gen !== generationRef.current) return;

        // Dispose current normal channel
        disposeChannel(activeVideoRef.current, activeTextureRef.current);
        activeVideoRef.current = null;
        activeTextureRef.current = null;

        enterLiveMode();
        currentSlugRef.current = activeChannel;
        isTransitioningRef.current = false;
      };

      glitchVideo.addEventListener("ended", onGlitchEnd, { once: true });

      return () => {
        glitchVideo.removeEventListener("ended", onGlitchEnd);
      };
    }

    // Normal channel: load video in parallel with glitch
    const result = loadChannelVideo(activeChannel);
    if (!result) {
      isTransitioningRef.current = false;
      return;
    }

    const { video: newVideo, texture: newTexture } = result;
    let glitchDone = false;
    let videoDone = false;

    const oldVideo = activeVideoRef.current;
    const oldTexture = activeTextureRef.current;

    const trySwap = () => {
      if (!glitchDone || !videoDone) return;
      // Stale transition — a newer switch happened
      if (gen !== generationRef.current) {
        disposeChannel(newVideo, newTexture);
        return;
      }

      // Step 3: Swap to the new channel
      mat.map = newTexture;
      mat.needsUpdate = true;
      newVideo.play().catch(() => {});

      // Dispose the old channel
      disposeChannel(oldVideo, oldTexture);

      activeVideoRef.current = newVideo;
      activeTextureRef.current = newTexture;
      currentSlugRef.current = activeChannel;
      isTransitioningRef.current = false;
    };

    const onGlitchEnd = () => {
      glitchDone = true;
      trySwap();
    };

    const onVideoReady = () => {
      videoDone = true;
      trySwap();
    };

    glitchVideo.addEventListener("ended", onGlitchEnd, { once: true });

    if (newVideo.readyState >= 3) {
      videoDone = true;
    } else {
      newVideo.addEventListener("canplaythrough", onVideoReady, { once: true });
      newVideo.load();
    }

    // In case glitch is already done (very short) + video already ready
    if (glitchDone && videoDone) trySwap();

    return () => {
      glitchVideo.removeEventListener("ended", onGlitchEnd);
      newVideo.removeEventListener("canplaythrough", onVideoReady);
    };
  }, [activeChannel, loadChannelVideo, disposeChannel, enterLiveMode, exitLiveMode]);

  // Register snapshot handler
  useEffect(() => {
    if (!onSnapshotRequest) return;

    onSnapshotRequest.current = () => {
      const crtMat = crtMatRef.current;
      const camVideo = cameraTextureRef?.current?.image as HTMLVideoElement | undefined;
      if (!crtMat || !isLiveModeRef.current) return;

      // Use the camera's native resolution to avoid stretching
      const width = camVideo?.videoWidth || 1280;
      const height = camVideo?.videoHeight || 720;
      const renderTarget = new THREE.WebGLRenderTarget(width, height);

      // Create a simple scene with a fullscreen quad
      const captureScene = new THREE.Scene();
      const captureCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const quadGeometry = new THREE.PlaneGeometry(2, 2);
      const quadMesh = new THREE.Mesh(quadGeometry, crtMat);
      captureScene.add(quadMesh);

      // Render to offscreen target
      const prevTarget = gl.getRenderTarget();
      gl.setRenderTarget(renderTarget);
      gl.render(captureScene, captureCamera);

      // Read pixels
      const pixels = new Uint8Array(width * height * 4);
      gl.readRenderTargetPixels(renderTarget, 0, 0, width, height, pixels);

      // Restore previous render target
      gl.setRenderTarget(prevTarget);

      // Write to canvas (flip Y since WebGL is bottom-up)
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const imageData = ctx.createImageData(width, height);
      for (let y = 0; y < height; y++) {
        const srcRow = (height - 1 - y) * width * 4;
        const dstRow = y * width * 4;
        for (let x = 0; x < width * 4; x++) {
          imageData.data[dstRow + x] = pixels[srcRow + x];
        }
      }
      ctx.putImageData(imageData, 0, 0);

      // Trigger download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "os-tv-snapshot.png";
        a.click();
        URL.revokeObjectURL(url);
      }, "image/png");

      // Cleanup
      renderTarget.dispose();
      quadGeometry.dispose();
      captureScene.remove(quadMesh);
    };

    return () => {
      if (onSnapshotRequest) onSnapshotRequest.current = null;
    };
  }, [gl, onSnapshotRequest]);

  // Keep active video playing after visibility changes
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        const video = activeVideoRef.current;
        if (video && video.paused) video.play().catch(() => {});
        // Also resume glitch if in live mode
        if (isLiveModeRef.current) {
          const glitch = glitchVideoRef.current;
          if (glitch && glitch.paused) glitch.play().catch(() => {});
        }
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // Cleanup all video resources on unmount
  useEffect(() => {
    return () => {
      disposeChannel(activeVideoRef.current, activeTextureRef.current);
      activeVideoRef.current = null;
      activeTextureRef.current = null;
    };
  }, [disposeChannel]);

  // Drag state
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

  useFrame((state, delta) => {
    if (!groupRef.current || !mouseRef.current) return;

    // Update CRT material time when in live mode
    const crtMat = crtMatRef.current;
    if (crtMat && isLiveModeRef.current) {
      crtMat.uTime = state.clock.elapsedTime;
    }

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
