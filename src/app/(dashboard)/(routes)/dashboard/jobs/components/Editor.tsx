"use client";
import React, { useEffect, useRef, useState } from "react";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import "froala-editor/css/froala_style.min.css";

import "froala-editor/css/froala_editor.pkgd.min.css";

// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";

import FroalaEditorComponent from "react-froala-wysiwyg";
import { Lightbulb } from "lucide-react";

const Editor = () => {
  const [model, setModel] = useState(() => {
    return localStorage.getItem("savedContent") || "";
  });

  // froala.com/blog/editor/tutorials/how-to-integrate-froala-with-react/

 
  return (
    <main className="editor">
      <div className="flex items-center bg-[rgb(237,243,248)] my-10 rounded-md p-5">
        <Lightbulb className="text-[rgb(195,125,22)]" />{" "}
        <h1 className=" text-zinc-500">
          {" "}
          Create a high quality job post, to learn more
          <kbd className="mx-2">
            <span className="bg-zinc-200 p-2 rounded-md text-xs">Ctrl + /</span>
          </kbd>
          while you focus on the text editor
        </h1>
      </div>
      <FroalaEditorComponent
        tag="textarea"
        model={model}
        onModelChange={(e: string) => setModel(e)}
        config={{
          placeholderText: "Start writting your job description.",
          heightMin: 500,
          saveInterval: 1000,
          fontFamilySelection: true,
          fontSizeSelection: true,
          paragraphFormatSelection: true,
          events: {
            "charCounter.exceeded": function () {},
            "save.before": function (html: string) {
              localStorage.setItem("savedContent", html);
            },
          },
        }}
      />

      {/* <FroalaEditorView model={model} /> */}
    </main>
  );
};

export default Editor;
