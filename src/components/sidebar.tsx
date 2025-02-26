"use client";

import { NameFormatter, UserNameFormatter } from "@/utils/format";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiDotsHorizontal } from "react-icons/hi";
import { LuSend } from "react-icons/lu";
import { SubmitButton } from "./button";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import NewTweetAbsolute from "./new-tweet-absolute";

export default function SideBar({ user }: { user: User }) {
  const [showInput, setShowInput] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleHideInput = () => {
    setShowInput(false);
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };
  const userName = UserNameFormatter(
    user.user_metadata.user_name || user.user_metadata.name
  );

  return (
    <div className="flex max-xl:justify-end py-1 max-lg:pl-2 lg:w-[20%] max-md:hidden">
      <div className="flex flex-col max-xl:items-center max-xl:w-fit w-full">
        <SideButton className="w-[50px] h-[50px] justify-center gap-0 mb-0.5">
          <h1 className="text-4xl font-serif">Y</h1>
        </SideButton>
        <SideButton
          label="Página Inicial"
          link="/"
          icon={<GoHome className="h-8 w-8" />}
          iconFill={<GoHomeFill className="h-8 w-8" />}
          pathname={pathname}
        />
        <SubmitButton
          onClick={() => setShowInput(true)}
          className="bg-white xl:p-3.5 mt-2 rounded-full text-black font-bold w-[90%] max-xl:w-[50px] max-xl:h-[50px] relative"
        >
          <p className="max-xl:hidden">Postar</p>
          <LuSend className="xl:hidden h-5 w-5 absolute" />
        </SubmitButton>
        {showInput && (
          <NewTweetAbsolute
            user={user}
            callback={handleHideInput}
          />
        )}
        <div className="relative">
          <SideButton
            className="mt-4 xl:w-full"
            onClick={() => setShowSignOut(true)}
            style={{ gap: "8px" }}
          >
            <Image
              src={user.user_metadata.avatar_url}
              alt={user.id}
              width={40}
              height={40}
              className="rounded-full w-[40px] h-[40px]"
            />
            <div className="w-full flex justify-between items-center max-xl:hidden">
              <div className="text-base flex flex-col items-start">
                <p>{NameFormatter(user.user_metadata.name)}</p>
                <p className="font-light text-zinc-500">{userName}</p>
              </div>
              <HiDotsHorizontal className="h-4 w-4" />
            </div>
          </SideButton>
          {showSignOut && (
            <div>
              <div
                onClick={() => setShowSignOut(false)}
                className="fixed top-0 left-0 w-full h-full z-[100]"
              ></div>
              <button
                onClick={signOut}
                className="absolute flex -bottom-13 p-4 left-1/2 transform -translate-x-1/2 text-sm font-extrabold shadow-md rounded-2xl bg-background w-[300px] z-[200] hover:bg-zinc-900"
                style={{ boxShadow: "0px 0px 7px rgba(255, 255, 255, 0.5)" }}
              >
                Sair de {userName}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SideButton({
  label,
  link,
  icon,
  iconFill,
  pathname,
  ...props
}: {
  label?: string;
  link?: string;
  icon?: ReactNode;
  iconFill?: ReactNode;
  pathname?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return link ? (
    <Link
      href={link}
      className={`xl:w-full group cursor-pointer ${props.className}`}
      style={props.style}
    >
      <div
        className={`text-white/95 ${
          pathname === link ? "font-bold" : ""
        } text-xl p-3 rounded-full group-hover:bg-white/10 transition-all duration-200 items-center flex w-fit ${
          props.className
        }`}
        style={{ gap: props.style?.gap || "16px" }}
      >
        {pathname === link ? iconFill : icon}
        {props.children}
        {label && <p className="pr-5 max-xl:hidden">{label}</p>}
      </div>
    </Link>
  ) : (
    <button
      {...props}
      className={`xl:w-full group cursor-pointer ${props.className}`}
      style={props.style}
    >
      <div
        className={`text-white/95 font-bold text-xl p-3 rounded-full group-hover:bg-white/10 transition-all duration-200 items-center flex w-fit ${props.className}`}
        style={{ gap: props.style?.gap || "16px" }}
      >
        {props.children}
        {label && <p className="pr-5 max-xl:hidden">{label}</p>}
      </div>
    </button>
  );
}
