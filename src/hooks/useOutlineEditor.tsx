import { RefObject, useEffect, useState } from "react"
import { createOutlineEditor } from "../outline/createOutlineEditor";

interface useOutlineEditorProps {
  editorElementRef: RefObject<HTMLElement>;
  onChange: any;
}

export const useOutlineEditor = ({editorElementRef, onChange}:useOutlineEditorProps) => {
  const [outlineEditor, setOutlineEditor] = useState<any>(null);

  useEffect(() => {
    const editorElement = editorElementRef.current;
    if (editorElement !== null) {
      if (outlineEditor === null) {
        const newOutlineEditor = createOutlineEditor(editorElement, onChange);
        setOutlineEditor(newOutlineEditor);
      }else {
        outlineEditor._onChange = onChange;
      }
    }else if (outlineEditor !== null) {
      setOutlineEditor(null);
    }
  }, [editorElementRef, onChange, outlineEditor])

  return outlineEditor;
}