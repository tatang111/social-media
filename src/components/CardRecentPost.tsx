import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import useGetVote from "@/hooks/useGetTable";
import type { VoteTable } from "./LikeButton";
import type { CommentTable } from "./CommentSection";

type CardRecentPostProps = {
  post: {
    id: number;
    community: string;
    content: string;
    created_at: string;
    image_url: string;
    title: string;
    avatar_url: string;
  };
};

const CardRecentPost = ({ post }: CardRecentPostProps) => {
  const {data} = useGetVote<VoteTable>(post.id, "votes")
  const {data: commentData} = useGetVote<CommentTable>(post.id, "comments")

  return (
    <Card className="w-55 py-3 grid gap-1 bg-zinc-800 hover:bg-slate-800 text-white shadow-md border border-gray-700 transition-all duration-300 hover:border-fuchsia-500 hover:shadow-[0_0_80px_2px_rgba(232,121,249,0.5)]">
      <CardHeader>
        <CardTitle className="-ml-1 cursor-default">
          {post.avatar_url ? (
            <div className="flex items-center gap-1.5 ">
              <img src={post.avatar_url ?? "/post.jpg"} alt="User avatar" className="w-7 h-7 rounded-full object-cover" />
              {post.title}
            </div>
          ) : (
            <p>{post.title}</p>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <Link to={`/post/${post.id}`}>
          <img
            className="rounded-md h-25 w-full cursor-pointer object-cover"
            src={
              post.image_url ??
              "https://th.bing.com/th/id/OIP.Kbd_Us1xe9jOFJxuHnrbDQHaEK?w=387&h=183&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3"
            }
            alt=""
          />
        </Link>
      </CardContent>
      <CardFooter className="flex justify-between px-14 cursor-default">
        <span>❤️{data?.filter((vote) => vote.vote === 1).length}</span>
        <span>💬{commentData?.length}</span>
      </CardFooter>
    </Card>
  );
};

export default CardRecentPost;
