"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Logo3D({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 5;

    // ── Lights ────────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xe9e612, 3.5, 14);
    rimLight.position.set(-3, -1, 2);
    scene.add(rimLight);

    const topLight = new THREE.PointLight(0xffffff, 1.5, 12);
    topLight.position.set(0, 5, 3);
    scene.add(topLight);

    // ── Load logo texture ─────────────────────────────────────────────────────
    const group = new THREE.Group();
    scene.add(group);

    const texLoader = new THREE.TextureLoader();
    texLoader.load("/images/logo.webp", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;

      const imgW = tex.image.width as number;
      const imgH = tex.image.height as number;
      const aspect = imgW / imgH;

      const planeH = 2.2;
      const planeW = planeH * aspect;

      // ── Main logo plane ────────────────────────────────────────────────────
      const mainGeo = new THREE.PlaneGeometry(planeW, planeH, 1, 1);
      const mainMat = new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        alphaTest: 0.05,
        metalness: 0.3,
        roughness: 0.4,
        emissive: new THREE.Color(0xffffff),
        emissiveMap: tex,
        emissiveIntensity: 0.08,
        side: THREE.FrontSide,
      });
      const mainMesh = new THREE.Mesh(mainGeo, mainMat);
      mainMesh.position.z = 0;
      group.add(mainMesh);

      // ── Depth shadow layers (stacked behind, offset = 3D extrusion illusion) ─
      for (let i = 1; i <= 5; i++) {
        const depthGeo = new THREE.PlaneGeometry(planeW, planeH, 1, 1);
        const depthMat = new THREE.MeshBasicMaterial({
          map: tex,
          transparent: true,
          alphaTest: 0.05,
          opacity: 0.12 - i * 0.018,
          color: new THREE.Color(0xe9e612),
        });
        const depthMesh = new THREE.Mesh(depthGeo, depthMat);
        depthMesh.position.z = -i * 0.06;
        depthMesh.position.x = i * 0.012;
        depthMesh.position.y = -i * 0.006;
        group.add(depthMesh);
      }

      // ── Yellow glow halo plane (large, blurred soft quad behind logo) ──────
      const haloGeo = new THREE.PlaneGeometry(planeW * 1.8, planeH * 1.8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xe9e612,
        transparent: true,
        opacity: 0.06,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.z = -0.5;
      group.add(haloMesh);
    });

    // ── Mouse parallax ────────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const lerp = { x: 0, y: 0 };
    const onMouse = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Animation loop ────────────────────────────────────────────────────────
    const startMs = performance.now();
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = (performance.now() - startMs) / 1000;

      lerp.x += (mouse.x * 0.3 - lerp.x) * 0.05;
      lerp.y += (mouse.y * 0.18 - lerp.y) * 0.05;

      // Float + mouse tilt
      group.position.y = Math.sin(t * 0.5) * 0.1;
      group.rotation.y = lerp.x * 0.28;
      group.rotation.x = lerp.y * 0.18;

      // Rim light orbit
      rimLight.position.x = Math.sin(t * 0.35) * 4;
      rimLight.position.y = Math.cos(t * 0.28) * 2;

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
}
