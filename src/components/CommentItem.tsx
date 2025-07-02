import { useState } from "react";
import type { CommentTable } from "./CommentSection";
import { Button } from "./ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronUp } from "lucide-react";

type CommentItemProps = {
  comment: CommentTable & {
    children?: CommentTable[];
  };
  postId: number;
};

const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    toast.error("You must be logged in to comment");
    throw new Error("You must be logged in to comment");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

const CommentItem = ({ comment, postId }: CommentItemProps) => {
  const [showReply, setShowReply] = useState(false);
  const [text, setText] = useState("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (content: string) =>
      createReply(
        content,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setText("");
      setShowReply(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    mutate(text);
  };

  return (
    <div className="ml-4 mt-2 text-white">
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-400">
          <span className="font-medium text-white">{comment.author}</span>
          <span>{new Date(comment.created_at).toLocaleString()}</span>
        </div>
        <p className="text-sm text-white">{comment.content}</p>
        <Button
          onClick={() => setShowReply((prev) => !prev)}
          variant="link"
          className="text-blue-400 cursor-pointer text-sm px-0 hover:underline"
        >
          {showReply ? "Cancel" : "Reply"}
        </Button>
      </div>

      {showReply && user && (
        <form onSubmit={handleSubmit} className="mt-2 space-y-2 ml-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={2}
            placeholder="Write a reply..."
            className="resize-none bg-black border border-gray-700 text-white text-sm"
          />
          <Button
            type="submit"
            disabled={!text}
            className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white"
          >
            {isPending ? "Posting..." : "Post Reply"}
          </Button>
          {isError && (
            <p className="text-sm text-red-400">Error posting reply</p>
          )}
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div>
          <button
            className={`cursor-pointer -ml-1 transition duration-300 ${
              isCollapsed ? "-rotate-180" : "rotate-0"
            }`}
            title={`${isCollapsed ? "Hide Replies" : "Show Replies"}`}
            onClick={() => setIsCollapsed((prev) => !prev)}
          >
            <ChevronUp  />
          </button>
        </div>
      )}

      {!isCollapsed && (
        <div>
          {comment.children?.map(child => (
            <CommentItem key={child.id} comment={child} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
