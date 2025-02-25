import { ReactNode } from "react";

export default function Header({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-b px-4 border-zinc-700/75 w-full backdrop-blur-lg bg-black/70 z-50 flex justify-around ${className}`}
    >
      {children}
    </div>
  );
}
