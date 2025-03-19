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

  return (
    <div
      className={`border w-full mt-3 rounded-2xl overflow-hidden  ${
        imageUrl ? "" : "h-[502px]"
      }`}
    >
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          width={500}
          height={500}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI/wN4oEBJWAAAAABJRU5ErkJggg=="
          className="w-full h-fit max-h-[500px] object-contain opacity-0 transition-opacity duration-300"
          onLoadingComplete={(img) => img.classList.remove("opacity-0")}
        />
      )}
    </div>
  );
}
