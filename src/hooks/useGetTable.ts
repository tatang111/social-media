import { supabase } from "@/supabase-client";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

const useGetTable = <T = any>(
  postId: number,
  table: string,
  orderTable?: string
): UseQueryResult<T[], Error> => {
  return useQuery<T[], Error>({
    queryKey: [table, postId],
    queryFn: async () => {
      let query = supabase.from(table).select("*").eq("post_id", postId);

      if (orderTable) query = query.order(orderTable, { ascending: false });

      const { data } = await query;
      return data as T[];
    },
  });
};

export default useGetTable;
