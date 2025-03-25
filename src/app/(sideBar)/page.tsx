import Feed from "@/components/tweet/tweet-list";
import Header from "@/components/header";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NewTweet from "@/components/tweet/new-tweet";

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

  return (
    <div className="w-full">
      <Header className="max-md:border-none">
        <div className="h-full py-4 relative">
          <p className="font-bold text-sm">Para você</p>
          <div className="absolute bottom-0 bg-blue_twitter h-1 w-full rounded-full"></div>
        </div>
      </Header>
      <div className="max-md:hidden border-b">
        <NewTweet user={user} />
      </div>
      <Feed user={user} />
    </div>
  );
}
