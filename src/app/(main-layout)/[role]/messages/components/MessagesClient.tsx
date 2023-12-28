import { GetCurrentUserType } from "@/actions/getCurrentUser";
import React from "react";
import ChatBox from "./ChatBox";
import Inbox from "./Inbox";

type MessagesClientProps = {
  currentUser: GetCurrentUserType;
};
const MessagesClient: React.FC<MessagesClientProps> = ({ currentUser }) => {
  return (
    <>
      <Inbox currentUser={currentUser} />
      <ChatBox currentUser={currentUser} />
    </>
  );
};

export default MessagesClient;
