"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { TweetWithAuthor } from "@/utils/types";
import ActionButton from "../button";
import NewTweetAbsolute from "../tweet/new-tweet-absolute";

export interface AnswerProps {
  tweet: TweetWithAuthor;
  user: User;
}

export default function Answer({ tweet, user }: AnswerProps) {
  const [showInput, setShowInput] = useState(false);

  const handleHideInput = () => {
    setShowInput(false);
  };

  const handleAnswer = () => {
    setShowInput(true);
  };

  return (
    <div>
      <ActionButton
        label="Responder"
        icon={
          <svg
            viewBox="0 0 24 24"
            className="h-[18.75px] w-[18.75px]"
          >
            <g>
              <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
            </g>
          </svg>
        }
        color="sky"
        text={tweet.answers.length}
        onClick={handleAnswer}
      />
      {showInput && (
        <NewTweetAbsolute
          tweet={tweet}
          user={user}
          answer={true}
          callback={handleHideInput}
        />
      )}
    </div>
  );
}
