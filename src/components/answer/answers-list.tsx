"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Tweet from "../tweet";
import { TweetWithAuthor } from "@/utils/types";
import { AnswerProps } from ".";
import { SubmitButton } from "../button";
import { BiMessage } from "react-icons/bi";
import NewTweetAbsolute from "../tweet/new-tweet-absolute";
import NewTweet from "../tweet/new-tweet";

export default function AnswersList({ tweet, user }: AnswerProps) {
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
    <div key={tweet.id}>
      <div className="px-4 md:pb-6 pt-2">
        <Tweet tweet={tweet} user={user} tweetWithAnswer={true} />
        <div className="max-md:hidden w-full">
          <NewTweet
            user={user}
            answer={true}
            answerOnTweet={true}
            tweetId={tweet.id}
          />
        </div>
      </div>
      {tweet.answers.length > 0 &&
        tweet.answers.map((answer) => (
          <Tweet
            key={answer.id}
            tweet={answer as TweetWithAuthor}
            user={user}
          />
        ))}
      <SubmitButton
        onClick={() => setShowInput(true)}
        variant="mobileIcon"
      >
        <BiMessage />
      </SubmitButton>
      {showInput && (
        <NewTweetAbsolute
          user={user}
          answer={true}
          tweet={tweet}
          callback={() => setShowInput(false)}
        />
      )}
    </div>
  );
}
