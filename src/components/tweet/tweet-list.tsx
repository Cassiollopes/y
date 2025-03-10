"use client";

import { User } from "@supabase/supabase-js";
import NewTweet from "./new-tweet";
import { TweetWithAuthor } from "@/utils/types";
import Tweet from ".";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { SubmitButton } from "../button";
import { LuSend } from "react-icons/lu";
import NewTweetAbsolute from "./new-tweet-absolute";

interface TweetListProps {
  tweets: TweetWithAuthor[];
  user: User;
}

export default function TweetList({ tweets, user }: TweetListProps) {
  const supabase = createClient();
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);

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
      <div className="max-md:hidden">
        <NewTweet user={user} />
      </div>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} user={user} />
      ))}
      <SubmitButton onClick={() => setShowInput(true)} variant={"mobileIcon"}>
        <LuSend />
      </SubmitButton>
      {showInput && (
        <NewTweetAbsolute user={user} callback={() => setShowInput(false)} />
      )}
    </div>
  );
}
