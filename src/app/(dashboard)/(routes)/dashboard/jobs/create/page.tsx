import React from "react";
// import Editor from "../components/Editor";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./../components/Editor"), {
  ssr: false,
});

const page = () => {
  return (
    <div className="p-5">
      <Editor />
    </div>
  );
};

export default page;
