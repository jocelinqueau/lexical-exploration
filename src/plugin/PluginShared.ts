import { useEffect } from "react";

const isBrowserFirefox =
  typeof navigator !== "undefined" &&
  /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);

const isBrowserSafari =
  typeof navigator !== "undefined" &&
  /Version\/[\d.]+.*Safari/.test(navigator.userAgent);


//TODO: type selection
export function normalizeCursorSelectionOffsets(selection:any) {
  const [anchorOffset, focusOffset] = selection.getRangeOffsets();
  const selectionLeftToRight = focusOffset > anchorOffset;
  const startOffset = selectionLeftToRight ? anchorOffset : focusOffset;
  const endOffset = selectionLeftToRight ? focusOffset : anchorOffset;
  const offsetDifference = endOffset - startOffset;
  return [startOffset, offsetDifference];
}

//TODO: type selection
export function normalizeRangeSelectionOffsets(selection:any) {
  const [anchorOffset, focusOffset] = selection.getRangeOffsets();
  const anchorNode = selection.getAnchorNode();
  const focusNode = selection.getFocusNode();
  if (anchorNode.isBefore(focusNode)) {
    return [anchorOffset, focusOffset];
  } else {
    return [focusOffset, anchorOffset];
  }
}


export function onKeyDown() {
  // TODO
}

export function useEvent(outlineEditor, eventName, handler, pluginStateRef) {
  useEffect(() => {
    const state = pluginStateRef.current;
    if (state !== null && outlineEditor !== null) {
      const target =
        eventName === "selectionchange"
          ? document
          : outlineEditor.getEditorElement();
      const wrapper = (event) => {
        const viewModel = outlineEditor.createViewModel((editor) =>
          handler(event, editor, state, outlineEditor)
        );
        outlineEditor.update(viewModel);
      };
      target.addEventListener(eventName, wrapper);
      return () => {
        target.removeEventListener(eventName, wrapper);
      };
    }
  }, [eventName, handler, outlineEditor, pluginStateRef]);
}