"use client";

import { createClient } from "@/utils/supabase/client";
import { Provider } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface AuthButtonProps {
  provider: Provider;
  icon: ReactNode;
  logged?: boolean;
}

export default function AuthButton({ provider, icon, logged }: AuthButtonProps) {
  const supabase = createClient();
  const router = useRouter();

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: provider!,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <button
      className="bg-white w-full px-4 p-2 rounded-full text-black flex items-center justify-center gap-2 hover:opacity-80 transition-all font-bold"
      onClick={logged ? signOut : signIn}
    >
      {icon}
      {logged ? "Sair" : `Continuar com ${provider}`}
    </button>
  );
}
