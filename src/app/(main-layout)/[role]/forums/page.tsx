import { queryFn, useQueryProcessor } from "@/hooks/useTanstackQuery";
import ForumsClient from "./components/ForumsClient";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

type ForumsPageProps = {};

const ForumsPage = async (props: ForumsPageProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["discussions"],
    queryFn: () => queryFn("/posts", { type: "feed" }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ForumsClient />
    </HydrationBoundary>
  );
};
export default ForumsPage;
