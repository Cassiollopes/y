"use client";

import { NameFormatter, UserNameFormatter } from "@/utils";
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
import NewTweetAbsolute from "./tweet/new-tweet-absolute";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";

export default function SideBar({ user }: { user: User }) {
  const [showInput, setShowInput] = useState(false);
  const [showSignOut, setShowSignOut] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() === 0) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

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
    <motion.div
      initial={{ opacity: "100%" }}
      transition={{ duration: 0.3 }}
      animate={window.innerWidth < 768 && { opacity: visible ? "100%" : "50%" }}
      className="flex max-2xl:justify-end md:py-1 xl:w-[15%] 2xl:w-[20%] max-md:bottom-0 max-md:left-0 sticky md:top-0 z-[100] max-md:bg-black max-md:h-fit max-md:w-full max-md:justify-center"
    >
      <div className="flex md:flex-col max-2xl:items-center md:max-2xl:w-fit w-full max-md:justify-around max-md:py-2 max-md:border-t border-white/20">
        <SideButton className="md:w-[50px] md:h-[50px] justify-center gap-0 md:mb-0.5">
          <h1 className="max-md:text-3xl md:text-4xl font-serif">Y</h1>
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
          className="max-md:hidden bg-white 2xl:p-3.5 mt-2 rounded-full text-black font-bold w-[90%] max-2xl:w-[50px] max-2xl:h-[50px] relative"
        >
          <p className="max-2xl:hidden">Postar</p>
          <LuSend className="2xl:hidden h-5 w-5 absolute" />
        </SubmitButton>
        {showInput && (
          <NewTweetAbsolute user={user} callback={handleHideInput} />
        )}
        <div className="relative max-md:flex">
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
              className="rounded-full w-[40px] h-[40px] max-md:h-[32px] max-md:w-[32px]"
            />
            <div className="w-full flex justify-between items-center max-2xl:hidden">
              <div className="text-base flex flex-col items-start">
                <p>{NameFormatter(user.user_metadata.name)}</p>
                <p className="font-light text-zinc-500">{userName}</p>
              </div>
              <HiDotsHorizontal className="h-4 w-4" />
            </div>
          </SideButton>
          {showSignOut && (
            <div className="absolute max-md:right-0">
              <div
                onClick={() => setShowSignOut(false)}
                className="fixed top-0 left-0 w-full h-full z-[100]"
              ></div>
              <button
                onClick={signOut}
                className="flex right-0 max-md:w-fit truncate max-md:-top-16 p-4 text-sm font-extrabold shadow-md rounded-2xl bg-background w-[300px] absolute z-[200] hover:bg-zinc-900"
                style={{ boxShadow: "0px 0px 7px rgba(255, 255, 255, 0.5)" }}
              >
                Sair de {userName}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
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
      className={`2xl:w-full md:group cursor-pointer ${props.className}`}
      style={props.style}
    >
      <div
        className={`text-white/95 ${
          pathname === link ? "font-bold" : ""
        } text-xl md:p-3 rounded-full group-hover:bg-white/10 transition-all duration-200 items-center flex w-fit ${
          props.className
        }`}
        style={{ gap: props.style?.gap || "16px" }}
      >
        {pathname === link ? iconFill : icon}
        {props.children}
        {label && <p className="pr-5 max-2xl:hidden">{label}</p>}
      </div>
    </Link>
  ) : (
    <button
      {...props}
      className={`2xl:w-full md:group cursor-pointer ${props.className}`}
      style={props.style}
    >
      <div
        className={`text-white/95 font-bold text-xl md:p-3 rounded-full group-hover:bg-white/10 transition-all duration-200 items-center flex w-fit ${props.className}`}
        style={{ gap: props.style?.gap || "16px" }}
      >
        {props.children}
        {label && <p className="pr-5 max-2xl:hidden">{label}</p>}
      </div>
    </button>
  );
}
