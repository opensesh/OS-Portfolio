"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import * as THREE from "three";
import { HEAD_ASSETS, type HeadAsset } from "@/lib/head-assets";

// MediaPipe face oval landmark indices (36 points tracing forehead → jaw → ears)
const FACE_OVAL_INDICES = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
  378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
  162, 21, 54, 103, 67, 109,
];

// Key landmark indices for positioning
const FOREHEAD_INDEX = 10;
const CHIN_INDEX = 152;
const LEFT_EAR_INDEX = 234;
const RIGHT_EAR_INDEX = 454;

const SMOOTHING_FACTOR = 0.3;
const NO_FACE_THRESHOLD = 3; // frames without face before fallback

interface SmoothedLandmarks {
  centerX: number;
  centerY: number;
  headWidth: number;
  headHeight: number;
  angle: number;
}

interface UseFaceReplacementReturn {
  processedTextureRef: React.RefObject<THREE.CanvasTexture | null>;
  isProcessingRef: React.RefObject<boolean>;
  isLoadingModel: boolean;
  start: (videoElement: HTMLVideoElement) => Promise<void>;
  stop: () => void;
  activeAsset: string | null;
  setActiveAsset: (id: string | null) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FaceLandmarkerType = any;

async function loadMediaPipe() {
  const { FaceLandmarker, FilesetResolver } = await import(
    "@mediapipe/tasks-vision"
  );
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );
  return { FaceLandmarker, vision };
}

