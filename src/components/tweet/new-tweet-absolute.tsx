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

    if(window.innerWidth < 768) {
      document.documentElement.style.overflowY = "auto";
      document.documentElement.style.scrollbarGutter = "auto";
    }

    return () => {
      document.documentElement.style.overflow = "auto";
      document.documentElement.style.scrollbarGutter = "auto";
    };
  }, [callback]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          callback();
          document.documentElement.style.overflow = "auto";
        }
      }}
      className="bg-slate-600/50 fixed inset-0 w-screen min-h-screen z-[100] flex justify-center items-start md:pt-10 max-md:pb-20 max-md:bg-black"
    >
      <div className="bg-black md:rounded-2xl w-2/5 max-md:w-full relative">
        <div className="hidden md:flex absolute top-3 right-4">
          <ActionButton
            label="Fechar"
            onClick={() => {
              callback();
              document.documentElement.style.overflow = "auto";
            }}
            icon={<BsX className="h-6 w-6" />}
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
