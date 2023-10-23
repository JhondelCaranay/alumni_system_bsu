import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getStudents } from "@/queries/students";
import StudentsStudentsClient from "./components/StudentsClient";
import { getDeparments } from "@/queries/department";

type StudentsPageProps = {};
const StudentsPage = async (props: StudentsPageProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["students"],
    queryFn: ({ queryKey }) => getStudents(),
  });
  
  await queryClient.prefetchQuery({
    queryKey: ["departments"],
    queryFn: ({ queryKey }) => getDeparments(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudentsStudentsClient />
    </HydrationBoundary>
  );
};
export default StudentsPage;
