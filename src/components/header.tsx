"use client";

export default function Header({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`sticky top-0 border-b px-4 ""-700/75 w-full backdrop-blur-lg bg-black/70 z-50 flex justify-around ${props.className}`}
    >
      {props.children}
    </div>
  );
}
