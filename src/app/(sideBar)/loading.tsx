"use client";

import Image from "next/image";
import { useLayoutEffect } from "react";

export default function Loading() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Image
      width={40}
      height={40}
      src="/loading.svg"
      alt="Loading"
      className="pt-16 opacity-60"
    />
  );
}
