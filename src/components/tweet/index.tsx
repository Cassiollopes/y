"use client";

import Image from "next/image";
import { BsPatchCheckFill } from "react-icons/bs";
import Likes from "../likes";
import { User } from "@supabase/supabase-js";
import {
  DateFormatter,
  FullDateFormatter,
  NameFormatter,
  UserNameFormatter,
} from "@/utils";
import Answer from "../answer";
import { TweetWithAuthor } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface TweetProps {
  tweet: TweetWithAuthor;
  answer?: boolean;
  answerTweet?: boolean;
  tweetWithAnswer?: boolean;
  user?: User;
}

export default function Tweet({
  tweet,
  answer,
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

  const [imageUrl, setImageUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!tweet.image) return;
    const supabase = createClient();

    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from("images")
          .download(path);
        if (error) {
          throw error;
        }

        const url = URL.createObjectURL(data);
        setImageUrl(url);
      } catch (error) {
        console.log("Error downloading image: ", error);
      }
    }

    if (tweet.image) downloadImage(tweet.image);
  }, [tweet.image]);

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
      className={`flex gap-[6px] justify-start w-full transition-all duration-200 text-[15px] ${
        tweetWithAnswer ? "border-t-0" : "cursor-pointer px-4 py-3"
      } ${!answerTweet && !answer && "border-t hover:bg-white/[0.025]"} ${
        answer && "cursor-text"
      }`}
    >
      {!tweetWithAnswer && (
        <div className="min-w-[40px] max-w-[40px] flex flex-col items-center gap-1">
          <Image
            src={tweet.author.avatar_url}
            alt={name}
            width={40}
            height={40}
            className="rounded-full w-[40px] h-[40px]"
          />
          {answer && <div className="h-full w-[1.6px] bg-zinc-500/50"></div>}
        </div>
      )}
      <div className="flex flex-col items-start flex-1 min-w-0">
        <div className="flex gap-2 w-full">
          {tweetWithAnswer && (
            <Image
              src={tweet.author.avatar_url}
              alt={name}
              width={40}
              height={40}
              className="rounded-full w-[40px] h-[40px]"
            />
          )}
          <div
            className={`flex gap-1 pt-0.5 leading-none w-full max-[359px]:flex-wrap ${
              tweetWithAnswer
                ? "flex-col pb-3"
                : "pb-1.5 md:items-end md:gap-1.5 "
            }`}
          >
            <div className="flex items-end gap-0.5 max-w-full overflow-hidden">
              <p
                className={`font-bold truncate min-w-0 flex-1 ${
                  tweetWithAnswer && "flex-none"
                }`}
              >
                {name}
              </p>
              <BsPatchCheckFill className="fill-sky-500 h-4 w-4" />
            </div>
            <div className="text-zinc-400/90 font-extralight flex">
              <p className="truncate min-w-0 flex-1">{userName}&nbsp;</p>
              {!tweetWithAnswer && `· ${createdAt}`}
            </div>
          </div>
        </div>
        {tweet.text && (
          <p className={`leading-none break-words w-full`}>{tweet.text}</p>
        )}
        {imageUrl && !answer && (
          <div className="border w-full mt-3 rounded-2xl overflow-hidden ">
            <Image
              src={imageUrl}
              alt=""
              width={500}
              height={500}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI/wN4oEBJWAAAAABJRU5ErkJggg=="
              className="w-full h-fit max-h-[500px] object-contain opacity-0 transition-opacity duration-300"
              onLoadingComplete={(img) => img.classList.remove("opacity-0")}
            />
          </div>
        )}
        {tweetWithAnswer && (
          <p className="text-zinc-500 font-light py-3">
            {FullDateFormatter(tweet.created_at)}
          </p>
        )}
        {answer ? (
          <div>
            <p className="text-zinc-500 pt-4">
              Respondendo <span className="text-sky-500">{userName}</span>
            </p>
          </div>
        ) : (
          <div
            className={`pt-3 flex items-center w-full ${
              tweetWithAnswer && "md:py-3 border-t md:border-b md:mb-4  px-2"
            }`}
          >
            <div className="w-1/5 max-md:w-1/4 no-click">
              {user && <Answer tweet={tweet} user={user} />}
            </div>
            <div className="no-click">
              <Likes tweet={tweet} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
