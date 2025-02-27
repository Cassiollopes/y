"use client";

import Image from "next/image";
import { BsPatchCheckFill } from "react-icons/bs";
import ImageUpload from "../image";
import Likes from "../likes";
import { User } from "@supabase/supabase-js";
import {
  DateFormatter,
  FullDateFormatter,
  NameFormatter,
  UserNameFormatter,
} from "@/utils/format";
import Answer from "../answer";
import { TweetWithAuthor } from "@/utils/types";
import { useRouter } from "next/navigation";
import NewTweet from "./new-tweet";
import { SubmitButton } from "../button";
import NewTweetAbsolute from "./new-tweet-absolute";
import { useState } from "react";
import { BiMessage } from "react-icons/bi";
import { GoHome } from "react-icons/go";

interface TweetProps {
  tweet: TweetWithAuthor;
  answers?: boolean;
  answerTweet?: boolean;
  tweetWithAnswer?: boolean;
  user?: User;
}

export default function Tweet({
  tweet,
  answers,
  answerTweet,
  tweetWithAnswer,
  user,
}: TweetProps) {
  
  const router = useRouter();
  const createdAt = DateFormatter(tweet.created_at);
  const name = NameFormatter(tweet.author.name);
  const userName = UserNameFormatter(
    tweet.author.user_name || tweet.author.name
  );
  const [showInput, setShowInput] = useState(false);

  return (
    <article
      onClick={(e) => {
        if (!tweetWithAnswer) {
          if ((e.target as HTMLElement).closest(".no-click")) {
            return;
          }
          router.push(`${location.origin}/post/${tweet.id}`);
        }
      }}
      key={tweet.id}
      className={`flex gap-[6px] justify-start w-full px-4 py-3 hover:bg-white/[0.025] transition-all duration-200 ${
        tweetWithAnswer ? "pb-6 border-t-0 pt-1" : "cursor-pointer"
      } ${!answerTweet && !answers && "border-t"}  border-zinc-700/75`}
    >
      {!tweetWithAnswer && (
        <div className="flex-1 max-w-[40px] flex flex-col items-center gap-1">
          <Image
            src={tweet.author.avatar_url}
            alt={name}
            width={40}
            height={40}
            className="rounded-full w-[40px] h-[40px]"
          />
          {answers && <div className="h-full w-[1.6px] bg-zinc-500/50"></div>}
        </div>
      )}

      <div className="flex flex-col items-start flex-1 text-white/95">
        <div className="flex gap-2">
          {tweetWithAnswer && (
            <div className="flex-1 max-w-[40px] flex flex-col items-center gap-1">
              <Image
                src={tweet.author.avatar_url}
                alt={name}
                width={40}
                height={40}
                className="rounded-full w-[40px] h-[40px]"
              />
            </div>
          )}
          <div
            className={`flex gap-1 pt-0.5 leading-none ${
              tweetWithAnswer
                ? "flex-col pb-3"
                : "pb-1.5 md:items-center md:gap-2 "
            } max-md:flex-col`}
          >
            <div className="font-bold flex items-center gap-1">
              <p>{name}</p>
              <BsPatchCheckFill className="fill-sky-500" />
            </div>
            <p className="text-zinc-400/80 font-light">
              {userName} {!tweetWithAnswer && `· ${createdAt}`}
            </p>
          </div>
        </div>
        {tweet.text && <p className={`leading-none`}>{tweet.text}</p>}
        {tweet.image && !answers && <ImageUpload url={tweet.image} />}
        {tweetWithAnswer && (
          <p className="text-zinc-500 font-light py-3">
            {FullDateFormatter(tweet.created_at)}
          </p>
        )}
        {answers ? (
          <div>
            <p className="text-zinc-500 pt-4">Respondendo {userName}</p>
          </div>
        ) : (
          <div
            className={`pt-3 flex items-center w-full ${
              tweetWithAnswer &&
              "py-3 border-t border-b md:mb-4 border-zinc-700 px-2"
            }`}
          >
            <div className="w-1/5 no-click">
              {user && <Answer tweet={tweet} user={user} />}
            </div>
            <div className="no-click">
              <Likes tweet={tweet} />
            </div>
          </div>
        )}
        {tweetWithAnswer && user && (
          <div className="w-full">
            <div className="max-md:hidden w-full">
              <NewTweet
                user={user}
                answer={true}
                answerOnTweet={true}
                tweetId={tweet.id}
              />
            </div>
            <div className="fixed bottom-6 right-6 md:hidden flex gap-2">
              <SubmitButton
                onClick={() => router.push("/")}
                className="w-[50px] h-[50px] rounded-full shadow-sm shadow-white"
              >
                <GoHome className="h-5 w-5 absolute" />
              </SubmitButton>
              <SubmitButton
                onClick={() => setShowInput(true)}
                className="w-[50px] h-[50px] rounded-full shadow-sm shadow-white"
              >
                <BiMessage className="h-5 w-5 absolute" />
              </SubmitButton>
            </div>

            {showInput && (
              <NewTweetAbsolute
                user={user}
                answer={true}
                tweet={tweet}
                callback={() => setShowInput(false)}
              />
            )}
          </div>
        )}
      </div>
    </article>
  );
}
