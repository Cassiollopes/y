import AuthButton from "@/components/auth-button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BsGithub, BsGoogle } from "react-icons/bs";

export default async function Login() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-4 justify-center h-screen items-center">
      <AuthButton
        provider="google"
        icon={<BsGoogle />}
      />
      <AuthButton
        provider="github"
        icon={<BsGithub />}
      />
    </div>
  );
}

export const dynamic = "force-dynamic";