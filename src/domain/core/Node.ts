import InternalError from "../errors/InternalError";

export default class Node {
  constructor(
    private name: string,
    private parent: Node | null = null,
    private children: Node[] | null = [],
  ) {}

  equals(node: Node, visitedNodes: Set<Node> = new Set()): boolean {
    if (this === node) return true; // Mesma referência → são iguais

    if (visitedNodes.has(this) || visitedNodes.has(node)) return false; // Evita ciclos
    visitedNodes.add(this);
    visitedNodes.add(node);

    if (this.name !== node.getName()) return false;
    if (this.parent !== node.getParent()) return false;

    const thisChildren = this.children as Node[];
    const nodeChildren = node.getChildren() as Node[];
    if (thisChildren.length !== nodeChildren.length) return false;

    if (
      (this.children && !node.getChildren()) ||
      (!this.children && node.getChildren())
    )
      return false;

    // Verifica se cada filho do primeiro nó existe no segundo e vice-versa
    return thisChildren.every((child) =>
      nodeChildren.some((nodeChild) => child.equals(nodeChild, visitedNodes)),
    );
  }

  getName(): string {
    return this.name;
  }

  getParent(): Node | null {
    return this.parent;
  }

  getChildren(): Node[] | null {
    return this.children;
  }

  getPath(): string {
    let current = this as Node;
    const dirNames: string[] = [];
    dirNames.push(this.getName());

    while (current.getParent()) {
      current = current.getParent() as Node;
      dirNames.push(current.getName());
    }

    return dirNames.reverse().join("/");
  }

  setParent(node: Node): void {
    this.parent = node;
  }

  setName(name: string): void {
    this.name = name;
  }

  addChild(node: Node): void {
    if (!this.children) {
      throw new InternalError();
    }
    this.children.push(node);
  }

  removeChild(node: Node): void {
    if (!this.children) {
      throw new InternalError();
    }
    this.children = this.children.filter((child) => !child.equals(node));
  }
}
