import JobsClient from "./components/JobsClient";

type JobsPageProps = {};
const JobsPage = (props: JobsPageProps) => {
  return (
    <div className="flex flex-col p-10">
      <JobsClient />
    </div>
  );
};
export default JobsPage;
