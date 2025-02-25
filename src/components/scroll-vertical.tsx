import { ReactNode } from "react";

export default function ScrollVertical({ children }: {children: ReactNode}) {
  return (
    <div className="overflow-y-auto pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] -mt-16 pt-16 w-full">
      {children}
    </div>
  );
}