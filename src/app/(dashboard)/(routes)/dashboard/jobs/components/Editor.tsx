"use client";

import React, { useEffect, useState } from "react";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";

import FroalaEditorComponent from "react-froala-wysiwyg";

import "froala-editor/css/froala_style.min.css";

import "froala-editor/css/froala_editor.pkgd.min.css";

// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";

import { Lightbulb } from "lucide-react";
import "froala-editor/js/plugins/save.min.js";
import "froala-editor/js/plugins/markdown.min.js";

// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";

// Import a single Froala Editor plugin.
import "froala-editor/js/plugins/align.min.js";

// Import a language file.
import "froala-editor/js/languages/de.js";

// Import a third-party plugin.
import "froala-editor/js/third_party/image_tui.min.js";
import "froala-editor/js/third_party/embedly.min.js";
// import "froala-editor/js/third_party/spell_checker.min.js"; // cause error

// Include font-awesome css if required.
// install using "npm install font-awesome --save"
import "font-awesome/css/font-awesome.css";
import "froala-editor/js/third_party/font_awesome.min.js";

// Include special components if required.
// import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
// import FroalaEditorA from 'react-froala-wysiwyg/FroalaEditorA';
// import FroalaEditorButton from 'react-froala-wysiwyg/FroalaEditorButton';
// import FroalaEditorImg from 'react-froala-wysiwyg/FroalaEditorImg';
// import FroalaEditorInput from 'react-froala-wysiwyg/FroalaEditorInput';

const Editor = () => {
  const [model, setModel] = useState(() => {
    return localStorage.getItem("savedContent") || ''
  });

  // froala.com/blog/editor/tutorials/how-to-integrate-froala-with-react/
 
  return (
    <main className="editor">
      <div className="flex items-center bg-[rgb(237,243,248)] my-10 rounded-md p-5">
        <Lightbulb className="text-[rgb(195,125,22)]" />{" "}
        <h1 className=" text-zinc-500 text-sm">
          {" "}
          Create a high quality job post, to learn more
          <kbd className="mx-2">
            <span className="bg-zinc-200 p-2 rounded-md text-xs">Ctrl + /</span>
          </kbd>
          while you focus on the text editor.
        </h1>
      </div>
      <FroalaEditorComponent
        model={model}
        tag="textarea"
        onModelChange={(e: string) => setModel(e)}
        config={{
          placeholderText: "Start writting your job description.",
          heightMin: 500,
          saveInterval: 1000,
          fontFamilySelection: true,
          fontSizeSelection: true,
          paragraphFormatSelection: true,
          events: {
            'save.before': function(html:string) {
              localStorage.setItem('savedContent', html)
          },
          }
        }} 
          />

      {/* <FroalaEditorView model={model} /> */}
    </main>
  );
};

export default Editor;
