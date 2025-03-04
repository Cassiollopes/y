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
      <div>
        <NewTweet user={user} />
      </div>
      {tweets.map((tweet) => (
        <div key={tweet.id}>
          <Tweet tweet={tweet} user={user} />
          <SubmitButton
            onClick={() => setShowInput(true)}
            className="w-[50px] h-[50px] rounded-full shadow-sm shadow-white fixed bottom-16 right-6 md:hidden"
          >
            <LuSend className="h-5 w-5 absolute" />
          </SubmitButton>
          {showInput && (
            <NewTweetAbsolute
              user={user}
              tweet={tweet}
              callback={() => setShowInput(false)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
