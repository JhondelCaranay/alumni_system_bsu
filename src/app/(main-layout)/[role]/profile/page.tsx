import getCurrentUser from "@/actions/getCurrentUser";
import GeneralUserInfo from "./components/GeneralUserInfo";
import InitialUserInfo from "./components/InitialUserInfo";
import GuardiansInfo from "./components/GuardiansInfo";

const Page = async () => {
  const user = await getCurrentUser();
  
  return (
    <div className="flex flex-col p-5">
      <h1 className="my-5 text-3xl">Profile</h1>
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
