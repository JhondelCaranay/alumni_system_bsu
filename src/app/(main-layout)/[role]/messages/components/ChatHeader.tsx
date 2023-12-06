import React from "react";

const ChatHeader = () => {
  return (
    <div className="border border-b-1 border-x-0 border-t-0 w-full flex p-3 gap-x-3 items-center">
      <div className="">
        <img
          src="/images/logo.png"
          alt="chat header profile"
          className="w-12 h-12 object-cover"
        />
      </div>
      <div className="flex flex-col">
        <h1 className="font-semibold text-[1.3em] text-black">
          Jr./Sr. Web Programmer
        </h1>
        <p className="text-sm text-zinc-500">Kooapps Philippines Corporation</p>
      </div>
    </div>
  );
};

export default ChatHeader;
