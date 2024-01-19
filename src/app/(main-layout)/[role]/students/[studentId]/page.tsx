import prisma from "@/lib/prisma";
import InitialUserInfo from "./components/InitialUserInfo";
import GeneralUserInfo from "./components/GeneralUserInfo";
import WorkExperiences from "./components/WorkExperiences";
import GuardiansInfo from "./components/GuardiansInfo";
import getUserById from "@/actions/getUserById";
import GoBackButton from "./components/GoBackButton";

type Props = {
  params: { studentId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
const StudentViewPage = async ({ params }: Props) => {
  const user = await getUserById(params.studentId);

  return (
    <div className="flex flex-col p-5 dark:bg-transparent bg-[#F9FAFB]">
      {/* <pre className="hidden dark:block dark:text-white text-black dark:bg-gray-800 bg-gray-100 p-5 rounded-md overflow-auto">
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre> */}
      <div className="flex justify-between items-center mb-5">
        <GoBackButton />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3">
          <InitialUserInfo data={user} />
          <GeneralUserInfo data={user} />
        </div>
        <GuardiansInfo data={user} studentProfileId={user?.profile?.id} />
        <WorkExperiences data={user} studentProfileId={user?.profile?.id} />
      </div>
    </div>
  );
};
export default StudentViewPage;
