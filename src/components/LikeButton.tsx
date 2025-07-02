import useGetTable from "@/hooks/useGetTable";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

export type VoteTable = {
  id: number;
  created_at: string;
  post_id: number;
  user_id: string;
  vote: number;

}

const vote = async (voteValue: number, postId: number, userId: string) => {
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingVote) {
    // liked -> 0, like -> -1
    if (existingVote.vote === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("votes")
        .update({ vote: voteValue })
        .eq("id", existingVote.id);
      if (error) throw new Error(error.message);
    }
  } else {
    const { error } = await supabase
      .from("votes")
      .insert({ post_id: postId, user_id: userId, vote: voteValue });
    if (error) throw new Error(error.message);
  }
};

const LikeButton = ({ postId }: { postId: number }) => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const { data} = useGetTable<VoteTable>(postId, "votes")

  const { mutate } = useMutation({
    mutationFn: (voteValue: number) => {
      if (!user) toast.error("You must be logged in to Vote!");
      return vote(voteValue, postId, user!.id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["votes", postId] }),
  });

  const userVote = data?.find(v => v.user_id === user?.id)?.vote

  return (
    <div className="flex gap-3 md:gap-4">
      <button onClick={() => mutate(1)} className="flex items-center gap-1 md:gap-1.5">
        <span className="text-sm md:text-base">
          {data?.filter((vote) => vote.vote === 1).length}
        </span>
        <ThumbsUp
          size={20}
          strokeWidth={userVote === 1 ? 0 : 2}
          fill={userVote === 1 ? "white" : "none"}
          color={userVote === 1 ? "black" : "white"}
          className="cursor-pointer"
        />
      </button>
      <button onClick={() => mutate(-1)} className="flex items-center gap-1 md:gap-1.5">
        <span className="text-sm md:text-base">
          {data?.filter((vote) => vote.vote === -1).length}
        </span>
        <ThumbsDown
          size={20}
          strokeWidth={userVote === -1 ? 0 : 2}
          fill={userVote === -1 ? "white" : "none"}
          color={userVote === -1 ? "black" : "white"}
          className="cursor-pointer"
        />
      </button>
    </div>
  );
};

export default LikeButton;
