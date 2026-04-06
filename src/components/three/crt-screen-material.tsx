"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Custom shader material that renders a video texture with CRT effects:
 * - Scanlines
 * - Slight RGB shift (chromatic aberration)
 * - Vignette darkening at edges
 * - Subtle screen curvature distortion
 *
 * All done in a single fragment shader pass — no extra video decode.
 */
const CRTScreenMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uGlitchTexture: new THREE.Texture(),
    uGlitchOpacity: 0,
    uTime: 0,
    uScanlineIntensity: 0.08,
    uVignetteStrength: 0.3,
    uRgbShift: 0.001,
    uCurvature: 0.03,
    uBrightness: 1.2,
  },
  // Vertex shader
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  /* glsl */ `
    uniform sampler2D uTexture;
    uniform sampler2D uGlitchTexture;
    uniform float uGlitchOpacity;
    uniform float uTime;
    uniform float uScanlineIntensity;
    uniform float uVignetteStrength;
    uniform float uRgbShift;
    uniform float uCurvature;
    uniform float uBrightness;

    varying vec2 vUv;

    // Barrel distortion for CRT curvature
    vec2 curveUV(vec2 uv) {
      uv = uv * 2.0 - 1.0;
      uv *= 1.0 + uCurvature * dot(uv, uv);
      return uv * 0.5 + 0.5;
    }

    void main() {
      vec2 uv = curveUV(vUv);

      // Discard pixels outside the curved screen area
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      // RGB shift (chromatic aberration)
      float r = texture2D(uTexture, uv + vec2(uRgbShift, 0.0)).r;
      float g = texture2D(uTexture, uv).g;
      float b = texture2D(uTexture, uv - vec2(uRgbShift, 0.0)).b;
      vec3 color = vec3(r, g, b);

      // Scanlines — tied to screen-space Y
      float scanline = sin(uv.y * 800.0) * 0.5 + 0.5;
      color -= uScanlineIntensity * scanline;

      // Subtle horizontal flicker
      float flicker = 1.0 - 0.01 * sin(uTime * 8.0);
      color *= flicker;

      // Vignette
      vec2 vigUv = uv * (1.0 - uv);
      float vig = vigUv.x * vigUv.y * 15.0;
      vig = pow(vig, uVignetteStrength);
      color *= vig;

      // Glitch overlay (screen blend mode)
      if (uGlitchOpacity > 0.0) {
        vec3 glitch = texture2D(uGlitchTexture, uv).rgb;
        vec3 blended = 1.0 - (1.0 - color) * (1.0 - glitch);
        color = mix(color, blended, uGlitchOpacity);
      }

      // Brightness boost (screens glow)
      color *= uBrightness;

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ CRTScreenMaterial });

// Type declaration for R3F JSX
declare module "@react-three/fiber" {
  interface ThreeElements {
    cRTScreenMaterial: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      uTexture?: THREE.Texture;
      uGlitchTexture?: THREE.Texture;
      uGlitchOpacity?: number;
      uTime?: number;
      uScanlineIntensity?: number;
      uVignetteStrength?: number;
      uRgbShift?: number;
      uCurvature?: number;
      uBrightness?: number;
      attach?: string;
    };
  }
}

export { CRTScreenMaterial };
