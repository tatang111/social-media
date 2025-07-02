import { supabase } from "@/supabase-client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Link } from "react-router";

export type Community = {
  title: string;
  description: string;
  id: string;
  created_at: string;
};

export const getCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("community")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data as Community[];
};

const Communities = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["communities"],
    queryFn: getCommunities,
  });

  return (
    <main className="flex justify-center pt-8 pb-5 min-h-[calc(100vh-50px)] md:min-h-133 bg-black px-4">
      <div className="w-full max-w-4xl flex flex-col gap-6 items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500 drop-shadow-md text-center">
          Communities
        </h1>

        <section className="w-full flex flex-col gap-4">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="animate-spin w-8 h-8 text-white" />
            </div>
          ) : (
            data?.map((community) => (
              <Link
                to={`/community/${community.id}`}
                key={community.id}
                className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg cursor-pointer rounded-md bg-gray-900 p-4 border border-gray-700"
              >
                <h2 className="text-purple-500 font-semibold text-lg sm:text-xl">
                  {community.title}
                </h2>
                <p className="text-gray-400 text-sm sm:text-base">
                  {community.description}
                </p>
              </Link>
            ))
          )}
        </section>

        {error && (
          <p className="text-lg sm:text-xl text-red-500 text-center">
            Failed to get Communities
          </p>
        )}
      </div>
    </main>
  );
};

export default Communities;
