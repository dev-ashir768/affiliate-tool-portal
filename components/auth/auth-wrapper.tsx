"use client";

import Image from "next/image";
import { ReactNode } from "react";

type Props = { children: ReactNode };

export default function AuthWrapper({ children }: Props) {
  return (
    <>
      <div className="h-dvh lg:grid lg:grid-cols-2 bg-[#282423]">
        <div className="hidden w-full h-full lg:flex justify-center items-end">
          <div>
            <Image
              src="/images/banners/mobile-in-hand.png"
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
