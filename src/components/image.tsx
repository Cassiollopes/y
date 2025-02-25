"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageUpload({ url }: { url: string }) {
  const supabase = createClient();
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("images")
          .download(path);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setImageUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (url) downloadImage(url);
  }, [url, supabase]);

  return imageUrl ? (
    <Image
      src={imageUrl}
      alt={""}
      width={500}
      height={500}
      className="rounded-2xl border border-zinc-700/50 mt-3 w-full h-fit max-h-[500px] object-contain"
    />
  ) : (
    <div></div>
  );
}
