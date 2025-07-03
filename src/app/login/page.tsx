import AuthButton from "@/components/auth-button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BsGithub, BsGoogle } from "react-icons/bs";

export const dynamic = "force-dynamic";

export default async function Login() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-4 justify-center h-screen items-center p-4">
      <div className="border p-8 rounded-3xl bg-white/5 flex flex-col gap-1 items-center w-full max-w-[400px]">
        <AuthButton provider="google" icon={<BsGoogle />} />
        ou
        <AuthButton provider="github" icon={<BsGithub />} />
      </div>
    </div>
  );
}