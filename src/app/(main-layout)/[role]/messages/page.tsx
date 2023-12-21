import getCurrentUser from "@/actions/getCurrentUser";
import ChatBox from "./components/ChatBox";
import Inbox from "./components/Inbox";
import { redirect } from "next/navigation";

const Page = async () => {
  const currentUser = await getCurrentUser();

  if(!currentUser) {
    return redirect('/')
  }
  
  return (
    <div className="bg-[#F6F6F6] h-full flex p-10 gap-x-5">
      <Inbox currentUser={currentUser} />
      <ChatBox />
    </div>
  );
};
export default Page;
