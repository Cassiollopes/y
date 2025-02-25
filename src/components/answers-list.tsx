"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Tweet from "./tweet";
import { User } from "@supabase/supabase-js";
import { TweetWithAuthor } from "@/utils/types";

export default function AnswersList({
  tweet,
  user,
}: {
  tweet: TweetWithAuthor;
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
    <div key={tweet.id}>
      <Tweet
        tweet={tweet}
        user={user}
        tweetWithAnswer={true}
      />
      {tweet.answers.length > 0 && (
        <div>
          <div>
            {/* {showAnswers[tweet.id] && ( */}
              <div>
                {tweet.answers.map((answer) => (
                  <Tweet key={answer.id} tweet={answer as TweetWithAuthor} user={user} />
                ))}
              </div>
            {/* )} */}
            {/* <div
              onClick={() =>
                setShowAnswers((prev) => ({
                  ...prev,
                  [tweet.id]: !prev[tweet.id],
                }))
              }
              className="w-full p-4 pt-0 flex items-center text-sky-500 cursor-pointer h-[32px]"
            >
              <div className="w-[40px] flex flex-col gap-1 items-center justify-center h-[32px]">
                <div className="h-[50%] w-[1.6px] bg-zinc-500/50"></div>
                <div className="h-[30%] w-[1.6px] bg-zinc-500/50"></div>
                <div className="h-[20%] w-[1.6px] bg-zinc-500/50"></div>
              </div>
              <p>
                {!showAnswers[tweet.id]
                  ? `Mostrar Respostas`
                  : "Ocultar Respostas"}
              </p>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
