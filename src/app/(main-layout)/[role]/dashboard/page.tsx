import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import DashboardClient from "./components/DashboardClient";
import { getDashboardWidget } from "@/queries/dashboard";

type DashBoardHomePageProps = {};
const DashBoardHomePage = async (props: DashBoardHomePageProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["dashboard-totals"],
    queryFn: getDashboardWidget,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient />
    </HydrationBoundary>
  );
};
export default DashBoardHomePage;
