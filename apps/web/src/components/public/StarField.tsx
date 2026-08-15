"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface StarFieldProps {
  /** Star count on desktop viewports. Mobile/tablet are scaled down automatically. */
  starCount?: number;
  /** Base drift speed of the starfield. Keep tiny for a premium, calm feel. */
  speed?: number;
  /** Enable subtle mouse-based parallax on desktop. */
  mouseInteraction?: boolean;
  /** Enable gentle opacity twinkling. */
  twinkle?: boolean;
  className?: string;
}

/**
 * Sparse, tiny, elegant starfield background.
 *
 * - Pure Three.js Points/BufferGeometry (one draw call, no per-star meshes).
 * - Fills its relatively-positioned parent, sits behind content (z-index handled by caller).
 * - Never intercepts pointer events.
 * - Fully self-contained: does not read/write any React state, so it never
 *   triggers React re-renders and cannot affect surrounding page behaviour.
 */
export function StarField({
  starCount = 180,
  speed = 0.05,
  mouseInteraction = true,
  twinkle = true,
  className = "",
}: StarFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;
    const isTablet = !isMobile && window.innerWidth < 1024;

    const count = isMobile
      ? Math.min(starCount, 100)
      : isTablet
      ? Math.round(starCount * 0.7)
      : starCount;

    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);

    // ---- Scene setup -------------------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    // ---- Star geometry -------------------------------------------------
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count); // per-star twinkle/parallax phase
    const depths = new Float32Array(count); // 0 = far, 1 = near (drives parallax amount)
    const tints = new Float32Array(count * 3);
    const speeds = new Float32Array(count); // per-star random speed multiplier (drift + pointer parallax)

    for (let i = 0; i < count; i++) {
      const depth = Math.random(); // 0..1
      depths[i] = depth;

      positions[i * 3 + 0] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = -depth * 9 - 1; // farther stars pushed back

      // Mostly tiny stars, a small percentage slightly brighter/larger.
      const isBright = Math.random() > 0.92;
      sizes[i] = (isBright ? 2.1 : 1.1 + Math.random() * 0.6) * (0.6 + depth * 0.5);

      seeds[i] = Math.random() * Math.PI * 2;
      // Each star gets its own random speed so the field never drifts as one block.
      speeds[i] = 0.35 + Math.random() * 1.5;

      // White/off-white, a few with a very subtle blue/violet tint.
      const tinted = Math.random() > 0.85;
      if (tinted) {
        tints[i * 3 + 0] = 0.82 + Math.random() * 0.08;
        tints[i * 3 + 1] = 0.85 + Math.random() * 0.08;
        tints[i * 3 + 2] = 1.0;
      } else {
        tints[i * 3 + 0] = 0.96;
        tints[i * 3 + 1] = 0.97;
        tints[i * 3 + 2] = 1.0;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    geometry.setAttribute("aDepth", new THREE.BufferAttribute(depths, 1));
    geometry.setAttribute("aTint", new THREE.BufferAttribute(tints, 3));
    geometry.setAttribute("aSpeed", new THREE.BufferAttribute(speeds, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr },
        uTwinkle: { value: twinkle ? 1 : 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uTwinkle;
        uniform vec2 uPointer;
        attribute float aSize;
        attribute float aSeed;
        attribute float aDepth;
        attribute vec3 aTint;
        attribute float aSpeed;
        varying float vOpacity;
        varying vec3 vTint;
        void main() {
          vec3 pos = position;
          // extremely slow organic drift, unique per-star speed via aSpeed
          pos.x += sin(uTime * 0.02 * aSpeed + aSeed) * 0.35;
          pos.y += cos(uTime * 0.015 * aSpeed + aSeed * 1.7) * 0.25;

          // pointer/touch parallax: each star reacts at its own speed & depth,
          // so the field never shifts as one uniform block.
          pos.x += uPointer.x * aSpeed * (0.25 + aDepth * 0.9);
          pos.y += -uPointer.y * aSpeed * (0.2 + aDepth * 0.7);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = aSize * uPixelRatio * (78.0 / -mvPosition.z);

          float twinkle = mix(1.0, 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * 0.6 + aSeed * 3.0)), uTwinkle);
          vOpacity = (0.55 + aDepth * 0.45) * twinkle;
          vTint = aTint;
        }
      `,
      fragmentShader: `
        varying float vOpacity;
        varying vec3 vTint;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          float alpha = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vTint, alpha * vOpacity);
        }
      `,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // ---- Mouse / touch parallax ----------------------------------------
    const pointerTarget = { x: 0, y: 0 };
    const pointerSmoothed = { x: 0, y: 0 };
    const canParallax = mouseInteraction && !prefersReducedMotion;

    function setPointerFromClient(clientX: number, clientY: number) {
      const rect = container!.getBoundingClientRect();
      pointerTarget.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerTarget.y = ((clientY - rect.top) / rect.height) * 2 - 1;
    }
    function handlePointerMove(e: PointerEvent) {
      setPointerFromClient(e.clientX, e.clientY);
    }
    function handleTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch) setPointerFromClient(touch.clientX, touch.clientY);
    }

    if (canParallax) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
    }

    // ---- Resize ----------------------------------------------------------
    function handleResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener("resize", handleResize);

    // ---- Visibility handling ---------------------------------------------
    let isVisible = true;
    function handleVisibilityChange() {
      isVisible = document.visibilityState === "visible";
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // ---- Animation loop ----------------------------------------------------
    let rafId = 0;
    const clock = new THREE.Clock();
    const speedFactor = prefersReducedMotion ? 0 : speed;

    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsed * (speedFactor * 20 + (prefersReducedMotion ? 0 : 1));

      if (canParallax) {
        pointerSmoothed.x += (pointerTarget.x - pointerSmoothed.x) * 0.04;
        pointerSmoothed.y += (pointerTarget.y - pointerSmoothed.y) * 0.04;
        material.uniforms.uPointer.value.set(pointerSmoothed.x * 0.6, pointerSmoothed.y * 0.6);
      }

      renderer.render(scene, camera);
    }
    animate();

    // ---- Cleanup -----------------------------------------------------------
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (canParallax) {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("touchmove", handleTouchMove);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    />
  );
}
