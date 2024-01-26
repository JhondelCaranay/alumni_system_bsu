import { GetCurrentUserType } from "@/actions/getCurrentUser";
import React from "react";
import ChatBox from "./ChatBox";
import Inbox from "../../components/Inbox";
import InboxMobile from "../../components/InboxMobile";

type MessagesClientProps = {
  currentUser: GetCurrentUserType;
};
const MessagesClient: React.FC<MessagesClientProps> = ({ currentUser }) => {
  return (
    <>
    </>
  );
};

export default MessagesClient;
