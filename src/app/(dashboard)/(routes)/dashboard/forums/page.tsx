import { queryFn, useQueryProcessor } from "@/hooks/useTanstackQuery";
import ForumsClient from "./components/ForumsClient";
import { QueryClient } from "@tanstack/react-query";

type ForumsPageProps = {};

const ForumsPage = async (props: ForumsPageProps) => {

  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ["forums"],
    queryFn: () => queryFn("/posts", {type: 'feed'}),
  });

  return <>
    <ForumsClient />
  </>
};
export default ForumsPage;
