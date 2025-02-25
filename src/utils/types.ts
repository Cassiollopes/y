import { Database } from "./supabase/database.types";

type Tweets = Database["public"]["Tables"]["tweets"]["Row"];
export type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export type TweetWithAuthor = Tweets & {
  answers: TweetWithAuthor[] | Tweets[]
  author: Profiles;
  likes: number;
  user_has_liked: boolean;
};
