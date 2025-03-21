"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import ActionButton from "./button";
import { TweetWithAuthor } from "@/utils/types";
import { useState } from "react";

export default function Likes({ tweet }: { tweet: TweetWithAuthor }) {
  const router = useRouter();
  const [optimisticLikes, setOptimisticLikes] = useState(tweet.likes);
  const [userHasLiked, setUserHasLiked] = useState(tweet.user_has_liked);

  const handleLike = async () => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      if (userHasLiked) {
        setOptimisticLikes(optimisticLikes - 1);
        setUserHasLiked(false);
        await supabase
          .from("likes")
          .delete()
          .match({ user_id: user.id, tweet_id: tweet.id });
      } else {
        setOptimisticLikes(optimisticLikes + 1);
        setUserHasLiked(true);
        await supabase.from("likes").insert({
          user_id: user.id,
          tweet_id: tweet.id,
        });
      }
    }

    router.refresh();
  };

  return (
    <ActionButton
      label="Curtir"
      fillLabel="Desfazer curtida"
      onClick={handleLike}
      icon={
        <svg viewBox="0 0 24 24" className="h-[18.75px] w-[18.75px]">
          <g>
            <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
          </g>
        </svg>
      }
      fill={userHasLiked}
      iconFill={
        <svg viewBox="0 0 24 24" className="h-[18.75px] w-[18.75px] fill-pink-600">
          <g>
            <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
          </g>
        </svg>
      }
      color="pink"
      text={optimisticLikes}
    />
  );
}
