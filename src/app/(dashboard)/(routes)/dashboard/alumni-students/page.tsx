import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getStudents } from "@/queries/students";
import AlumniStudentsClient from "./components/AlumniStudentsClient";

type AlumniPageProps = {};
const AlumniPage = async (props: AlumniPageProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["alumni"],
    queryFn: ({ queryKey }) => getStudents("?role=alumni"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AlumniStudentsClient />
    </HydrationBoundary>
  );
};
export default AlumniPage;
