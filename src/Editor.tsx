import { CSSProperties, useRef } from "react";
import { useOutlineEditor } from "./hooks/useOutlineEditor";
import { usePlainTextPlugin } from "./plugin/PlainTextPlugin";

const editorStyles:CSSProperties = {
  outline: "1px solid grey",
  //The overflow-wrap CSS property applies to text, setting whether the browser should insert line breaks within an otherwise
  //unbreakable string to prevent text from overflowing its line box.
  overflowWrap: "break-word",
  userSelect: "text",
  whiteSpace: "pre-wrap",
  minWidth: "100%",
  minHeight: "100px",
}


interface EditorProps {
  onChange: any;
  isReadOnly?: boolean;
}

export default function Editor({ onChange, isReadOnly = false }: EditorProps) {
  const editorElementRef = useRef(null);
  const outlineEditor = useOutlineEditor({
    editorElementRef,
    onChange
  });

  usePlainTextPlugin(outlineEditor, isReadOnly);

  return (
    <div
      className="editor"
      contentEditable={isReadOnly === true ? false : true}
      role="textbox"
      ref={editorElementRef}
      style={editorStyles}
    />
  )
}