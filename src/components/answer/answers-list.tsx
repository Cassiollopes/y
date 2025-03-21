"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Tweet from "../tweet";
import { TweetWithAuthor } from "@/utils/types";
import { AnswerProps } from ".";
import { SubmitButton } from "../button";
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
      <div className="p-4 md:pb-6 pt-2">
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
      <SubmitButton onClick={() => setShowInput(true)} variant="mobileIcon">
        <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-white">
          <g>
            <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
          </g>
        </svg>
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
