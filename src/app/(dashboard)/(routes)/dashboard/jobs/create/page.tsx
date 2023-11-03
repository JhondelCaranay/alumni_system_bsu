"use client"
import React from 'react'
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./../components/Editor"), {
  ssr: false,
});

const PostAJobPage = () => {

  return (
    <div className="p-5">
      <Editor />
    </div>
  );
};

export default PostAJobPage;
