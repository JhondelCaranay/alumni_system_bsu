import getCurrentUser from "@/actions/getCurrentUser";
import GeneralUserInfo from "./components/GeneralUserInfo";
import InitialUserInfo from "./components/InitialUserInfo";
import GuardiansInfo from "./components/GuardiansInfo";
import { UserCog } from "lucide-react";
import Link from "next/link";

const Page = async () => {
  const user = await getCurrentUser();
  
  return (
    <div className="flex flex-col p-5">
      <div className="flex justify-between items-center">
      <h1 className="my-5 text-3xl">Profile</h1>
      <Link href={`${user?.role.toLowerCase()}/profile/settings` }> <UserCog /> </Link>
      </div>
      <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <InitialUserInfo data={user}/>
        <GeneralUserInfo data={user}/>
      </div>
        <GuardiansInfo data={user}/>
      </div>
    </div>
  );
};
export default Page;
