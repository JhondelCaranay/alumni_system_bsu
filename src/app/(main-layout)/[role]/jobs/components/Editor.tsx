"use client";

import React from "react";
import dynamic from "next/dynamic";

import "froala-editor/css/froala_style.min.css";

import "froala-editor/css/froala_editor.pkgd.min.css";

// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";

import "froala-editor/js/plugins/save.min.js";
import "froala-editor/js/plugins/markdown.min.js";
import "froala-editor/js/plugins/image.min.js";

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
// import { cloudinaryUpload } from "@/lib/cloudinary";
import { env } from "@/env.mjs";
import axios from "axios";
import { apiClient } from "@/hooks/useTanstackQuery";
import { handleImageDeleteOrReplace } from "@/lib/utils";
const FroalaEditorComponent = dynamic(() => import("react-froala-wysiwyg"), { ssr: false });

// Set your Cloudinary credentials

type EditorProps = {
  model: string;
  onChange: (value: string) => void;
};

const Editor: React.FC<EditorProps> = ({ model, onChange }) => {
  

  return (
    <main className="editor">
      <FroalaEditorComponent
        tag="textarea"
        config={{
          placeholderText: "Start writting your job description.",
          heightMin: 500,
          heightMax: 500,
          saveInterval: 1000,
          fontFamilySelection: true,
          fontSizeSelection: true,
          imageUpload: true,
          toolbarSticky: true,
          quickInsertEnabled: true,
          quickInsertButtons: [/* 'video',  */ "image", "embedly", "table", "ul", "ol", "hr"],
          imageUploadURL: `${env.NEXT_PUBLIC_SITE_URL}/api/cloudinary`,
          imageUploadMethod: "POST",
          imageUploadParam: "file",
          // Other configuration options
          paragraphFormatSelection: true,

          events: {
            "save.before": function (html: string) {
              localStorage.setItem("savedContent", html);
            },
            "image.replaced": function (img: any, response: any) {
              try {
                // console.log(img, response, '🚀 ~ image replaced ~ 🚀')
                // const responseData =  JSON.parse(response);
                // const publicId = responseData.link.split('next-alumni-system/')[1]?.replace('.jpg', '')
                // handleImageDeleteOrReplace(publicId)
              } catch (error) {
                console.error(error);
              }
            },
            "image.removed": async function (img: any, response: any) {
              try {
                console.log(img, response, "🚀 ~ image removed ~ 🚀");
                const publicIdFromReplace = img[0]["data-fr-old-src"];
                if (publicIdFromReplace) {
                  // getting the public id from url and removing file ext
                  const publicId = publicIdFromReplace
                    ?.split("next-alumni-system/")[1]
                    .substring(
                      0,
                      publicIdFromReplace.split("next-alumni-system/")[1].lastIndexOf(".")
                    );
                  handleImageDeleteOrReplace(publicId);
                } else {
                  // getting the public id from url and removing file ext
                  const publicId = img[0].currentSrc
                    ?.split("next-alumni-system/")[1]
                    .substring(
                      0,
                      img[0].currentSrc?.split("next-alumni-system/")[1].lastIndexOf(".")
                    );
                  handleImageDeleteOrReplace(publicId);
                }
              } catch (error) {
                console.error(error);
              }
            },
          },

          toolbarButtons: {
            moreText: {
              buttons: [
                "bold",
                "italic",
                "underline",
                "strikeThrough",
                "subscript",
                "superscript",
                "fontFamily",
                "fontSize",
                "textColor",
                "backgroundColor",
                "inlineClass",
                "inlineStyle",
                "clearFormatting",
              ],
            },
            moreParagraph: {
              buttons: [
                "alignLeft",
                "alignCenter",
                "formatOLSimple",
                "alignRight",
                "alignJustify",
                "formatOL",
                "formatUL",
                "paragraphFormat",
                "paragraphStyle",
                "lineHeight",
                "outdent",
                "indent",
                "quote",
              ],
            },
            moreRich: {
              buttons: [
                "insertLink",
                "insertImage",
                // "insertVideo",
                "insertTable",
                "emoticons",
                "fontAwesome",
                "specialCharacters",
                "embedly",
                // "insertFile",
                "insertHR",
              ],
            },
            moreMisc: {
              buttons: [
                "undo",
                "redo",
                "fullscreen",
                // "print",
                // "getPDF",
                "spellChecker",
                "selectAll",
                "html",
                "help",
              ],
            },
          },
        }}
        model={model}
        onModelChange={(e: string) => onChange(e)}
      />
    </main>
  );
};

export default Editor;
