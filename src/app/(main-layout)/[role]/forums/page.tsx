import { queryFn, useQueryProcessor } from "@/hooks/useTanstackQuery";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Feed from "./components/Feed";
import ProfileSidebar from "./components/ProfileSidebar";
import OtherSidebar from "./components/OtherSidebar";
import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

type ForumsPageProps = {};

const ForumsPage = async (props: ForumsPageProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["discussions"],
    queryFn: () => queryFn("/posts", { type: "feed" }),
  });

  const currentUser = await getCurrentUser()

  if(!currentUser) {
    return redirect('/')
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
     <div className="grid grid-cols-4 bg-[#F9FAFB] min-h-[90vh] w-full p-10 pb-0 dark:bg-[#020817]">
      <div>
        <ProfileSidebar />
      </div>
      <div className="col-span-2 px-10">
        <Feed currentUser={currentUser}/>
      </div>
      <div>
        <OtherSidebar />
      </div>
    </div>
    </HydrationBoundary>
  );
};
export default ForumsPage;
