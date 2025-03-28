import * as config from "../../../config/config.json";
import InternalError from "../errors/InternalError";

import Directory from "./Directory";
import Node from "./Node";

export default class Bin extends Node {
  constructor(
    root: Directory = new Directory(config.ROOT_DIR),
    children: Node[] = [],
  ) {
    super(config.BIN_DIR, root, children);
  }

  async clear(clearBin: (bin: Bin) => Promise<void>): Promise<void> {
    await clearBin(this);
    //Node é um em concepção Directory logo suas childrens = [], no mínimo
    this.getChildren()!.forEach((node) => this.removeChild(node));
  }

  async restore(
    node: Node,
    restoreElement: (binChild: Node) => Promise<void>,
  ): Promise<void> {
    if (node.getParent() === null) {
      throw new InternalError();
    }

    await restoreElement(node);

    node.getParent()!.addChild(node);
    this.removeChild(node);
  }

  isEmpty(): boolean {
    return this.getChildren()!.length === 0;
  }
}
