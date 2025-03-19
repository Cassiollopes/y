import { User } from "@supabase/supabase-js";
import NewTweet from "./new-tweet";
import Tweet from ".";
import { TweetWithAuthor } from "@/utils/types";
import ActionButton from "../button";
import { BiArrowBack } from "react-icons/bi";
import { BsX } from "react-icons/bs";
import { useEffect } from "react";

export interface NewTweetAbsoluteProps {
  user: User;
  answer?: boolean;
  tweet?: TweetWithAuthor;
  callback: () => void;
}

export default function NewTweetAbsolute({
  answer,
  user,
  tweet,
  callback,
}: NewTweetAbsoluteProps) {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.scrollbarGutter = "stable";

    // Adiciona um estado ao histórico
    window.history.pushState({ page: "your-page" }, "");

    const handlePopState = () => {
      // Adiciona novamente o estado ao histórico quando voltar é pressionado
      window.history.pushState({ page: "your-page" }, "");

      // Implementa o comportamento desejado em vez de voltar
      callback();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.scrollbarGutter = "auto";
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          callback();
          document.documentElement.style.overflow = "auto";
        }
      }}
      className="bg-slate-600/50 fixed top-0 left-0 w-screen h-screen z-[100] flex justify-center items-start md:pt-10"
    >
      <div className="bg-black md:rounded-2xl w-2/5 max-md:w-full max-md:h-full relative">
        <div className="hidden md:flex absolute top-3 right-4">
          <ActionButton
            label="Fechar"
            onClick={() => {
              callback();
              document.documentElement.style.overflow = "auto";
            }}
            icon={<BsX className="h-5 w-5" />}
          />
        </div>
        <div className="md:hidden p-4">
          <ActionButton
            label="Fechar"
            onClick={() => {
              callback();
              document.documentElement.style.overflow = "auto";
            }}
            icon={<BiArrowBack className="h-5 w-5" />}
          />
        </div>
        {answer && tweet ? (
          <>
            <Tweet user={user} tweet={tweet} answer={true} />
            <NewTweet
              user={user}
              answer={true}
              tweetId={tweet.id}
              callback={callback}
            />
          </>
        ) : (
          <NewTweet user={user} callback={callback} />
        )}
      </div>
    </div>
  );
}
