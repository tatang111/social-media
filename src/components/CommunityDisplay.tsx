import type { Post } from "@/pages/Home";
import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import CardRecentPost from "./CardRecentPost";

type PostWithCommunity = Post & {
  community: {
    title: string;
  };
};

const CommunityDisplay = ({ communityId }: { communityId: number }) => {
  const { data, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["community", communityId],
    queryFn: async (): Promise<PostWithCommunity[]> => {
      const { data, error } = await supabase
        .from("posts")
        .select("*, community(title)")
        .eq("community_id", communityId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      return data as PostWithCommunity[];
    },
  });

  return (
    <div className="w-full px-4 md:px-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500 drop-shadow-md">
        {data && data.length > 0 && data[0].community.title} Community Post
      </h1>

      {isLoading ? (
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="flex justify-center md:flex ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {data.map((post) => (
              <CardRecentPost key={post.id} post={post} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-white text-center text-lg sm:text-xl font-semibold">
          There are no posts for this community yet.
        </p>
      )}
    </div>
  );
};

export default CommunityDisplay;
