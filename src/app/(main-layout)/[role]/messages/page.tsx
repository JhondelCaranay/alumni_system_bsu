import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import MessagesClient from "./components/MessagesClient";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { queryFn } from "@/hooks/useTanstackQuery";

const Page = async () => {
  const currentUser = await getCurrentUser();
  const queryClient = new QueryClient();
  if (!currentUser) {
    return redirect("/");
  }

  await queryClient.prefetchQuery({
    queryKey: ["groupchats"],
    queryFn: () => queryFn(`/groupchats`, { userId: currentUser?.id }),
  });

  

  return (
    <div className="bg-[#F6F6F6] h-full flex flex-row p-3 md:p-10 md:px-20 gap-x-1 md:gap-x-5 dark:bg-[#020817]">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <MessagesClient currentUser={currentUser} />
      </HydrationBoundary>
    </div>
  );
};
export default Page;
