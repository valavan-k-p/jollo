"use client";
import { useState, useCallback, useEffect } from "react";
import Preloader from "@/components/ui/Preloader";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("jollo_preloaded") === "1") {
      setDone(true);
    }
    setReady(true);
  }, []);

  const onComplete = useCallback(() => {
    setDone(true);
    sessionStorage.setItem("jollo_preloaded", "1");
  }, []);

  return (
    <>
      {ready && !done && <Preloader onComplete={onComplete} />}
      {children}
    </>
  );
}
