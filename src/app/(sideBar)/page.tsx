import Feed from "@/components/feed";
import Header from "@/components/header";
import ScrollVertical from "@/components/scroll-vertical";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("tweets")
    .select(
      "*, author: profiles(*), likes(*), answers: tweets(*)"
    )
    .is("tweet_id", null);

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      user_has_liked: !!tweet.likes.find((like) => like.user_id === user.id),
      likes: tweet.likes.length,
    })) || [];

  return (
    <>
      <Header>
        <div className="h-full py-4 relative">
          <p className="font-bold text-sm">Para você</p>
          <div className="absolute bottom-0 bg-sky-500 h-1 w-full rounded-full"></div>
        </div>
      </Header>
      <ScrollVertical>
        <Feed tweets={tweets} user={user} />
      </ScrollVertical>
    </>
  );
}