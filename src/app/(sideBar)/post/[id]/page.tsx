import AnswersList from "@/components/answers-list";
import PostHeader from "@/components/post-header";
import ScrollVertical from "@/components/scroll-vertical";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
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
      "*, author: profiles(*), likes(*), answers: tweets(*, answers: tweets(*), author: profiles(*), likes(*))"
    )
    .eq("id", id);

  const tweet = data?.[0]
    ? {
        ...data[0],
        user_has_liked: !!data[0].likes.find(
          (like) => like.user_id === user.id
        ),
        likes: data[0].likes.length,
      answers: data[0].answers.map((answer) => ({
        ...answer,
        user_has_liked: !!answer.likes.find((like) => like.user_id === user.id),
        likes: answer.likes.length,
      })),
      }
    : null;

  if (!tweet) {
    return <div>Tweet not found</div>;
  }

  return (
    <>
      <PostHeader tweet={tweet} user={user} />
      <ScrollVertical>
        <AnswersList tweet={tweet} user={user} />
      </ScrollVertical>
    </>
  );
}
