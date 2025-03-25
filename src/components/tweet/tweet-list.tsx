"use client";

import { User } from "@supabase/supabase-js";
import Tweet from ".";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TweetWithAuthor } from "@/utils/types";
import Image from "next/image";

interface TweetListProps {
  user: User;
}

export default function TweetList({ user }: TweetListProps) {
  const supabase = createClient();
  const [tweets, setTweets] = useState<TweetWithAuthor[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchTweets = async () => {
      const { data } = await supabase
        .from("tweets")
        .select("*, author: profiles(*), likes(*), answers: tweets(*)")
        .is("tweet_id", null)
        .order("created_at", { ascending: false });

      const tweets =
        data?.map((tweet) => ({
          ...tweet,
          user_has_liked: !!tweet.likes.find(
            (like) => like.user_id === user.id
          ),
          likes: tweet.likes.length,
        })) || [];

      setTweets(tweets);
    };

    fetchTweets();

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
  }, [router, supabase, user]);

  return (
    <>
      {tweets.length > 0 ? (
        <div>
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} user={user} />
          ))}
        </div>
      ) : (
        <Image
          width={40}
          height={40}
          src="/loading.svg"
          alt="Loading"
          className="pt-16 opacity-60 m-auto"
        />
      )}
    </>
  );
}
