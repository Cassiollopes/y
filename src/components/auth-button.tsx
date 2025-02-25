"use client";

import { createClient } from "@/utils/supabase/client";
import { Provider } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

export default function AuthButton({
  provider,
  icon,
  logged,
}: {
  provider?: Provider;
  icon: ReactNode;
  logged?: boolean;
}) {
  const supabase = createClient();
  const router = useRouter()

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: provider!,
      options: {
        redirectTo: `${location.origin}}auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh()
  };

  return (
    <button
      className="bg-white w-fit px-4 p-2 rounded-full text-black flex items-center gap-2"
      onClick={logged ? signOut : signIn}
    >
      {icon}
      {logged ? "SignOut" : `SignIn com ${provider}`}
    </button>
  );
}
