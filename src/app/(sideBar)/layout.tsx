import SideBar from "@/components/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen max-w-[1260px] m-auto items-start justify-start xl:justify-start gap-2 xl:gap-3 relative">
      <SideBar user={user} />
      <div className="flex flex-col h-screen items-center w-full lg:max-w-[600px] justify-start md:border-r md:border-l border-zinc-700/75">
        {children}
      </div>
    </div>
  );
}
