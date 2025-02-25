"use client"

import { User } from "@supabase/supabase-js";
import NewTweet from "./new-tweet";
import { TweetWithAuthor } from "@/utils/types";
import Tweet from "./tweet";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Feed({
  tweets,
  user,
}: {
  tweets: TweetWithAuthor[];
  user: User;
}) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, supabase]);

  return (
    <div>
      <div>
        <NewTweet user={user} />
      </div>
      {tweets.map((tweet) => (
        <div key={tweet.id}>
          <Tweet tweet={tweet} user={user} />
        </div>
      ))}
    </div>
  );
}
