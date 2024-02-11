import { ViewModel, createViewModel, updateViewModel } from "./OutlineView";

export class OutlineEditor{
  editorElement:HTMLElement;
  viewModel:ViewModel;
  onChange: any;
  _isUpdating = false;
  _keyToDOMMap = new Map();
  _textTransforms = new Set();

  constructor(editorElement:HTMLElement, viewModel:ViewModel, onChange: any){
    this.editorElement = editorElement;
    this.viewModel = viewModel;
    this.onChange = onChange;
  }

  getEditorElement(){
    return this.editorElement;
  }

  createViewModel(callbackFn) {
    return createViewModel(this.viewModel, callbackFn, this);
  }

  update(viewModel, forceSync) {
    if (this._isUpdating) {
      throw new Error("TODOL: Should never occur?");
    }
    if (viewModel === this.viewModel) {
      return;
    }
    if (forceSync) {
      updateViewModel(viewModel, this);
    } else {
      this._isUpdating = true;
      Promise.resolve().then(() => {
        this._isUpdating = false;
        updateViewModel(viewModel, this);
      });
    }
  }
}