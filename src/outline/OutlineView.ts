import { cloneNode, createBlockNode, createTextNode } from "./OutlineNode";
import { reconcileViewModel } from "./OutlineReconciler";

let activeViewModel = null;

export function getActiveViewModel() {
  if (activeViewModel === null) {
    throw new Error(
      "Unable to find an active draft view model. " +
        "Editor helpers or node methods can only be used " +
        "synchronously during the callback of editor.createViewModel()."
    );
  }
  return activeViewModel;
}

const view = {
  cloneText(node, text) {
    if (node.isImmutable()) {
      throw new Error('cloneText: cannot clone an immutable node')
    }
    const clone = cloneNode(node);
    clone._key = null;
    if (text !== undefined) {
      clone._children = text;
    }
    return clone;
  },
  createBlock: createBlockNode,
  createText: createTextNode,
  getBody() {
    return getActiveViewModel().body;
  },
  getSelection,
};

// To optimize things, we only apply transforms to
// dirty text nodes, rather than all text nodes.
export function applyTextTransforms(viewModel, outlineEditor) {
  const textTransformsSet = outlineEditor._textTransforms;
  if (textTransformsSet.size > 0) {
    const textTransforms = Array.from(textTransformsSet);
    const mutatedNodeKeys = Array.from(viewModel._dirtyNodes);
    const nodeMap = viewModel.nodeMap;

    for (let s = 0; s < mutatedNodeKeys.length; s++) {
      const mutatedNodeKey = mutatedNodeKeys[s];
      const node = nodeMap[mutatedNodeKey];
      if (node != null) {
        if (node.isText()) {
          for (let i = 0; i < textTransforms.length; i++) {
            textTransforms[i](node, view);
          }
        }
      }
    }
  }
}

export function createViewModel(currentViewModel, callbackFn, outlineEditor){
  if (activeViewModel !== null) {
    throw new Error("TODOL: Should never occur?");
  }
  console.log('createViewModel', currentViewModel)
  const viewModel = cloneViewModel(currentViewModel);
  activeViewModel = viewModel;
  // Setup the dirty nodes Set, which is required by the
  // view model logic during createViewModel(). This is also used by
  // text transforms.
  const dirtyNodes = (viewModel._dirtyNodes = new Set());
  // This is used during reconcilation and is also temporary.
  // We remove it in updateViewModel.
  viewModel._dirtySubTrees = new Set();
  try {
    callbackFn(view);
    applyTextTransforms(viewModel, outlineEditor);
  } finally {
    activeViewModel = null;
  }

  const canUseExistingModel = dirtyNodes.size === 0;
  viewModel._dirtyNodes = null;
  return canUseExistingModel ? currentViewModel : viewModel;
}

export function cloneViewModel(current:any) {
  console.log('cloneViewModel', current)
  const draft = new ViewModel();
  draft.nodeMap = { ...current.nodeMap };
  draft.body = current.body;
  return draft;
}

export function updateViewModel(viewModel, outlineEditor) {
  const onChange = outlineEditor._onChange;
  // We shouldn't need to set activeViewModel again here,
  // but because we access getNextSibling() to find out if
  // a text node should add a new line, we re-use it.
  // Ideally we'd instead have a _nextSibling property
  // on the node rather than having to lookup the parent.
  // We also use it for getType.
  activeViewModel = viewModel;
  reconcileViewModel(viewModel, outlineEditor);
  activeViewModel = null;
  outlineEditor._viewModel = viewModel;
  viewModel._dirtySubTrees = null;
  if (typeof onChange === "function") {
    onChange(viewModel);
  }
}

export class ViewModel {
  body: any = null;
  nodeMap: Record<string, any> = {};
  selection: any = null;
  _dirtyNodes: any = null;
  _dirtySubTrees: Set<any> = new Set();

  constructor() {}
}