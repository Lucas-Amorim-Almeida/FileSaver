import Node from "../Node";

export default interface NodeManager {
  createNode(node: Node): Promise<void>;
  renameNode(nodeName: string, node: Node): Promise<void>;
  moveNode(destiny: Node, origin: Node): Promise<void>;
  copyNode(destiny: Node, origin: Node): Promise<void>;
  deleteNode(node: Node): Promise<void>;
}
