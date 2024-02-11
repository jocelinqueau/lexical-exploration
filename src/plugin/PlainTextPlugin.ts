import { useEffect, useRef } from "react";
import { onKeyDown, useEvent } from "./PluginShared";


export function usePlainTextPlugin(outlineEditor, isReadOnly = false) {
  const pluginStateRef = useRef(null);

  useEffect(() => {
    const pluginsState = pluginStateRef.current;

    if (pluginsState === null) {
      pluginStateRef.current = {
        isComposing: false,
        isReadOnly,
      };
    } else {
      pluginsState.isReadOnly = isReadOnly;
    }
  }, [isReadOnly]);


  useEvent(outlineEditor, 'keydown', onKeyDown, pluginStateRef)
}