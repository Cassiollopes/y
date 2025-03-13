"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { TweetWithAuthor } from "@/utils/types";
import ActionButton from "../button";
import { FaRegCommentAlt } from "react-icons/fa";
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
        icon={<FaRegCommentAlt />}
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
