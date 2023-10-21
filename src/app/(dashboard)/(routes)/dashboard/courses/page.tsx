import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import CoursesClient from "./components/CoursesClient";
import { getDeparments } from "@/queries/department";

type CoursesPageProps = {};
const CoursesPage = async (props: CoursesPageProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["departments"],
    queryFn: getDeparments,
  });

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CoursesClient />
    </HydrationBoundary>
  );
};
export default CoursesPage;
