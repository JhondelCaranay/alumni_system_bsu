import { GetCurrentUserType } from "@/actions/getCurrentUser";
import React from "react";
import ChatBox from "./ChatBox";
import Inbox from "./Inbox";
import InboxMobile from "./InboxMobile";

type MessagesClientProps = {
  currentUser: GetCurrentUserType;
};
const MessagesClient: React.FC<MessagesClientProps> = ({ currentUser }) => {
  return (
    <>
      <InboxMobile currentUser={currentUser} />
      <Inbox currentUser={currentUser} />
      <ChatBox currentUser={currentUser} />
    </>
  );
};

export default MessagesClient;
