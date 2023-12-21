import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import DashboardClient from "./components/DashboardClient";
import { getDashboardWidget } from "@/queries/dashboard";

type DashBoardHomePageProps = {
  searchParams: { tab: string };
};

const DashBoardHomePage = async ({ searchParams }: DashBoardHomePageProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["dashboard-totals"],
    queryFn: getDashboardWidget,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient tab={searchParams.tab} />
    </HydrationBoundary>
  );
};
export default DashBoardHomePage;
