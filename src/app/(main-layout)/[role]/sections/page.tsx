import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import SectionsClient from "./components/SectionsClient";
import { getSections } from "@/queries/sections";

type SectionsPageProps = {};
const SectionsPage = async (props: SectionsPageProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["sections"],
    queryFn: getSections,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SectionsClient />
    </HydrationBoundary>
  );
};
export default SectionsPage;
