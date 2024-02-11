import { OutlineEditor } from "./OutlineEditor";
import { createBodyNode } from "./OutlineNode";
import { ViewModel } from "./OutlineView";

export function createOutlineEditor(editorElement:HTMLElement, onChange:any) {
  const viewModel = new ViewModel();
  const body = createBodyNode();
  viewModel.body = body;
  viewModel.nodeMap.body = body;
  const outlineEditor = new OutlineEditor(editorElement, viewModel, onChange);
  outlineEditor._keyToDOMMap.set("body", editorElement);
  if (typeof onChange === "function") {
    onChange(viewModel);
  }
  return outlineEditor;
}