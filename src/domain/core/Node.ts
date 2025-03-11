import InternalError from "../errors/InternalError";

export default class Node {
  constructor(
    private name: string,
    private parents: Node | null = null,
    private children: Node[] | null = [],
  ) {}

  equals(node: Node, visitedNodes: Set<Node> = new Set()): boolean {
    if (this === node) return true; // Mesma referência → são iguais

    if (visitedNodes.has(this) || visitedNodes.has(node)) return false; // Evita ciclos
    visitedNodes.add(this);
    visitedNodes.add(node);

    if (this.name !== node.getName()) return false;
    if (this.parents !== node.getParents()) return false;
    if (
      (this.children && !node.getChildren()) ||
      (!this.children && node.getChildren())
    )
      return false;

    const thisChildren = this.children as Node[];
    const nodeChildren = node.getChildren() as Node[];

    if (thisChildren.length !== nodeChildren.length) return false;

    // Verifica se cada filho do primeiro nó existe no segundo e vice-versa
    return thisChildren.every((child) =>
      nodeChildren.some((nodeChild) => child.equals(nodeChild, visitedNodes)),
    );
  }

  getName(): string {
    return this.name;
  }

  getParents(): Node | null {
    return this.parents;
  }

  getChildren(): Node[] | null {
    return this.children;
  }

  setParents(node: Node): void {
    this.parents = node;
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
      return;
    }
    this.children = this.children.filter((child) => !child.equals(node));
  }
}
