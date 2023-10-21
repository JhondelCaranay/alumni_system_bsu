
import { HydrationBoundary, QueryClient, dehydrate, } from "@tanstack/react-query";
import { queryFn } from "@/lib/tanstack-query-processor";
import StudentsClient from "./components/StudentsClient";


type StudentsPageProps = {};

const StudentsPage = async (props: StudentsPageProps) => {

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["deparments"],
    queryFn: () => queryFn('/departments', {}),
  });
  

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudentsClient />
    </HydrationBoundary>
  );
};
export default StudentsPage;
