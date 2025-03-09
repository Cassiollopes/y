import Nav from "@/components/nav";
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
    <div className="flex max-md:flex-col-reverse max-md:items-center max-md:mx-0 max-xl:mx-[4vw] min-h-screen max-w-[1260px] m-auto md:items-start xl:justify-start gap-2 xl:gap-3 relative">
      <Nav user={user} />
      <div className="flex-1 flex gap-8 xl:max-w-[75vw] w-full">
        <div className="flex flex-col min-h-screen items-center w-full md:max-w-[602px] justify-start md:border-r md:border-l pb-8">
          {children}
        </div>
        <div className="pt-1.5 hidden lg:flex flex-1 sticky top-0 h-full gap-4 flex-col">
          <div className="w-full border rounded-full items-center p-3 py-2 flex flex-col gap-4 ">
            <p className="font-bold text-lg ">Created by Cassio</p>
          </div>
          <div className="w-full border rounded-2xl p-4 py-3 flex flex-col gap-4 ">
            <p className="font-bold text-xl">Perfis</p>
            <Link
              target="_blank"
              href="https://github.com/cassiollopes"
              className=" gap-3 flex items-center group hover:opacity-85 transition-all duration-200"
            >
              <BsGithub className="h-8 w-8" />
              <p className="group-hover:underline">github.com/cassiollopes</p>
              <BsLink className="ml-auto" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
