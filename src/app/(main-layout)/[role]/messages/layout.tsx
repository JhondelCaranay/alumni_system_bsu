import getCurrentUser from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { queryFn } from "@/hooks/useTanstackQuery";
import MessagesClient from "./groupchats/components/MessagesClient";
import InboxMobile from "./components/InboxMobile";
import Inbox from "./components/Inbox";

const Page = async ({ children }: { children: React.ReactNode }) => {
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
        <InboxMobile currentUser={currentUser} />
        <Inbox currentUser={currentUser} />
        <div className="flex-1 h-full">{children}</div>
      </HydrationBoundary>
    </div>
  );
};
export default Page;
