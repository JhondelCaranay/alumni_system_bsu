"use client";
import React, { useState } from "react";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import "froala-editor/css/froala_style.min.css";

import "froala-editor/css/froala_editor.pkgd.min.css";

// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";

import FroalaEditorComponent from "react-froala-wysiwyg";

const Editor = () => {
  const [model, setModel] = useState(() => {
    return localStorage.getItem("savedContent") || "";
  });

  // froala.com/blog/editor/tutorials/how-to-integrate-froala-with-react/

  // let config = {
  //   documentReady: true,
  //   heightMin: 300,
  //   events: {
  //     contentChanged: function (e, editor) {
  //       console.log("test");
  //     },
  //   },
  // };

  https: return (
    <main className="editor">
      <FroalaEditorComponent
        tag="textarea"
        onModelChange={(e: string) => setModel(e)}
        // config={config}
        // config={{
        //   placeholderText: "Start writting your job description.",
        //   heightMin: 500,
        //   saveInterval: 1000,
        //   fontFamilySelection: true,
        //   fontSizeSelection: true,
        //   paragraphFormatSelection: true,

        //   events: {
        //     "charCounter.exceeded": function () {},
        //     "save.before": function (html: string) {
        //       localStorage.setItem("savedContent", html);
        //     },
        //   },
        // }}
      />

      <FroalaEditorView model={model} />
    </main>
  );
};

export default Editor;
