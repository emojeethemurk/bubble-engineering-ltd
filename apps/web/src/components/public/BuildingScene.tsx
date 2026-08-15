"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type BuildingVariant = 0 | 1 | 2 | 3 | 4 | 5;

interface BuildingSceneProps {
  variant?: BuildingVariant;
  scale?: number;
  mouseInteraction?: boolean;
  animation?: boolean;
  className?: string;
}

/**
 * Realistic, light gray/white architectural building — one of five variants
 * (skyscraper, glass office slab, residential tower, terraced low-rise,
 * industrial/warehouse hub). Built from BoxGeometry blocks + an
 * InstancedMesh window grid per facade so even the tallest variant stays a
 * handful of draw calls.
 *
 * Fully isolated from React state; disposes all GPU resources on unmount.
 */
export function BuildingScene({
  variant = 0,
  scale = 1,
  mouseInteraction = true,
  animation = true,
  className = "",
}: BuildingSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.innerWidth < 768;
    const isTablet = !isMobile && window.innerWidth < 1024;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
    const finalScale = (isMobile ? 0.55 : isTablet ? 0.78 : 1) * scale;

    // ---- Renderer / scene / camera ---------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 1.6, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    // ---- Lighting: soft, cool, cinematic -----------------------------------
    scene.add(new THREE.AmbientLight(0xbfc8d6, 1.05));
    const key = new THREE.DirectionalLight(0xf3f6ff, 1.15);
    key.position.set(5, 8, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 24;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x6f9bff, 0.35);
    rim.position.set(-6, 4, -5);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x8fa6c8, 0.25);
    fill.position.set(-3, 1, 6);
    scene.add(fill);
    // Follows the camera so whichever face is turned toward the viewer is
    // always lit, regardless of a variant's proportions/orientation.
    const camLight = new THREE.PointLight(0xdfe8ff, 0.9, 40);
    scene.add(camLight);

    // ---- Shared light gray / off-white architectural materials ------------
    const facadeMat = new THREE.MeshStandardMaterial({
      color: 0xe4e6ea,
      roughness: 0.55,
      metalness: 0.08,
    });
    const facadeMatAlt = new THREE.MeshStandardMaterial({
      color: 0xd6d9de,
      roughness: 0.65,
      metalness: 0.04,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xf5f6f8,
      roughness: 0.3,
      metalness: 0.4,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xaecbea,
      roughness: 0.08,
      metalness: 0,
      transmission: 0.75,
      transparent: true,
      opacity: 0.6,
      reflectivity: 0.7,
    });
    const windowLitMat = new THREE.MeshStandardMaterial({
      color: 0xfff2d6,
      emissive: 0xffcf8a,
      emissiveIntensity: 0.55,
      roughness: 0.4,
    });
    const windowDarkMat = new THREE.MeshStandardMaterial({
      color: 0x9fb3c8,
      roughness: 0.2,
      metalness: 0.15,
      emissive: 0x3a3520,
      emissiveIntensity: 0.5,
    });
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x05070b, roughness: 1 });
    const rawConcreteMat = new THREE.MeshStandardMaterial({ color: 0xb9bcc2, roughness: 0.85, metalness: 0.02 });
    const craneMat = new THREE.MeshStandardMaterial({ color: 0xf5b731, roughness: 0.4, metalness: 0.3 });
    const craneDarkMat = new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.5, metalness: 0.4 });

    const buildingGroup = new THREE.Group();
    const disposableGeoms: THREE.BufferGeometry[] = [];
    const disposableMats: THREE.Material[] = [
      facadeMat,
      facadeMatAlt,
      trimMat,
      glassMat,
      windowLitMat,
      windowDarkMat,
      groundMat,
      rawConcreteMat,
      craneMat,
      craneDarkMat,
    ];

    /** Adds a window grid across one vertical facade using a single InstancedMesh. */
    function addWindowGrid(
      width: number,
      height: number,
      depth: number,
      cols: number,
      rows: number,
      facadeAxis: "z" | "x",
      offset: number,
      centerY: number
    ) {
      const winGeo = new THREE.BoxGeometry(
        facadeAxis === "z" ? width / cols / 2.6 : depth,
        height / rows / 2.4,
        facadeAxis === "z" ? depth : width / cols / 2.6
      );
      disposableGeoms.push(winGeo);
      const count = cols * rows;
      const inst = new THREE.InstancedMesh(winGeo, windowDarkMat, count);
      inst.castShadow = false;
      inst.receiveShadow = false;
      const dummy = new THREE.Object3D();
      let idx = 0;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const lit = Math.random() > 0.72;
          const x =
            facadeAxis === "z" ? (c / (cols - 1) - 0.5) * width * 0.86 : offset;
          const z =
            facadeAxis === "z" ? offset : (c / (cols - 1) - 0.5) * depth * 0.7;
          const y = centerY + (r / (rows - 1) - 0.5) * height * 0.82;
          dummy.position.set(x, y, z);
          dummy.updateMatrix();
          inst.setMatrixAt(idx, dummy.matrix);
          inst.setColorAt(
            idx,
            lit ? new THREE.Color(0xffe3ab) : new THREE.Color(0x9fb3c8)
          );
          idx++;
        }
      }
      inst.instanceMatrix.needsUpdate = true;
      if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
      buildingGroup.add(inst);
      return inst;
    }

    // Track lit-window instanced meshes for the subtle glow-flicker idle animation.
    const litMeshes: THREE.InstancedMesh[] = [];

    function box(
      w: number,
      h: number,
      d: number,
      mat: THREE.Material,
      x: number,
      y: number,
      z: number
    ) {
      const geo = new THREE.BoxGeometry(w, h, d);
      disposableGeoms.push(geo);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      buildingGroup.add(mesh);
      return mesh;
    }

    // ---- Variant 0: contemporary skyscraper (tapered tower) ----------------
    function buildSkyscraper() {
      const floors = 9;
      const floorH = 0.62;
      let y = floorH / 2;
      for (let i = 0; i < floors; i++) {
        const t = i / (floors - 1);
        const w = 2.1 - t * 0.55;
        const d = 1.5 - t * 0.35;
        box(w, floorH, d, i % 2 === 0 ? facadeMat : facadeMatAlt, 0, y, 0);
        y += floorH;
      }
      addWindowGrid(1.9, floors * floorH, 1.3, 6, floors, "z", 0.66, (floors * floorH) / 2);
      addWindowGrid(1.9, floors * floorH, 1.3, 6, floors, "z", -0.66, (floors * floorH) / 2);
      // rooftop mechanical block + spire
      box(0.6, 0.3, 0.5, trimMat, 0, y + 0.15, 0);
      const spireGeo = new THREE.CylinderGeometry(0.02, 0.04, 0.9, 8);
      disposableGeoms.push(spireGeo);
      const spire = new THREE.Mesh(spireGeo, trimMat);
      spire.position.set(0, y + 0.75, 0);
      buildingGroup.add(spire);
      return y + 1.2;
    }

    // ---- Variant 1: glass office slab -----------------------------------------
    function buildOfficeSlab() {
      const w = 2.6,
        h = 3.4,
        d = 1.1;
      box(w, h, d, glassMat, 0, h / 2, 0);
      // structural floor bands
      const floors = 8;
      for (let i = 1; i < floors; i++) {
        const band = box(w + 0.04, 0.05, d + 0.04, trimMat, 0, (h / floors) * i, 0);
        band.castShadow = false;
      }
      // recessed concrete core on one side
      box(0.5, h + 0.3, 0.5, facadeMatAlt, -w / 2 - 0.1, (h + 0.3) / 2, 0);
      addWindowGrid(w, h, d, 7, floors, "z", d / 2 + 0.01, h / 2);
      addWindowGrid(w, h, d, 7, floors, "z", -(d / 2 + 0.01), h / 2);
      return h + 0.4;
    }

    // ---- Variant 2: residential tower (balcony banding) -----------------------
    function buildResidentialTower() {
      const w = 1.7,
        d = 1.7,
        floors = 10,
        floorH = 0.34;
      const h = floors * floorH;
      box(w, h, d, facadeMat, 0, h / 2, 0);
      for (let i = 0; i < floors; i += 2) {
        const y = i * floorH + floorH;
        const slab = box(w + 0.18, 0.04, d + 0.18, trimMat, 0, y, 0);
        slab.castShadow = false;
      }
      addWindowGrid(w, h, d, 5, floors, "z", d / 2 + 0.01, h / 2);
      addWindowGrid(w, h, d, 5, floors, "z", -(d / 2 + 0.01), h / 2);
      addWindowGrid(w, h, d, 5, floors, "x", w / 2 + 0.01, h / 2);
      box(0.7, 0.25, 0.7, trimMat, 0, h + 0.13, 0);
      return h + 0.5;
    }

    // ---- Variant 3: terraced low-rise (stepped modern) -------------------------
    function buildTerracedLowrise() {
      let y = 0;
      const levels = [
        { w: 2.8, h: 0.75, d: 1.9 },
        { w: 2.2, h: 0.65, d: 1.6 },
        { w: 1.6, h: 0.55, d: 1.2 },
      ];
      let topY = 0;
      levels.forEach((lvl, i) => {
        const cy = y + lvl.h / 2;
        box(lvl.w, lvl.h, lvl.d, i % 2 === 0 ? facadeMat : facadeMatAlt, 0, cy, 0.15 * i);
        addWindowGrid(lvl.w, lvl.h, lvl.d, Math.max(3, 6 - i), 1, "z", lvl.d / 2 + 0.15 * i + 0.01, cy);
        y += lvl.h;
        topY = y;
      });
      // roof terrace slab
      box(1.4, 0.05, 1.0, trimMat, 0, topY + 0.05, 0.3);
      return topY + 0.6;
    }

    // ---- Variant 4: industrial / warehouse hub -----------------------------
    function buildIndustrialHub() {
      const w = 3.0,
        h = 1.15,
        d = 1.8;
      box(w, h, d, facadeMatAlt, 0, h / 2, 0);
      // sawtooth roof strip
      for (let i = -1; i <= 1; i++) {
        const roofGeo = new THREE.BoxGeometry(0.9, 0.3, d);
        disposableGeoms.push(roofGeo);
        const roofMesh = new THREE.Mesh(roofGeo, trimMat);
        roofMesh.position.set(i * 1.0, h + 0.15, 0);
        roofMesh.rotation.z = 0.18;
        roofMesh.castShadow = true;
        buildingGroup.add(roofMesh);
      }
      addWindowGrid(w, h * 0.6, d, 8, 1, "z", d / 2 + 0.01, h * 0.55);
      // loading dock doors
      for (let i = -1; i <= 1; i++) {
        box(0.5, 0.65, 0.04, trimMat, i * 0.9, 0.35, d / 2 + 0.02);
      }
      // silo / tank accent
      const siloGeo = new THREE.CylinderGeometry(0.28, 0.28, 1.5, 16);
      disposableGeoms.push(siloGeo);
      const silo = new THREE.Mesh(siloGeo, facadeMat);
      silo.position.set(w / 2 + 0.5, 0.75, -0.2);
      silo.castShadow = true;
      buildingGroup.add(silo);
      return h + 0.6;
    }

    // ---- Variant 5: tower under construction, matching the reference render --
    // Finished glazed/lit floors at the base, raw exposed-concrete floors with
    // rebar columns still rising up top, and a tower crane standing beside it.
    function buildConstructionCraneTower() {
      const w = 1.7,
        d = 1.3;
      const litFloors = 7,
        rawFloors = 4,
        floorH = 0.32;
      let y = 0;

      // Finished, glazed, lit floors (bottom section)
      for (let i = 0; i < litFloors; i++) {
        box(w, floorH, d, i % 2 === 0 ? facadeMat : facadeMatAlt, 0, y + floorH / 2, 0);
        y += floorH;
      }
      addWindowGrid(w, litFloors * floorH, d, 6, litFloors, "z", d / 2 + 0.01, (litFloors * floorH) / 2);
      addWindowGrid(w, litFloors * floorH, d, 6, litFloors, "z", -(d / 2 + 0.01), (litFloors * floorH) / 2);
      addWindowGrid(w, litFloors * floorH, d, 4, litFloors, "x", w / 2 + 0.01, (litFloors * floorH) / 2);

      // Raw, unfinished concrete floors still under construction (top section)
      for (let i = 0; i < rawFloors; i++) {
        const slab = box(w * 1.02, 0.05, d * 1.02, rawConcreteMat, 0, y + 0.025, 0);
        slab.castShadow = false;
        // exposed rebar columns at the corners of every open floor
        [
          [w / 2 - 0.08, d / 2 - 0.08],
          [-(w / 2 - 0.08), d / 2 - 0.08],
          [w / 2 - 0.08, -(d / 2 - 0.08)],
          [-(w / 2 - 0.08), -(d / 2 - 0.08)],
        ].forEach(([cx, cz]) => {
          const colGeo = new THREE.CylinderGeometry(0.014, 0.014, floorH * 1.15, 6);
          disposableGeoms.push(colGeo);
          const col = new THREE.Mesh(colGeo, craneDarkMat);
          col.position.set(cx, y + floorH * 0.55, cz);
          buildingGroup.add(col);
        });
        y += floorH;
      }
      // top roof slab
      const topSlab = box(w * 1.02, 0.05, d * 1.02, rawConcreteMat, 0, y + 0.025, 0);
      topSlab.castShadow = false;
      y += 0.05;

      // rooftop mechanical block
      box(0.4, 0.22, 0.32, facadeMatAlt, 0.25, y + 0.11, 0);

      // --- Tower crane standing beside the building ---
      const craneX = w / 2 + 0.55;
      const craneBaseZ = -d / 2 + 0.1;
      const craneH = y + 1.55;
      const mastGeo = new THREE.BoxGeometry(0.05, craneH, 0.05);
      disposableGeoms.push(mastGeo);
      const mast = new THREE.Mesh(mastGeo, craneMat);
      mast.position.set(craneX, craneH / 2, craneBaseZ);
      mast.castShadow = true;
      buildingGroup.add(mast);

      // slewing unit + cab at the top of the mast
      const cab = box(0.14, 0.1, 0.12, craneDarkMat, craneX, craneH - 0.08, craneBaseZ);
      cab.castShadow = false;

      // long working jib + shorter counter-jib
      const jibLen = 1.7,
        counterLen = 0.55;
      const jibGeo = new THREE.BoxGeometry(jibLen, 0.05, 0.05);
      disposableGeoms.push(jibGeo);
      const jib = new THREE.Mesh(jibGeo, craneMat);
      jib.position.set(craneX + jibLen / 2 - 0.1, craneH, craneBaseZ);
      jib.castShadow = true;
      buildingGroup.add(jib);
      const counterGeo = new THREE.BoxGeometry(counterLen, 0.05, 0.05);
      disposableGeoms.push(counterGeo);
      const counterJib = new THREE.Mesh(counterGeo, craneMat);
      counterJib.position.set(craneX - counterLen / 2 - 0.05, craneH, craneBaseZ);
      buildingGroup.add(counterJib);
      // counterweight block
      box(0.14, 0.16, 0.12, craneDarkMat, craneX - counterLen - 0.05, craneH - 0.08, craneBaseZ);

      // trolley + hoist cable down to a small load hook
      const trolleyX = craneX + jibLen * 0.55;
      box(0.06, 0.05, 0.06, craneDarkMat, trolleyX, craneH - 0.03, craneBaseZ);
      const cableGeo = new THREE.CylinderGeometry(0.004, 0.004, 0.5, 4);
      disposableGeoms.push(cableGeo);
      const cable = new THREE.Mesh(cableGeo, craneDarkMat);
      cable.position.set(trolleyX, craneH - 0.28, craneBaseZ);
      buildingGroup.add(cable);
      const hookGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
      disposableGeoms.push(hookGeo);
      const hook = new THREE.Mesh(hookGeo, rawConcreteMat);
      hook.position.set(trolleyX, craneH - 0.55, craneBaseZ);
      buildingGroup.add(hook);

      // ground-level perimeter hoarding (site fence) around the base
      const fenceGeo = new THREE.BoxGeometry(w + 0.9, 0.14, 0.03);
      disposableGeoms.push(fenceGeo);
      [
        { pos: [0, 0.07, d / 2 + 0.35] as [number, number, number], rot: 0 },
        { pos: [0, 0.07, -d / 2 - 0.35] as [number, number, number], rot: 0 },
      ].forEach(({ pos, rot }) => {
        const seg = new THREE.Mesh(fenceGeo, craneDarkMat);
        seg.position.set(pos[0], pos[1], pos[2]);
        seg.rotation.y = rot;
        buildingGroup.add(seg);
      });

      // small parked site vehicle out front
      const van = box(0.22, 0.12, 0.12, trimMat, -w / 2 + 0.1, 0.06, d / 2 + 0.35);
      van.castShadow = true;

      return craneH + 0.3;
    }

    const builders = [
      buildSkyscraper,
      buildOfficeSlab,
      buildResidentialTower,
      buildTerracedLowrise,
      buildIndustrialHub,
      buildConstructionCraneTower,
    ];
    let buildingTopY: number;
    try {
      buildingTopY = builders[variant % builders.length]();
    } catch (err) {
      console.error("BuildingScene: variant failed to build, falling back", err);
      buildingGroup.clear();
      buildingTopY = buildSkyscraper();
    }

    buildingGroup.traverse((obj) => {
      if (obj instanceof THREE.InstancedMesh) litMeshes.push(obj);
    });

    // Ground plinth
    const groundGeo = new THREE.CircleGeometry(5, 48);
    disposableGeoms.push(groundGeo);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    buildingGroup.add(ground);

    buildingGroup.scale.setScalar(finalScale);
    const bx = isMobile ? 1.4 : isTablet ? 1.9 : 2.5;
    const by = isMobile ? -1.55 : isTablet ? -1.25 : -1.0;
    buildingGroup.position.set(bx, by, -1);
    buildingGroup.rotation.y = -0.5;
    scene.add(buildingGroup);
    const baseGroupY = buildingGroup.position.y;

    // ---- Mouse parallax --------------------------------------------------------
    const pointer = { x: 0, y: 0 };
    const smoothed = { x: 0, y: 0 };
    const canInteract = mouseInteraction && !prefersReducedMotion;

    function setPointerFromClient(clientX: number, clientY: number) {
      const rect = container!.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((clientY - rect.top) / rect.height) * 2 - 1;
    }
    function handlePointerMove(e: PointerEvent) {
      setPointerFromClient(e.clientX, e.clientY);
    }
    function handleTouchMove(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch) setPointerFromClient(touch.clientX, touch.clientY);
    }
    if (canInteract) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
    }

    // ---- Resize -----------------------------------------------------------------
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

    // ---- Visibility ----------------------------------------------------------------
    let isVisible = true;
    function handleVisibilityChange() {
      isVisible = document.visibilityState === "visible";
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // ---- Animation loop --------------------------------------------------------------
    let rafId = 0;
    const clock = new THREE.Clock();
    const idle = animation && !prefersReducedMotion;

    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;
      const t = clock.getElapsedTime();

      if (canInteract) {
        smoothed.x += (pointer.x - smoothed.x) * 0.035;
        smoothed.y += (pointer.y - smoothed.y) * 0.035;
        // The building deliberately doesn't track the cursor 1:1: it turns the
        // opposite way horizontally (like a solid object being looked around,
        // not a flat layer dragged with the pointer) and adds a slight
        // cross-axis tilt so its motion path never matches the cursor's.
        buildingGroup.rotation.y = -0.5 - smoothed.x * 0.09 + smoothed.y * 0.025;
        buildingGroup.rotation.z = smoothed.x * 0.015;
        camera.position.x = smoothed.x * 0.18;
        camera.position.y = 1.6 + smoothed.y * 0.12;
        camera.lookAt(buildingGroup.position.x, buildingTopY * 0.3, 0);
      }

      if (idle) {
        buildingGroup.position.y = baseGroupY + Math.sin(t * 0.5) * 0.035;
        const glow = 0.5 + Math.sin(t * 0.7) * 0.1;
        windowLitMat.emissiveIntensity = glow;
      }

      camLight.position.set(camera.position.x + 2, camera.position.y + 3, camera.position.z + 2);

      renderer.render(scene, camera);
    }
    animate();

    // ---- Cleanup ------------------------------------------------------------------------
    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (canInteract) {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("touchmove", handleTouchMove);
      }
      disposableGeoms.forEach((g) => g.dispose());
      disposableMats.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    />
  );
}
