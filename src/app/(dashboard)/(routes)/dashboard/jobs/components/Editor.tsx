
import React from "react";
import FroalaEditorComponent from "react-froala-wysiwyg";

import "froala-editor/css/froala_style.min.css";

import "froala-editor/css/froala_editor.pkgd.min.css";

// Import all Froala Editor plugins;
import "froala-editor/js/plugins.pkgd.min.js";

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

type EditorProps = {
  model: string;
  onChange: (value: string) => void;
};

const Editor: React.FC<EditorProps> = ({ model, onChange }) => {
  return (
    <main className="editor">
      <FroalaEditorComponent
        config={{
          placeholderText: "Start writting your job description.",
          heightMin: 500,
          saveInterval: 1000,
          fontFamilySelection: true,
          fontSizeSelection: true,
          paragraphFormatSelection: true,
          events: {
            "save.before": function (html: string) {
              localStorage.setItem("savedContent", html);
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
