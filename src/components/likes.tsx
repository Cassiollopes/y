"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
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
      icon={<AiOutlineHeart className="h-[19px] w-[19px]" />}
      fill={userHasLiked}
      iconFill={<AiFillHeart className="fill-pink-600 h-[19px] w-[19px]" />}
      color="pink"
      text={optimisticLikes}
    />
  );
}
