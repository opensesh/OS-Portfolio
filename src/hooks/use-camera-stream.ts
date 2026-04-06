"use client";

import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";

interface StartResult {
  success: boolean;
  error?: string;
}

interface UseCameraStreamReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  textureRef: React.RefObject<THREE.VideoTexture | null>;
  streamRef: React.RefObject<MediaStream | null>;
  isActiveRef: React.RefObject<boolean>;
  start: () => Promise<StartResult>;
  stop: () => void;
}

export function useCameraStream(): UseCameraStreamReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const textureRef = useRef<THREE.VideoTexture | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isActiveRef = useRef(false);

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
      videoRef.current = null;
    }
    if (textureRef.current) {
      textureRef.current.dispose();
      textureRef.current = null;
    }
    isActiveRef.current = false;
  }, []);

  const start = useCallback(async (): Promise<StartResult> => {
    // Clean up any existing stream first
    stop();

    if (!navigator.mediaDevices?.getUserMedia) {
      return {
        success: false,
        error: "Your browser doesn't support camera access.",
      };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;
      video.autoplay = true;

      // Wait for video to be ready before creating texture
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play().catch(() => {});
          resolve();
        };
      });

      const texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;

      streamRef.current = stream;
      videoRef.current = video;
      textureRef.current = texture;
      isActiveRef.current = true;

      return { success: true };
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";

      if (name === "NotAllowedError") {
        return {
          success: false,
          error:
            "Camera access was denied. Check your browser settings to enable it.",
        };
      }
      if (name === "NotFoundError") {
        return {
          success: false,
          error: "No camera found on this device.",
        };
      }

      return {
        success: false,
        error: "Could not access the camera. Please try again.",
      };
    }
  }, [stop]);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { videoRef, textureRef, streamRef, isActiveRef, start, stop };
}
