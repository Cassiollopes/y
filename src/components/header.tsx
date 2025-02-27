"use client";

import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { useState } from "react";

export default function Header({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const previous = scrollYProgress.getPrevious();
      const direction = current - previous!;

      const pixelHeight = window.innerHeight;
      const pixelDifference = Math.abs(direction * pixelHeight);

      if (scrollYProgress.get() === 0) {
        setVisible(true);
      } else {
        if (direction < 0) {
          if (pixelDifference >= 5 && Math.floor(pixelDifference) % 5 === 0) {
            setVisible(true);
          }
        } else if (direction > 0) {
          setVisible(false);
        }
      }
    }
  });

  return (
    <motion.div
      initial={{ opacity: 1 }}
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
