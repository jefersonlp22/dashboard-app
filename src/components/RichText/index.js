import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import './styles.scss';

const RichText = ({ title, initialValue, onChange, placeholder }) => {

  const [editorState, setEditorState] = useState(null);

  useEffect(() => {
    let contentBlock = htmlToDraft(initialValue || "");
    let contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    let stateWithContent = EditorState.createWithContent(contentState);    
    setEditorState(stateWithContent);
  }, [initialValue]);


  return <div className="richText__wrapper">
    <div className="richText__title">{title || ''}</div>
    <Editor
      editorState={editorState}           
      onEditorStateChange={(state) => {         
        setEditorState(state);
        onChange(
          draftToHtml(convertToRaw(state.getCurrentContent()))
        );
      }}

      placeholder={placeholder || ''}
      toolbarClassName="toolbarClassName"
      wrapperClassName="richText__editor"
      editorClassName="editorClassName"
      toolbar={{
        options: ['inline', 'list', 'link', 'colorPicker', 'image', 'emoji', 'history'],
        inline: {
          options: ['bold', 'italic', 'underline', 'strikethrough'],
        },
        list: {
          options: ['unordered', 'ordered'],
        },
      }}
    />
  </div>;
}

export { RichText };
