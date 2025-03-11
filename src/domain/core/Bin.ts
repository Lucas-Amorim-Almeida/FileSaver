import * as config from "../../../config/config.json";

import Directory from "./Directory";
import Node from "./Node";

export default class Bin extends Node {
  constructor(
    root: Directory = new Directory(config.ROOT_DIR),
    children: Node[] = [],
  ) {
    super(config.BIN_DIR, root, children);
  }

  async clearBin(clear: (bin: Bin) => Promise<void>): Promise<void> {
    await clear(this);
    //Node é um em concepção Directory logo suas childrens = [], no mínimo
    this.getChildren()!.forEach((node) => this.removeChild(node));
  }

  async restoreElements(
    node: Node,
    restore: (binChild: Node) => Promise<void>,
  ): Promise<void> {
    await restore(node);
    node.getParents()?.addChild(node);
    this.removeChild(node);
  }

  isEmpty(): boolean {
    return this.getChildren()!.length === 0;
  }
}
