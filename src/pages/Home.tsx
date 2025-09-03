import CardRecentPost from "@/components/CardRecentPost";
import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export type Post = {
  community: string;
  content: string;
  created_at: string;
  id: number;
  image_url: string;
  title: string;
  avatar_url: string;
};

const fetchPost = async (): Promise<Post[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Post[];
};

const Home = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["post"],
    queryFn: fetchPost,
  });

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-black text-white flex flex-col items-center gap-6 px-4 py-8 md:px-20 md:py-10 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500 drop-shadow-md">
        Recent Post
      </h1>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative w-full max-w-screen-xl">
          {isLoading ? (
            <Loader2 className="absolute h-8 w-8 animate-spin text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          ) : (
            data?.map((post) => {
                return <CardRecentPost key={post.id} post={post} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
