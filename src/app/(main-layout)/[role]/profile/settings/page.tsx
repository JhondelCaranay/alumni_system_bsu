import getCurrentUser from "@/actions/getCurrentUser";
import React from "react";
import UserCardForm from "./components/UserCardForm";
import GeneralInfoForm from "./components/GeneralInfoForm";
import PasswordsForm from "./components/PasswordsForm";
import GuardianInfoForm from "./components/GuardianInfoForm";
import WorkExperiences from "./components/WorkExperiences";

const UserSettingsPage = async () => {
  const user = await getCurrentUser();
  return (
    <div className="flex flex-col p-5 gap-3 dark:bg-transparent bg-[#F9FAFB]">
      <div className="flex gap-3">
        <div className="flex flex-col gap-3 flex-[0.4]">
          <UserCardForm data={user} />
          <PasswordsForm data={user} />
        </div>
        <div className="flex-1">
          <GeneralInfoForm data={user} />
        </div>
      </div>
      <GuardianInfoForm data={user} studentProfileId={user?.profile?.id} />
      <WorkExperiences data={user} />
    </div>
  );
};

export default UserSettingsPage;
