
import { HydrationBoundary, QueryClient, dehydrate, } from "@tanstack/react-query";
import { queryFn } from "@/hooks/useTanstackQuery";
import UsersClient from "./components/UsersClient";


type UsersPageProps = {};

const UsersPage = async (props: UsersPageProps) => {

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: () => queryFn('/users/'),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersClient />
    </HydrationBoundary>
  );
};
export default UsersPage;
