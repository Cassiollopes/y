import { User } from "@supabase/supabase-js";
import { useEffect } from "react";
import NewTweet from "./new-tweet";
import Tweet from ".";
import { TweetWithAuthor } from "@/utils/types";
import ActionButton from "../button";
import { BiArrowBack } from "react-icons/bi";

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
    document.body.classList.add("no-scroll");
  }, []);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          callback();
          document.body.classList.remove("no-scroll");
        }
      }}
      className="bg-slate-600/50 fixed top-0 left-0 w-full h-full z-[100] flex justify-center items-start md:pt-10"
    >
      <div className="bg-black md:rounded-2xl w-2/5 max-md:w-full max-md:h-full">
        <div className="md:hidden p-4">
          <ActionButton
            label="Fechar"
            onClick={() => { callback(); document.body.classList.remove("no-scroll");} }
            icon={<BiArrowBack className="h-5 w-5" />}
          />
        </div>
        {answer && tweet ? (
          <>
            <Tweet user={user} tweet={tweet} answers={true} />
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
