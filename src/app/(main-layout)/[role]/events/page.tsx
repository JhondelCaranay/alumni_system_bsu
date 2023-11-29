import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Calendar from "./components/Calendar";
import { queryFn } from "@/hooks/useTanstackQuery";
import ViewCalendar from "./components/ViewCalendar";
import getCurrentUser from "@/actions/getCurrentUser";
import { isUserAllowed } from "@/lib/utils";
type EventsPageProps = {};
const EventsPage = async (props: EventsPageProps) => {
  const queryClient = new QueryClient();
  const currentUser = await getCurrentUser();

  await queryClient.prefetchQuery({
    queryKey: ["events"],
    queryFn: () => queryFn("/events"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex w-full bg-white p-6 dark:bg-[#020817]">
        {isUserAllowed(currentUser?.role!, ["ADMIN"]) ? (
          <Calendar />
        ) : (
          <ViewCalendar />
        )}
      </div>
    </HydrationBoundary>
  );
};
export default EventsPage;
