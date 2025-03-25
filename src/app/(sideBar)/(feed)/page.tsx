import Feed from "@/components/tweet/tweet-list";
import { Suspense } from "react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  return (
    <div className="w-full border-t">
      <Suspense
        fallback={
          <Image
            width={40}
            height={40}
            src="/loading.svg"
            alt="Loading"
            className="pt-16 opacity-60 m-auto"
          />
        }
      >
        <Feed />
      </Suspense>
    </div>
  );
}
