import CommunityDisplay from "@/components/CommunityDisplay";
import { useParams } from "react-router";

const Community = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="flex justify-center pt-8 pb-5 min-h-[calc(100vh-50px)] md:min-h-screen bg-black">
      <div className="w-full max-w-6xl ">
        <CommunityDisplay communityId={Number(id)} />
      </div>
    </main>
  );
};

export default Community;
