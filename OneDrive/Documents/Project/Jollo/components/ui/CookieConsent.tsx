"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { useRef } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const consent = localStorage.getItem("jollo-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (visible && bannerRef.current) {
      gsap.fromTo(
        bannerRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "expo.out" }
      );
    }
  }, [visible]);

  const handleAccept = () => {
    localStorage.setItem("jollo-cookie-consent", "accepted");
    dismiss();
  };

  const handleDecline = () => {
    localStorage.setItem("jollo-cookie-consent", "declined");
    dismiss();
  };

  const dismiss = () => {
    if (bannerRef.current) {
      gsap.to(bannerRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => setVisible(false),
      });
    }
  };

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[999] opacity-0"
    >
      <div className="bg-[#111111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 backdrop-blur-xl" style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
        <p className="font-display text-sm font-semibold text-white mb-2">
          We value your privacy
        </p>
        <p className="font-body text-xs text-white/50 leading-relaxed mb-5">
          We use cookies to enhance your browsing experience, analyse site traffic, and personalise content. By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies.
        </p>
        <div className="flex items-center gap-3">
          <button onClick={handleAccept} className="jbtn jbtn--primary jbtn--sm flex-1">
            Accept
          </button>
          <button onClick={handleDecline} className="jbtn jbtn--ghost jbtn--sm flex-1">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
