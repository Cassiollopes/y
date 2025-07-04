"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BsX } from "react-icons/bs";
import ActionButton, { SubmitButton } from "../button";
import MaxCharsRadius from "./maxCharsRadius";
import TextInput from "./textInput";

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
  const [text, setText] = useState<string | undefined>();
  const [photoFile, setPhotoFile] = useState<File | undefined>();
  const [showActions, setShowActions] = useState(false);
  const [posting, setPosting] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const addTweet = async (formData: FormData) => {
    setPosting(true);

    try {
      const supabase = createClient();
      const text = formData.get("text") as string;

      const {
        data: { user },
      } = await supabase.auth.getUser();

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
    } catch (error) {
      console.error("Error adding tweet:", error);
    } finally {
      setPosting(false);

      if (inputRef.current) {
        inputRef.current.textContent = "";
      }

      setText(undefined);

      if (showActions) setShowActions(false);

      router.refresh();

      if (callback) return callback();
    }
  };

  useEffect(() => {
    if (inputRef.current && callback) {
      inputRef.current.focus();
    }
  }, [callback]);

  return (
    <form
      className={`flex w-full justify-between ${
        answerOnTweet ? "p-0" : "px-4 py-3 pt-4"
      } ${(showActions || !answerOnTweet) && " flex-col"} ${
        answer ? "pt-1" : ""
      }`}
      onClick={answerOnTweet ? () => setShowActions(true) : undefined}
      onSubmit={(e) => {
        e.preventDefault();
        addTweet(new FormData(e.currentTarget));
      }}
    >
      <div className="flex items-start gap-2.5 w-full">
        <Image
          src={user.user_metadata.avatar_url}
          alt={user.id}
          width={40}
          height={40}
          className="rounded-full"
        />
        <TextInput
          text={text}
          inputRef={inputRef as React.RefObject<HTMLDivElement>}
          answer={answer}
          callback={callback}
          setText={setText}
        />
      </div>
      <input type="hidden" name="text" value={text ?? ""} />
      {photoFile && (
        <div className="relative rounded-2xl mt-2 min-flex-1 ml-[48px] max-md:max-h-[50vh] max-h-[70vh] overflow-hidden">
          <Image
            src={URL.createObjectURL(photoFile)}
            alt="Selected photo"
            width={500}
            height={500}
            className="w-full h-fit"
          />
          <ActionButton
            label="Remover"
            icon={<BsX className="h-6 w-6" />}
            onClick={() => setPhotoFile(undefined)}
            className="absolute right-4 top-6"
            contrast={true}
          />
        </div>
      )}
      <div
        className={` ${
          (showActions || !answerOnTweet) &&
          "flex w-full items-center justify-end pl-[50px] pt-4 gap-2"
        }`}
      >
        {(showActions || !answerOnTweet) && (
          <div className="mr-auto">
            <ActionButton
              color={"sky"}
              icon={
                <svg
                  viewBox="0 0 24 24"
                  className="w-[20px] h-[20px] fill-blue_twitter"
                >
                  <g>
                    <path d="M3 5.5C3 4.119 4.119 3 5.5 3h13C19.881 3 21 4.119 21 5.5v13c0 1.381-1.119 2.5-2.5 2.5h-13C4.119 21 3 19.881 3 18.5v-13zM5.5 5c-.276 0-.5.224-.5.5v9.086l3-3 3 3 5-5 3 3V5.5c0-.276-.224-.5-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5c0 .276.224.5.5.5h13c.276 0 .5-.224.5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"></path>
                  </g>
                </svg>
              }
              label="Adicionar Foto"
              onClick={handleButtonClick}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
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
        {(text?.length ?? 0) > 0 && <MaxCharsRadius text={text} />}
        <SubmitButton
          variant="default"
          text={text}
          photoFile={photoFile}
          posting={posting}
          answer={answer}
          className={`${callback ? "max-md:hidden" : ""}`}
        />
      </div>
      {callback && (
        <SubmitButton
          text={text}
          photoFile={photoFile}
          posting={posting}
          answer={answer}
          callback={callback}
          className="md:hidden"
        />
      )}
    </form>
  );
}
