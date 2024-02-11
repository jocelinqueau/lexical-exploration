export const IS_BODY = 1;
export const IS_BLOCK = 1 << 1;
export const IS_TEXT = 1 << 2;
export const IS_IMMUTABLE = 1 << 3;
export const IS_BOLD = 1 << 4;
export const IS_ITALIC = 1 << 5;
export const IS_STRIKETHROUGH = 1 << 6;
export const IS_UNDERLINE = 1 << 7;


export function cloneNode(node:any) {
  const flags = node._flags;
  const children = node._children;
  const clonedChildren = flags & IS_TEXT ? children : [...children];
  const clonedNode = new Node(node._flags, clonedChildren);
  const key = node._key;
  clonedNode._type = node._type;
  clonedNode._style = node._style;
  clonedNode._parent = node._parent;
  clonedNode._key = key;
  return clonedNode;
}

class Node {
  _type:any;
  _children:any;
  _flags:any;
  _key:any;
  _parent:any;
  _style:any;

  constructor(flags:any, children?:any) {
    this._type = null;
    this._children = children;
    this._flags = flags;
    this._key = null;
    this._parent = null;
    this._style = null;
  }
}

export function createBodyNode() {
  const body = new Node(IS_BODY, []);
  body._key = "body";
  return body;
}

export function createBlockNode(blockType = "div") {
  const node = new Node(IS_BLOCK, []);
  node._type = blockType;
  return node;
}

export function createTextNode(text = "") {
  const node = new Node(IS_TEXT);
  node._children = text;
  return node;
}

export function getNodeType(node, flags) {
  if (flags & IS_TEXT) {
    if (flags & IS_BOLD) {
      return "strong";
    }
    if (flags & IS_ITALIC) {
      return "em";
    }
    return "span";
  }
  return node._type;
}