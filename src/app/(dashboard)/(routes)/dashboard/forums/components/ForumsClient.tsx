import React from "react";
import ProfileSidebar from "./ProfileSidebar";
import Feed from "./Feed";
import OtherSidebar from "./OtherSidebar";

const ForumsClient = () => {
  return (
    <div className="grid grid-cols-4 bg-[#F9FAFB] w-full p-10 pb-0 dark:bg-[#020817]">
      <div>
        <ProfileSidebar />
      </div>
      <div className="col-span-2 px-10">
        <Feed />
      </div>
      <div>
        <OtherSidebar />
      </div>
    </div>
  );
};

export default ForumsClient;
