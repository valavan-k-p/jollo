"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";

export default function RouteController() {
  const pathname = usePathname();
  const { scene } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) {
      groupRef.current = new THREE.Group();
      const children = [...scene.children];
      children.forEach((child) => {
        if (child.type !== "AmbientLight" && child.type !== "DirectionalLight" && child !== groupRef.current) {
          groupRef.current?.add(child);
        }
      });
      scene.add(groupRef.current);
    }

    const isHome = pathname === "/";

    if (isHome) {
      gsap.to(groupRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          if (groupRef.current) groupRef.current.visible = false;
        }
      });
    } else {
      if (groupRef.current) groupRef.current.visible = true;
      
      let targetX = 0;
      let targetY = 0;
      
      if (pathname === "/about") {
        targetX = 1;
      } else if (pathname === "/contact") {
        targetX = -1;
        targetY = 0.5;
      } else if (pathname === "/work") {
        targetY = -1;
      }

      gsap.to(groupRef.current.position, {
        x: targetX,
        y: targetY,
        duration: 1.5,
        ease: "power3.out"
      });

      gsap.to(groupRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.5,
        ease: "elastic.out(1, 0.7)"
      });
    }
  }, [pathname, scene]);

  return null;
}
