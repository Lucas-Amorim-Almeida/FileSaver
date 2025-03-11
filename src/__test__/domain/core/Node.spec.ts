import Node from "@/domain/core/Node";

describe("Node class", () => {
  it("should create a new Node instance", () => {
    const node = new Node("node-name");
    expect(node).toBeInstanceOf(Node);
  });

  it("should set the name property", () => {
    const node = new Node("node-name");
    expect(node.getName()).toBe("node-name");
  });

  it("should set the parents property", () => {
    const parent = new Node("parent-name");
    const node = new Node("node-name", parent);
    expect(node.getParents()).toBe(parent);
  });

  it("should add the children property", () => {
    const node = new Node("node-name");
    const child = new Node("child-name");
    node.addChild(child);
    expect(node.getChildren()).toContain(child);
  });

  it("should remove a child node", () => {
    const node = new Node("node-name");
    const child = new Node("child-name");
    node.addChild(child);
    node.removeChild(child);
    expect(node.getChildren()).not.toContain(child);
  });

  it("should check if two nodes are equal", () => {
    const node1 = new Node("node-name");
    const node2 = new Node("node-name");
    expect(node1.equals(node2)).toBe(true);
  });

  it("should check if two nodes are not equal", () => {
    const node1 = new Node("node-name");
    const node2 = new Node("different-name");
    expect(node1.equals(node2)).toBe(false);
  });

  it("should handle cyclic references when checking equality", () => {
    const node1 = new Node("node-name");
    const node2 = new Node("node-name");

    node1.addChild(node2);
    node2.addChild(node1);

    expect(node1.equals(node2)).toBe(false);
  });
});