export function useFaceReplacement(): UseFaceReplacementReturn {
  const [activeAsset, setActiveAssetState] = useState<string | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState(false);

  const processedTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const isProcessingRef = useRef(false);

  // Internal refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarkerType | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const activeAssetRef = useRef<string | null>(null);
  const assetImageCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const smoothedRef = useRef<SmoothedLandmarks | null>(null);
  const noFaceCountRef = useRef(0);
  const processingFrameRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    activeAssetRef.current = activeAsset;
  }, [activeAsset]);

  // Preload asset images
  const preloadAsset = useCallback((asset: HeadAsset) => {
    if (assetImageCache.current.has(asset.id)) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = asset.src;
    assetImageCache.current.set(asset.id, img);
  }, []);

  // Preload all assets on mount
  useEffect(() => {
    HEAD_ASSETS.forEach(preloadAsset);
  }, [preloadAsset]);

  const setActiveAsset = useCallback(
    (id: string | null) => {
      setActiveAssetState(id);
      if (id) {
        const asset = HEAD_ASSETS.find((a) => a.id === id);
        if (asset) preloadAsset(asset);
      }
    },
    [preloadAsset]
  );

  // Initialize MediaPipe FaceLandmarker (lazy, cached)
  const initLandmarker = useCallback(async () => {
    if (landmarkerRef.current) return;

    setIsLoadingModel(true);
    try {
      const { FaceLandmarker, vision } = await loadMediaPipe();
      const landmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numFaces: 1,
        outputFacialTransformationMatrixes: false,
        outputFaceBlendshapes: false,
      });
      landmarkerRef.current = landmarker;
    } catch {
      // Fall back to CPU if GPU delegate fails
      try {
        const { FaceLandmarker, vision } = await loadMediaPipe();
        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFacialTransformationMatrixes: false,
          outputFaceBlendshapes: false,
        });
        landmarkerRef.current = landmarker;
      } catch (e) {
        console.error("Failed to initialize FaceLandmarker:", e);
      }
    } finally {
      setIsLoadingModel(false);
    }
  }, []);

  // Expand convex hull outward from center by a factor
  const expandHull = useCallback(
    (
      points: { x: number; y: number }[],
      centerX: number,
      centerY: number,
      factor: number
    ) => {
      return points.map((p) => ({
        x: centerX + (p.x - centerX) * factor,
        y: centerY + (p.y - centerY) * factor,
      }));
    },
    []
  );

  // Main processing loop
  const processFrame = useCallback(() => {
    const video = videoRef.current;
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const maskCtx = maskCtxRef.current;
    const maskCanvas = maskCanvasRef.current;
    const landmarker = landmarkerRef.current;

    if (
      !video ||
      !ctx ||
      !canvas ||
      !maskCtx ||
      !maskCanvas ||
      !landmarker ||
      !isProcessingRef.current
    ) {
      if (isProcessingRef.current) {
        rafIdRef.current = requestAnimationFrame(processFrame);
      }
      return;
    }

    // Frame gating — skip if still processing previous frame
    if (processingFrameRef.current) {
      rafIdRef.current = requestAnimationFrame(processFrame);
      return;
    }

    processingFrameRef.current = true;

    // Draw raw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const currentAssetId = activeAssetRef.current;
    const asset = currentAssetId
      ? HEAD_ASSETS.find((a) => a.id === currentAssetId)
      : null;
    const assetImg = currentAssetId
      ? assetImageCache.current.get(currentAssetId)
      : null;

    if (asset && assetImg?.complete) {
      // Run face detection
      const results = landmarker.detectForVideo(video, performance.now());

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        noFaceCountRef.current = 0;
        const landmarks = results.faceLandmarks[0];
        const w = canvas.width;
        const h = canvas.height;

        // Extract key positions
        const forehead = landmarks[FOREHEAD_INDEX];
        const chin = landmarks[CHIN_INDEX];
        const leftEar = landmarks[LEFT_EAR_INDEX];
        const rightEar = landmarks[RIGHT_EAR_INDEX];

        const rawCenterX = ((forehead.x + chin.x) / 2) * w;
        const rawCenterY = ((forehead.y + chin.y) / 2) * h;
        const rawHeadWidth =
          Math.abs(rightEar.x - leftEar.x) * w * asset.scale;
        const rawHeadHeight = Math.abs(chin.y - forehead.y) * h * asset.scale;
        const rawAngle = Math.atan2(
          (chin.x - forehead.x) * w,
          (chin.y - forehead.y) * h
        );

        // Smooth landmarks
        const prev = smoothedRef.current;
        const s: SmoothedLandmarks = prev
          ? {
              centerX:
                prev.centerX + (rawCenterX - prev.centerX) * SMOOTHING_FACTOR,
              centerY:
                prev.centerY + (rawCenterY - prev.centerY) * SMOOTHING_FACTOR,
              headWidth:
                prev.headWidth +
                (rawHeadWidth - prev.headWidth) * SMOOTHING_FACTOR,
              headHeight:
                prev.headHeight +
                (rawHeadHeight - prev.headHeight) * SMOOTHING_FACTOR,
              angle:
                prev.angle + (rawAngle - prev.angle) * SMOOTHING_FACTOR,
            }
          : {
              centerX: rawCenterX,
              centerY: rawCenterY,
              headWidth: rawHeadWidth,
              headHeight: rawHeadHeight,
              angle: rawAngle,
            };
        smoothedRef.current = s;

        // Build face oval path points
        const ovalPoints = FACE_OVAL_INDICES.map((i) => ({
          x: landmarks[i].x * w,
          y: landmarks[i].y * h,
        }));

        // Expand hull to cover hair area
        const expandedPoints = expandHull(
          ovalPoints,
          s.centerX,
          s.centerY,
          1.35
        );

        // Create feathered mask on separate canvas
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.fillStyle = "black";
        maskCtx.beginPath();
        maskCtx.moveTo(expandedPoints[0].x, expandedPoints[0].y);
        for (let i = 1; i < expandedPoints.length; i++) {
          maskCtx.lineTo(expandedPoints[i].x, expandedPoints[i].y);
        }
        maskCtx.closePath();
        maskCtx.fill();

        // Erase head region from main canvas using mask
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        // Apply slight blur for feathered edge
        ctx.filter = "blur(8px)";
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.filter = "none";
        ctx.restore();

        // Draw replacement asset
        ctx.save();
        ctx.translate(s.centerX, s.centerY - s.headHeight * asset.offsetY);
        ctx.rotate(s.angle);

        const drawW = s.headWidth;
        const drawH = (s.headWidth / assetImg.naturalWidth) * assetImg.naturalHeight;
        ctx.drawImage(assetImg, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      } else {
        noFaceCountRef.current++;
        if (noFaceCountRef.current > NO_FACE_THRESHOLD) {
          // No face — just show raw video (already drawn above)
          smoothedRef.current = null;
        }
      }
    }

    // Update Three.js texture
    if (processedTextureRef.current) {
      processedTextureRef.current.needsUpdate = true;
    }

    processingFrameRef.current = false;
    rafIdRef.current = requestAnimationFrame(processFrame);
  }, [expandHull]);

  const start = useCallback(
    async (videoElement: HTMLVideoElement) => {
      videoRef.current = videoElement;

      // Initialize MediaPipe if needed
      await initLandmarker();

      // Create offscreen canvas matching video dimensions
      const w = videoElement.videoWidth || 640;
      const h = videoElement.videoHeight || 480;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvasRef.current = canvas;
      ctxRef.current = canvas.getContext("2d", { willReadFrequently: false });

      // Create mask canvas for feathered head erasure
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = w;
      maskCanvas.height = h;
      maskCanvasRef.current = maskCanvas;
      maskCtxRef.current = maskCanvas.getContext("2d");

      // Create Three.js CanvasTexture
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      processedTextureRef.current = texture;

      // Reset state
      smoothedRef.current = null;
      noFaceCountRef.current = 0;
      isProcessingRef.current = true;

      // Start processing loop
      rafIdRef.current = requestAnimationFrame(processFrame);
    },
    [initLandmarker, processFrame]
  );

  const stop = useCallback(() => {
    isProcessingRef.current = false;

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (processedTextureRef.current) {
      processedTextureRef.current.dispose();
      processedTextureRef.current = null;
    }

    canvasRef.current = null;
    ctxRef.current = null;
    maskCanvasRef.current = null;
    maskCtxRef.current = null;
    videoRef.current = null;
    smoothedRef.current = null;
    noFaceCountRef.current = 0;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
    };
  }, [stop]);

  return {
    processedTextureRef,
    isProcessingRef,
    isLoadingModel,
    start,
    stop,
    activeAsset,
    setActiveAsset,
  };
}
