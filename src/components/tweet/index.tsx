"use client";

import Image from "next/image";
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
            className={`flex pt-0.5  w-full max-[359px]:flex-wrap ${
              tweetWithAnswer
                ? "flex-col pb-5 gap-0 leading-none"
                : "pb-1 gap-1 items-center leading-tight"
            }`}
          >
            <div className="flex items-center gap-0.5 max-w-full overflow-hidden">
              <p
                className={`font-bold truncate min-w-0 flex-1 ${
                  tweetWithAnswer && "flex-none"
                }`}
              >
                {name}
              </p>
              <svg
                viewBox="0 0 22 22"
                className="h-[18.75px] w-[18.75px] fill-blue_twitter"
              >
                <g>
                  <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path>
                </g>
              </svg>
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
              className="w-full h-fit max-h-[500px] object-contain opacity-0 transition-opacity duration-700"
              onLoadingComplete={(img) => img.classList.remove("opacity-0")}
              loading="lazy"
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
              Respondendo <span className="text-blue_twitter">{userName}</span>
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
