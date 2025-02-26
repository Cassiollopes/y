import { User } from "@supabase/supabase-js";
import NewTweet from "./new-tweet";
import Tweet from "./tweet";
import { TweetWithAuthor } from "@/utils/types";
import ActionButton from "./button";
import { BiArrowBack } from "react-icons/bi";

export default function NewTweetAbsolute({
  onClick,
  answer,
  user,
  tweet,
  callback,
}: {
  onClick: () => void;
  answer?: boolean;
  user: User;
  tweet?: TweetWithAuthor;
  callback: () => void;
}) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClick();
        }
      }}
      className="bg-slate-600/50 fixed top-0 left-0 w-full h-full z-[100] flex justify-center items-start md:pt-10"
    >
      <div className="bg-black md:rounded-2xl w-2/5 max-md:w-full h-full">
        <div className="md:hidden p-4">
          <ActionButton
            label="Fechar"
            onClick={onClick}
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
