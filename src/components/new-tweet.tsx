"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BsX } from "react-icons/bs";
import { TbPhoto } from "react-icons/tb";
import { SubmitButton } from "./button";

export default function NewTweet({
  user,
  answer,
  tweetId,
  callback,
  answerOnTweet,
}: {
  user: User;
  answer?: boolean;
  tweetId?: string;
  callback?: () => void;
  answerOnTweet?: boolean;
}) {
  const router = useRouter();
  const [text, setText] = useState<string | undefined>();
  const [photoFile, setPhotoFile] = useState<File | undefined>();
  const [showActions, setShowActions] = useState(false);

  const addTweet = async (formData: FormData) => {
    const supabase = createClient();
    const text = formData.get("text") as string;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log(photoFile);

    if (user) {
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop();
        const filePath = `${user.id}-${Math.random()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, photoFile);

        if (uploadError) {
          throw uploadError;
        }

        await supabase.from("tweets").insert({
          text,
          user_id: user.id,
          image: filePath,
          ...(answer && tweetId ? { tweet_id: tweetId } : {}),
        });

        setPhotoFile(undefined);
      } else {
        if (answer && tweetId) {
          await supabase
            .from("tweets")
            .insert({ text, tweet_id: tweetId, user_id: user.id });
        } else {
          await supabase.from("tweets").insert({ text, user_id: user.id });
        }
      }
    }
    setText(undefined);
    if (showActions) setShowActions(false);
    if (callback) return callback();
    router.refresh();
  };

  return (
    <form
      className={`flex w-full h-full justify-between ${
        answerOnTweet ? "p-0" : "px-4 py-3 pt-4"
      } ${(showActions || !answerOnTweet) && " flex-col"}`}
      onClick={answerOnTweet ? () => setShowActions(true) : undefined}
    >
      <div className="flex items-center gap-3">
        <Image
          src={user.user_metadata.avatar_url}
          alt={user.id}
          width={40}
          height={40}
          className="rounded-full"
        />
        <input
          onChange={(e) => setText(e.target.value)}
          name="text"
          placeholder={answer ? "Postar resposta" : "O que você está pensando?"}
          className="bg-transparent border-none outline-none text-xl max-md:text-lg placeholder-zinc-500"
          autoComplete="off"
        />
      </div>
      {photoFile && (
        <div className="relative w-full pl-[52px] max-h-[60vh] overflow-hidden">
          <Image
            src={URL.createObjectURL(photoFile)}
            alt="Selected photo"
            width={500}
            height={500}
            className="rounded-lg w-full h-fit border border-zinc-600/20 mt-2"
          />
          <button
            className="absolute right-2 top-4 bg-zinc-500/30 p-1 rounded-full hover:bg-zinc-500/20"
            onClick={() => setPhotoFile(undefined)}
          >
            <BsX className="h-5 w-5" />
          </button>
        </div>
      )}
      <div
        className={` ${
          (showActions || !answerOnTweet) &&
          "flex w-full items-center justify-between pl-[52px] pt-4"
        }`}
      >
        {(showActions || !answerOnTweet) && (
          <label className="cursor-pointer group relative flex items-center justify-center">
            <TbPhoto className="text-sky-500 h-5 w-5" />
            <input
              type="file"
              accept="image/jpeg"
              hidden
              onChange={(e) => {
                if (e.target.files) {
                  setPhotoFile(e.target.files[0]);
                  e.target.value = "";
                }
              }}
            />
            <div className="absolute p-4 group-hover:bg-sky-500/20 rounded-full transition-all duration-200"></div>
          </label>
        )}
        <SubmitButton
          disabled={!text && !photoFile}
          formAction={addTweet}
          className="text-sm"
        >
          {answer ? "Responder" : "Postar"}
        </SubmitButton>
      </div>
    </form>
  );
}
