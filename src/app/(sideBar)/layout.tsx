import SideBar from "@/components/sidebar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BsGithub, BsLink } from "react-icons/bs";

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
    <div className="flex max-md:mx-0 max-xl:mx-[4vw] min-h-screen max-w-[1260px] m-auto items-start justify-start xl:justify-start gap-2 xl:gap-3 relative">
      <SideBar user={user} />
      <div className="flex-1 flex gap-8 xl:max-w-[75vw]">
        <div className="flex flex-col min-h-screen items-center w-full md:max-w-[602px] justify-start md:border-r md:border-l border-zinc-700/75 pb-8">
          {children}
        </div>
        <div className="pt-1.5 hidden lg:flex flex-1 sticky top-0 h-full gap-4 flex-col">
          <p className="font-bold text-xl text-white/95">Created by Cassio</p>
          <div className="w-full border border-zinc-700/75 rounded-2xl p-4 py-3 flex flex-col gap-4 text-white/95">
            <p className="font-bold text-xl">Perfis</p>
            <Link
              href="https://github.com/cassiollopes"
              className=" gap-3 flex items-center group hover:opacity-85 transition-all duration-200"
            >
              <BsGithub className="h-8 w-8" />
              <p className="group-hover:underline">github.com/cassiollopes</p>
              <BsLink className="ml-auto"/>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
