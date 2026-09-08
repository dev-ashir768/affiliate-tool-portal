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
            <Image src="/images/banners/mobile-in-hand.png" alt="mobile-in-hand" width={800} height={500} />
          </div>
        </div>
        <div className="w-full h-full flex justify-center items-center rounded-l-8xl overflow-hidden bg-white">
          <div>
            <Image src="/images/branding/logo.png" alt="logo" width={100} height={60} />
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
