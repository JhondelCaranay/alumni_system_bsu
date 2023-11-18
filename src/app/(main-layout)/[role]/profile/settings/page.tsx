import getCurrentUser from "@/actions/getCurrentUser";
import React from "react";
import InitialUserInfo from "../components/InitialUserInfo";
import GeneralUserInfo from "../components/GeneralUserInfo";
import UserCard from "./components/UserCard";

const UserSettingsPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col p-5 ">
        <div className="flex">
            <div className="flex flex-col">
                <UserCard data={user} />
                2
            </div>
            <div>
                3
            </div>
        </div>
    </div>
  );
};

export default UserSettingsPage;
