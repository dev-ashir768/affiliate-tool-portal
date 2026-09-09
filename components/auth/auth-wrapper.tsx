"use client";

import Image from "next/image";
import { ReactNode, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Props = { children: ReactNode };

export default function AuthWrapper({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(imageRef.current, {
        y: "100%",
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2,
      });
    },
    { scope: containerRef },
  );
  return (
    <>
      <div className="h-dvh lg:grid lg:grid-cols-2 bg-[#282423]">
        <div
          ref={containerRef}
          className="hidden w-full h-full lg:flex justify-center items-end"
        >
          <div ref={imageRef} className="will-change-transform">
            <Image
              src="/images/mockups/mobile-in-hand.png"
              alt="mobile-in-hand"
              width={800}
              height={500}
              quality={75}
              className="lg:w-3xl"
            />
          </div>
        </div>
        <div className="w-full h-full flex flex-col justify-center items-center lg:rounded-l-8xl overflow-hidden bg-white">
          {children}
        </div>
      </div>
    </>
  );
}
