import Calendar from "./components/Calendar";

type EventsPageProps = {};
const EventsPage = (props: EventsPageProps) => {
  return <div className="flex w-full bg-white p-5">
    <Calendar />
  </div>;
};
export default EventsPage;
