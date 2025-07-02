import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router";

type Post = {
  id: number;
  community: string;
  content: string;
  created_at: string;
  image_url: string;
  title: string;
};

const fetchPost = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
};

const PostPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", id],
    queryFn: () => fetchPost(Number(id)),
  });

  if (isLoading)
    return (
      <div className="bg-black text-white flex justify-center items-center min-h-screen px-6">
        <Loader2 className="h-6 w-6 animate-spin text-white" />
      </div>
    );

  if (error) return <div className="text-white">Error: {error.message}</div>;

  return (
    <div className="bg-black text-white min-h-[calc(100vh-50px)] flex flex-col gap-4 px-10 md:px-50 lg:px-50 py-5">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500 text-center drop-shadow-md">
        {data?.title}
      </h1>
      <img
        src={
          data?.image_url ??
          "https://th.bing.com/th/id/OIP.Kbd_Us1xe9jOFJxuHnrbDQHaEK?w=387&h=183&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3"
        }
        alt="post image"
        className="rounded object-cover w-8/10 mx-auto h-48 md:h-64 lg:h-80 mt-4"
      />
      <div className="text-start flex flex-col gap-3">
        <p className="text-gray-400 text-sm md:text-base">{data?.content}</p>
        <p className="text-gray-500 text-xs md:text-sm">
          Posted on: {new Date(data!.created_at).toLocaleDateString()}
        </p>
        <LikeButton postId={Number(id)} />
        <CommentSection postId={Number(id)} />
      </div>
    </div>
  );
};

export default PostPage;
