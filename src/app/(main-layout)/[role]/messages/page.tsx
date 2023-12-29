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

  // const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ["students"],
  //   queryFn: () => queryFn(`/users`, { role: "STUDENT" }),
  // });

  if (!currentUser) {
    return redirect("/");
  }

  return (
    <div className="bg-[#F6F6F6] h-full flex p-10 px-20 gap-x-5">
      {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
      <MessagesClient currentUser={currentUser} />
      {/* </HydrationBoundary> */}
    </div>
  );
};
export default Page;
