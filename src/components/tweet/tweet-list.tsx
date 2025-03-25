"use server"

import { createClient } from "@/utils/supabase/server";
import Tweet from ".";
import RefreshWrapper from "./RefreshWrapper";

export default async function TweetList() {
  const supabase = await createClient();

  const {
      data: { user },
      } = await supabase.auth.getUser();
  
    if (!user) {
      return null;
    }

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
    <RefreshWrapper>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} tweet={tweet} user={user} />
      ))}
    </RefreshWrapper>
  );
}