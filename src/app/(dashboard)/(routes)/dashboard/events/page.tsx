import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import Calendar from "./components/Calendar";
import { queryFn } from "@/hooks/useTanstackQuery";

type EventsPageProps = {};
const EventsPage = async (props: EventsPageProps) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["events"],
    queryFn: () => queryFn("/events"),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex w-full bg-white p-5">
        <Calendar />
      </div>
    </HydrationBoundary>
  );
};
export default EventsPage;
