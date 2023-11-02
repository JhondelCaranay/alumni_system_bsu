"use client"
import React, { useEffect, useState } from 'react'
import FroalaEditor from 'react-froala-wysiwyg'
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView'
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins/link.min.js"; 
import 'froala-editor/js/plugins/image.min.js'
import 'froala-editor/js/plugins/char_counter.min.js'
import 'froala-editor/js/plugins/quick_insert.min.js'
import 'froala-editor/js/plugins/url.min.js'
import 'froala-editor/js/plugins/file.min.js'
import 'froala-editor/js/plugins/markdown.min.js'
const Editor = () => {

    const [model, setModel] = useState(() => {
        return localStorage.getItem('savedContent') || ''
    })
    
  return (
    <main >
        <FroalaEditor 
        tag='textarea'
        model={model}
        onModelChange={(e:string) => setModel(e)}
        config={{
            placeholderText: 'Start writting your job description.',
            heightMin: 500,
            saveInterval:1000,
            fontFamilySelection: true,
            fontSizeSelection: true,
            paragraphFormatSelection: true,
            events: {
                'charCounter.exceeded': function() {

                },
                'save.before': function(html:string) {
                    localStorage.setItem('savedContent', html)
                },
                
            },
            
            // toolbarButtons: {
            //     moreText: {
            //       buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
            //     },
            //     moreParagraph: {
            //       buttons: ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
            //     },
            //     moreRich: {
            //       buttons: ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
            //     },
            //     moreMisc: {
            //       buttons: ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help']
            //     }
            //   }
        }} />

        <FroalaEditorView model={model} />
    </main>
  )
}

export default Editor