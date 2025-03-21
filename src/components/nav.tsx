"use client";

import { NameFormatter, UserNameFormatter } from "@/utils";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { LuSend } from "react-icons/lu";
import { SubmitButton } from "./button";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import NewTweetAbsolute from "./tweet/new-tweet-absolute";

export default function Nav({ user }: { user: User }) {
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
    <div className="flex max-2xl:justify-end md:py-1 xl:w-[15%] 2xl:w-[20.7%] max-md:bottom-0 max-md:left-0 sticky md:top-0 z-[100] max-md:bg-black max-md:h-fit max-md:w-full max-md:justify-center">
      <div className="flex md:flex-col max-2xl:items-center md:w-fit w-full max-md:justify-center max-md:border-t gap-20 h-[52.5px]">
        <SideButton
          className="md:w-[50px] md:h-[50px] justify-center gap-0 md:mb-0.5 max-md:hidden "
          link="/"
        >
          <h1 className="text-4xl font-serif font-extrabold">Y</h1>
        </SideButton>
        <SideButton
          label="Página Inicial"
          link="/"
          icon={
            <svg
              viewBox="0 0 24 24"
              className="h-[26.25px] w-[26.25px] fill-white"
            >
              <g>
                <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z"></path>
              </g>
            </svg>
          }
          iconFill={
            <svg
              viewBox="0 0 24 24"
              className="h-[26.25px] w-[26.25px] fill-white"
            >
              <g>
                <path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z"></path>
              </g>
            </svg>
          }
          pathname={pathname}
        />
        {pathname === "/" && (
          <SubmitButton
            onClick={() => setShowInput(true)}
            variant={"mobileIcon"}
          >
            <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] fill-white">
              <g>
                <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z"></path>
              </g>
            </svg>{" "}
          </SubmitButton>
        )}

        {showInput && (
          <NewTweetAbsolute user={user} callback={() => setShowInput(false)} />
        )}
        <SubmitButton
          onClick={() => setShowInput(true)}
          className="max-md:hidden bg-white 2xl:p-3.5 mt-2 rounded-full text-black font-bold w-[90%] max-2xl:w-[50px] max-2xl:h-[50px] relative"
        >
          <p className="max-2xl:hidden">Postar</p>
          <LuSend className="2xl:hidden h-5 w-5 absolute" />
        </SubmitButton>
        <SideButton
          className="md:mt-4 2xl:w-full"
          onClick={() => setShowSignOut(true)}
          style={{ gap: "8px" }}
        >
          <Image
            src={user.user_metadata.avatar_url}
            alt={user.id}
            width={40}
            height={40}
            className="rounded-full w-[40px] h-[40px] max-md:h-[28px] max-md:w-[28px]"
          />
          <div className="w-full flex justify-between items-center max-2xl:hidden">
            <div className="text-[15px] flex flex-col items-start leading-5">
              <p>{NameFormatter(user.user_metadata.name)}</p>
              <p className="font-light text-zinc-500">{userName}</p>
            </div>
            <svg
              viewBox="0 0 24 24"
              className="h-[18.75px] w-[18.75px] fill-white"
            >
              <g>
                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
              </g>
            </svg>{" "}
          </div>
        </SideButton>
      </div>
      {showInput && <NewTweetAbsolute user={user} callback={handleHideInput} />}
      {showSignOut && (
        <>
          <button
            onClick={signOut}
            className="flex max-md:left-6 md:left-0 max-md:w-fit truncate max-md:bottom-20 -bottom-12 p-4 text-sm font-extrabold shadow-md rounded-2xl bg-background w-[300px] fixed md:absolute z-[200] hover:bg-zinc-900"
            style={{ boxShadow: "0px 0px 7px rgba(255, 255, 255, 0.5)" }}
          >
            Sair de {userName}
          </button>
          <div
            onClick={() => setShowSignOut(false)}
            className="fixed top-0 left-0 w-full h-full z-[100]"
          ></div>
        </>
      )}
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
      className={`2xl:w-full group cursor-pointer ${props.className}`}
      style={props.style}
    >
      <div
        className={`text-xl md:p-3 rounded-full md:group-hover:bg-white/10 transition-all duration-200 items-center flex w-fit ${props.className}`}
        style={{ gap: props.style?.gap || "16px" }}
      >
        {pathname === link ? iconFill : icon}
        {props.children}
        {label && (
          <p
            className={`${
              pathname === link ? "font-bold" : ""
            } pr-5 max-2xl:hidden`}
          >
            {label}
          </p>
        )}
      </div>
    </Link>
  ) : (
    <button
      {...props}
      className={`2xl:w-full group cursor-pointer ${props.className}`}
      style={props.style}
    >
      <div
        className={`font-bold text-xl md:p-3 rounded-full md:group-hover:bg-white/10 transition-all duration-200 items-center flex w-fit ${props.className}`}
        style={{ gap: props.style?.gap || "16px" }}
      >
        {props.children}
        {label && <p className="pr-5 max-2xl:hidden">{label}</p>}
      </div>
    </button>
  );
}
