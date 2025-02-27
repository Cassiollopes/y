"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Tweet from "../tweet";
import { TweetWithAuthor } from "@/utils/types";
import { AnswerProps } from ".";

export default function AnswersList({ tweet, user }: AnswerProps) {
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
    <div key={tweet.id}>
      <Tweet tweet={tweet} user={user} tweetWithAnswer={true} />
      {tweet.answers.length > 0 && (
        <div>
          <div>
            <div>
              {tweet.answers.map((answer) => (
                <Tweet
                  key={answer.id}
                  tweet={answer as TweetWithAuthor}
                  user={user}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
