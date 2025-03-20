"use server";

import { User } from "@supabase/supabase-js";
import Tweet from ".";
import { createClient } from "@/utils/supabase/server";

interface TweetListProps {
  user: User;
}

export default async function TweetList({ user }: TweetListProps) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("tweets")
    .select("*, author: profiles(*), likes(*), answers: tweets(*)")
    .is("tweet_id", null)
    .order("created_at", { ascending: false });

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      user_has_liked: !!tweet.likes.find((like) => like.user_id === user.id),
      likes: tweet.likes.length,
    })) || [];

  return (
    <div>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} user={user} />
      ))}
    </div>
  );
}
