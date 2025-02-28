"use client";

import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { useState } from "react";

export default function Header({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [visible, setVisible] = useState(true);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const previous = scrollYProgress.getPrevious();
      const direction = current - (previous || 0);
      const pixelHeight = window.innerHeight;
      const pixelDifference = Math.abs(direction * pixelHeight);

      if (direction > 0) {
        setVisible(false);
      } else if (
        direction < 0 &&
        pixelDifference >= 5 &&
        Math.floor(pixelDifference) % 5 === 0
      ) {
        setVisible(true);
      }
    }
  });

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={
        window.innerWidth < 768 && {
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }
      }
      transition={{ duration: 0.3 }}
      className={`sticky top-0 border-b px-4 ""-700/75 w-full backdrop-blur-lg bg-black/70 z-50 flex justify-around ${props.className}`}
    >
      {props.children}
    </motion.div>
  );
}
