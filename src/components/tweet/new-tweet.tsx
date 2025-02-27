"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BsX } from "react-icons/bs";
import { TbPhoto } from "react-icons/tb";
import ActionButton, { SubmitButton } from "../button";

interface NewTweetProps {
  user: User;
  answer?: boolean;
  tweetId?: string;
  callback?: () => void;
  answerOnTweet?: boolean;
}

export default function NewTweet({
  user,
  answer,
  tweetId,
  callback,
  answerOnTweet,
}: NewTweetProps) {
  
  const router = useRouter();
  const [text, setText] = useState<string | undefined>();
  const [photoFile, setPhotoFile] = useState<File | undefined>();
  const [showActions, setShowActions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
      className={`flex w-full justify-between ${
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
          <ActionButton
            label="Remover"
            icon={<BsX className="h-5 w-5" />}
            onClick={() => setPhotoFile(undefined)}
            className="absolute right-4 top-6"
            contrast={true}
          />
        </div>
      )}
      <div
        className={` ${
          (showActions || !answerOnTweet) &&
          "flex w-full items-center justify-between pl-[52px] pt-4"
        }`}
      >
        {(showActions || !answerOnTweet) && (
          <div>
            <ActionButton
              color={"sky"}
              icon={<TbPhoto className="text-sky-500 h-5 w-5" />}
              label="Adicionar Foto"
              onClick={handleButtonClick}
            />
            <input
              ref={fileInputRef}
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
          </div>
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
