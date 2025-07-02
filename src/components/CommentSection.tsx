import { useAuthStore } from "@/store/useAuthStore";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/supabase-client";
import useGetTable from "@/hooks/useGetTable";
import { Loader2 } from "lucide-react";
import CommentItem from "./CommentItem";

type CommentSectionProps = {
  postId: number;
};

export type CommentTable = {
  id: number;
  created_at: string;
  post_id: number;
  content: string;
  user_id: string;
  author: string;
  parent_comment_id: number;
};

type NewComment = { content: string; parent_comment_id: number | null };

const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    toast.error("You must be logged in to comment");
    throw new Error("You must be logged in to comment");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    parent_comment_id: newComment.parent_comment_id || null,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

const CommentSection = ({ postId }: CommentSectionProps) => {
  const [text, setText] = useState<string>("");
  const user = useAuthStore((state) => state.user);
  const {
    data: comments,
    error,
    isLoading,
  } = useGetTable<CommentTable>(postId, "comments", "created_at");
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!text) return;
    mutate({ content: text, parent_comment_id: null });
    setText("");
  };

  // Map of Comments - Organize Replies - Return Tree
  const buildCommentTree = (
    flatComments: CommentTable[]
  ): (CommentTable & { children: CommentTable[] })[] => {
    const map = new Map<number, CommentTable & { children: CommentTable[] }>();
    const roots: (CommentTable & { children: CommentTable[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });

    return roots;
  };

  const commentTree = comments ? buildCommentTree(comments) : [];

  if (isLoading)
    return <Loader2 className="mr-2 h-4 w-4 animate-spin text-black " />;

  if (error) return <div>Error : {error.message}</div>;
  return (
      <div className="grid gap-3 md:gap-4">
      <h3 className="text-lg md:text-xl font-semibold">Comments</h3>
      {/* Create Comment section */}
      {user ? (
        <form onSubmit={handleSubmit} className="grid gap-3">
          <Textarea
            value={text}
            name="text"
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Write a comment..."
            className="resize-none text-sm md:text-base"
          />
          <Button 
            disabled={!text || isPending} 
            type="submit" 
            className="w-fit bg-fuchsia-500 hover:bg-fuchsia-600 cursor-pointer text-sm md:text-base"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Post Comment"
            )}
          </Button>
          {isError && <p className="text-red-500 text-sm">Error posting comment</p>}
        </form>
      ) : (
        <p className="text-sm md:text-base">You must be logged in to post a comment</p>
      )}
      {/* Comments Display Section */}
      <div className="space-y-4">
        {commentTree.map((comment, key) => (
          <CommentItem key={key} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
