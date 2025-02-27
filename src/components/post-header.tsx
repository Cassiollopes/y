"use client";

import { useRouter } from "next/navigation";
import ActionButton from "./button";
import Header from "./header";
import { BiArrowBack } from "react-icons/bi";
import { useState } from "react";
import NewTweetAbsolute from "./tweet/new-tweet-absolute";
import { AnswerProps } from "./answer";

export default function PostHeader({
  tweet,
  user,
}: AnswerProps) {
  const router = useRouter();
  const [showInput, setShowInput] = useState(false);

  const handleHideInput = () => {
    setShowInput(false);
  };

  const handleAnswer = () => {
    setShowInput(true);
  };

  return (
    <>
      <Header className="border-b-0 p-4 py-3">
        <div className="w-full flex gap-8 items-center justify-between">
          <div className="flex items-center gap-8">
            <ActionButton
              onClick={() => router.back()}
              label="Voltar"
              icon={<BiArrowBack className="h-5 w-5" />}
              className="text-white"
            />
            <p className="font-bold text-xl">Post</p>
          </div>
          <div>
            <button
              onClick={handleAnswer}
              className="max-md:hidden py-1.5 font-extrabold px-4 border border-slate-500 hover:bg-white/10 text-white rounded-full"
            >
              <p className="text-sm">Responder</p>
            </button>
          </div>
        </div>
      </Header>
      {showInput && (
        <NewTweetAbsolute
          tweet={tweet}
          user={user}
          answer={true}
          callback={handleHideInput}
        />
      )}
    </>
  );
}
