import getCurrentUser from "@/actions/getCurrentUser";
import GeneralUserInfo from "./components/GeneralUserInfo";
import InitialUserInfo from "./components/InitialUserInfo";
import GuardiansInfo from "./components/GuardiansInfo";
import { UserCog } from "lucide-react";
import Link from "next/link";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col p-5 dark:bg-transparent bg-[#F9FAFB]">
      {/* <pre className="hidden dark:block dark:text-white text-black dark:bg-gray-800 bg-gray-100 p-5 rounded-md overflow-auto">
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre> */}
      <div className="flex justify-between items-center">
        <h1 className="my-5 text-3xl">Profile</h1>
        <Link href={`/${user?.role.toLowerCase()}/profile/settings`}>
          <UserCog />
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3">
          <InitialUserInfo data={user} />
          <GeneralUserInfo data={user} />
        </div>
        <GuardiansInfo data={user} studentProfileId={user?.profile?.id} />
      </div>
    </div>
  );
};
export default Page;
