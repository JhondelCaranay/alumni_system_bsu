import ChatBox from "./components/ChatBox";
import Inbox from "./components/Inbox";

const Page = () => {
  return (
    <div className="bg-[#F6F6F6] h-full flex p-10 gap-x-5">
      <Inbox />
      <ChatBox />
    </div>
  );
};
export default Page;
