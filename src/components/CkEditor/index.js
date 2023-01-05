import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "./editor.scss";

class CkEditor extends Component {
  constructor(props) {
    super(props);
    const html = props.value || "<p>Escreva a descrição aqui</p>";
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState
      };
    }
  }

  onEditorStateChange = (editorState) => {
    this.props.setData(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
    this.setState({
      editorState
    });
  };

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          //handlePastedText={() => 'handled'}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            options: ['inline',  'list', 'link', 'colorPicker',  'image', 'emoji',  'history'],
            inline: {
              options: ['bold', 'italic', 'underline', 'strikethrough'],
            },
            list: {
              options: ['unordered', 'ordered'],
            },

          }}
        />
      </div>
    );
  }
}

export { CkEditor };
