"use client";

import Image from "next/image";
import { ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = { children: ReactNode };

export default function AuthWrapper({ children }: Props) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Phone: once on mount (layout stays across auth routes)
  useGSAP(
    () => {
      const image = imageRef.current;
      if (!image) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

      if (reducedMotion || !isDesktop) {
        gsap.set(image, { yPercent: 0, clearProps: "transform" });
        return;
      }

      gsap.fromTo(
        image,
        { yPercent: 100 },
        { yPercent: 0, duration: 1.25, ease: "power4.out" },
      );
    },
    { scope: containerRef },
  );

  // Form panel: every auth route change
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(panel, {
          autoAlpha: 1,
          xPercent: 0,
          clearProps: "opacity,visibility,transform",
        });
        return;
      }

      gsap.fromTo(
        panel,
        { autoAlpha: 0, xPercent: 100 },
        { autoAlpha: 1, xPercent: 0, duration: 0.9, ease: "power4.out" },
      );
    },
    { scope: containerRef, dependencies: [pathname] },
  );

  return (
    <div
      ref={containerRef}
      className="h-dvh overflow-hidden bg-[#282423] lg:grid lg:grid-cols-2"
    >
      <div className="hidden h-full w-full overflow-hidden lg:flex items-end justify-center">
        <div ref={imageRef} className="will-change-transform">
          <Image
            src="/images/mockups/mobile-in-hand.png"
            alt="mobile-in-hand"
            width={800}
            height={500}
            quality={75}
            priority
            className="h-auto w-auto lg:w-3xl"
          />
        </div>
      </div>
      <div
        ref={panelRef}
        className="flex h-full w-full flex-col items-center justify-center overflow-hidden bg-white lg:rounded-l-8xl"
      >
        {children}
      </div>
    </div>
  );
}
