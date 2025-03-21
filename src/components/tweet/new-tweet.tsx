"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BsX } from "react-icons/bs";
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
  const [posting, setPosting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxChars = 200; // Limite máximo de caracteres

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const addTweet = async (formData: FormData) => {
    setPosting(true);
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
    setPosting(false);
    if (inputRef.current) {
      inputRef.current.textContent = ""; // Limpa visualmente
    }
    setText(undefined);

    if (showActions) setShowActions(false);
    if (callback) return callback();

    router.refresh();
  };

  useEffect(() => {
    if (inputRef.current && callback) {
      inputRef.current.focus();
    }
  }, [callback]);

  useEffect(() => {
    const div = inputRef.current;
    if (div && text && text.length > 200) {
      const normalText = text.slice(0, 200);
      const excessText = text.slice(200);
      div.innerHTML = `${normalText}<span style="background: rgb(255, 0, 0, 0.5);">${excessText}</span>`;
      // Restaurar a posição do cursor no final
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(div);
      range.collapse(false); // Coloca o cursor no final
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [text]);

  const percentage = text ? (text.length / maxChars) * 100 : 0;

  // Calcula a circunferência do círculo (2 * π * raio)
  const radius = 12; // Raio do círculo em pixels
  const circumference = 2 * Math.PI * radius;

  // Calcula o comprimento da borda a ser preenchida
  const strokeDash = (percentage / 100) * circumference;
  const finalStrokeDash =
    (text?.length ?? 0) > 200 ? circumference : strokeDash;

  return (
    <form
      className={`flex w-full justify-between ${
        answerOnTweet ? "p-0" : "px-4 py-3 pt-4"
      } ${(showActions || !answerOnTweet) && " flex-col"} ${
        answer ? "pt-1" : ""
      }`}
      onClick={answerOnTweet ? () => setShowActions(true) : undefined}
    >
      <div className="flex items-start gap-2.5 w-full">
        <Image
          src={user.user_metadata.avatar_url}
          alt={user.id}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div
          ref={inputRef}
          contentEditable="true"
          onInput={(e) => {
            const content = (e.target as HTMLDivElement).textContent || "";
            setText(content);
            if (content === "") {
              (e.target as HTMLDivElement).innerHTML = "";
            }
          }}
          data-placeholder={
            answer ? "Postar resposta" : "O que você está pensando?"
          }
          className={`py-2 flex-1 bg-transparent border-none outline-none text-xl max-md:text-lg placeholder-zinc-500 empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-500 whitespace-pre-wrap break-words overflow-hidden leading-tight ${
            callback && "min-h-[96px]"
          } cursor-text`}
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
                <svg viewBox="0 0 24 24" className="w-[20px] h-[20px] fill-blue_twitter">
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
        {(text?.length ?? 0) > 0 && (
          <div className="flex items-center gap-2 relative justify-center w-fit">
            <div
              className={`relative w-7 h-7 ${
                (text?.length ?? 0) > 180 && "w-9 h-9"
              }`}
            >
              <svg className="w-full h-full" viewBox="0 0 32 32">
                {/* Círculo de fundo cinza */}
                <circle
                  cx="16"
                  cy="16"
                  r={radius}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="2"
                />
                {/* Círculo azul que preenche */}
                <circle
                  cx="16"
                  cy="16"
                  r={radius}
                  fill="none"
                  stroke={`${
                    (text?.length ?? 0) > 200
                      ? "rgba(255, 0, 0, 0.5)"
                      : (text?.length ?? 0) > 180
                      ? "rgba(255, 255, 0, 0.5)"
                      : "rgb(29, 155, 240)"
                  }`}
                  strokeWidth="2"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={circumference - finalStrokeDash}
                  className="transform -rotate-90 origin-center transition-all duration-300"
                />
              </svg>
            </div>
            {text && text.length > 180 && (
              <p
                className={`text-xs text-zinc-500 absolute ${
                  text.length > 200 ? "text-red-500" : ""
                }`}
              >
                {maxChars - (text?.length ?? 0)}
              </p>
            )}
          </div>
        )}
        <SubmitButton
          disabled={
            (!text && !photoFile) ||
            posting ||
            (text != undefined && text.length > 200)
          }
          formAction={addTweet}
          className={`text-sm ${callback ? "max-md:hidden" : ""}`}
        >
          {posting && !answer
            ? "Postando..."
            : answer && posting
            ? "Respondendo..."
            : answer
            ? "Responder"
            : "Postar"}
        </SubmitButton>
      </div>
      <div className="md:hidden">
        <button
          disabled={
            (!text && !photoFile) ||
            posting ||
            (text != undefined && text.length > 200)
          }
          formAction={addTweet}
          className="text-sm font-semibold bg-blue_twitter leading-tight rounded-full px-3.5 py-1.5 fixed top-3 right-4 disabled:opacity-50"
        >
          {posting && !answer
            ? "Postando..."
            : answer && posting
            ? "Respondendo..."
            : answer
            ? "Responder"
            : "Postar"}
        </button>
      </div>
    </form>
  );
}
