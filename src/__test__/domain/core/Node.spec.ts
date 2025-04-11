import Node from "@/domain/core/Node";
import InternalError from "@/domain/errors/InternalError";

describe("Node", () => {
  describe("equals", () => {
    it("Deve retornar false quando os nodes são diferentes", () => {
      const parentA = new Node("Parent-A");
      const nodeA = new Node("node-A", parentA);
      parentA.addChild(nodeA);

      const parentB = new Node("Parent-B");
      const nodeB = new Node("node-B", parentB);
      parentB.addChild(nodeB);

      expect(nodeA.equals(nodeB)).toBe(false);
      expect(nodeB.equals(nodeA)).toBe(false);
    });

    it("Deve retornar true quando o equals é aplicado mesmo node", () => {
      const parentA = new Node("Parent-A");
      const nodeA = new Node("node-A", parentA);
      parentA.addChild(nodeA);

      expect(nodeA.equals(nodeA)).toBe(true);
    });

    it("Deve retornar true quando os nodes tem mesmas propriedades", () => {
      const parentA = new Node("Parent-A");
      const nodeA = new Node("node-A", parentA);
      parentA.addChild(nodeA);

      const nodeB = new Node("node-A", parentA);
      parentA.addChild(nodeB);

      expect(nodeA.equals(nodeB)).toBe(true);
      expect(nodeB.equals(nodeA)).toBe(true);
    });

    it("Deve retornar false quando os nodes tem nomes diferenes", () => {
      const parentA = new Node("Parent-A");
      const nodeA = new Node("node-A", parentA);
      parentA.addChild(nodeA);

      const nodeB = new Node("node-B", parentA);
      parentA.addChild(nodeB);

      expect(nodeA.equals(nodeB)).toBe(false);
      expect(nodeB.equals(nodeA)).toBe(false);
    });

    it("Deve retornar false quando os nodes tem parents diferentes", () => {
      const parentA = new Node("Parent-A");
      const nodeA = new Node("node-A", parentA);

      const parentB = new Node("Parent-B");
      const nodeB = new Node("node-A", parentB);

      expect(nodeA.equals(nodeB)).toBe(false);
      expect(nodeB.equals(nodeA)).toBe(false);
    });

    it("Deve retornar false quando os nodes tem quantidades de children diferentes", () => {
      const childA = new Node("Child-A");
      const nodeA = new Node("node-A", null, [childA]);
      childA.setParent(nodeA);

      const childB = new Node("child-B");
      const childC = new Node("child-C");
      const nodeB = new Node("node-B", null, [childB, childC]);
      childB.setParent(nodeB);
      childC.setParent(nodeB);

      expect(nodeA.equals(nodeB)).toBe(false);
      expect(nodeB.equals(nodeA)).toBe(false);
    });

    it("Deve retornar false quando os nodes tem children diferentes", () => {
      const parentA = new Node("Parent-A");
      const nodeA = new Node("node-A", parentA);
      parentA.addChild(nodeA);

      const parentB = new Node("Parent-B");
      const nodeB = new Node("node-B", parentB);
      parentB.addChild(nodeB);

      expect(nodeA.equals(nodeB)).toBe(false);
      expect(nodeB.equals(nodeA)).toBe(false);
    });

    it("Deve retornar false quando há referências ciclicas.", () => {
      const rootA = new Node("RootA");
      const childA1 = new Node("Child-A1", rootA);
      const childA2 = new Node("Child-A2", rootA);
      rootA.addChild(childA1);
      rootA.addChild(childA2);

      const rootB = new Node("RootA");
      const childB1 = new Node("Child-A1", rootB);
      rootB.addChild(childB1);
      rootB.addChild(rootA);

      expect(rootA.equals(rootB)).toBe(false);
    });
  });

  describe("addChild", () => {
    it("Deve adicionar um child ao node", () => {
      const node = new Node("Parent");
      const child = new Node("Child");

      node.addChild(child);
      expect(node.getChildren()).toContain(child);
    });

    it("Deve lançar uma exceção InternalError quando se tenta adicionar uma child a um node que aponta para null", () => {
      //O caso em que um node tém null como child significa que esse node representa um File
      const parentA = new Node("file", new Node("parent"), null);
      const parentB = new Node("file", null, null);
      const node = new Node("Node");

      expect(() => parentA.addChild(node)).toThrow(InternalError);
      expect(() => parentB.addChild(node)).toThrow(InternalError);
    });
  });

  describe("removeChild", () => {
    it("Deve remover um child ao node", () => {
      const node = new Node("Parent");
      const child = new Node("Child", node);

      node.addChild(child);
      node.removeChild(child);
      expect(node.getChildren()).not.toContain(child);
    });

    it("Deve lança uma exceção InternalError quando se tenta remover uma child de um node que aponta para null", () => {
      //Isso é, Lança exceção quando se tenta remover uma child de File

      const parent = new Node("file", new Node("parent"), null);
      const parentA = new Node("file", null, null);

      expect(() => parent.removeChild(new Node("Node"))).toThrow(InternalError);
      expect(() => parentA.removeChild(new Node("Node"))).toThrow(
        InternalError,
      );
    });
  });

  describe("getPath", () => {
    it("Deve retornar uma string correspondente ao caminho desde a raiz até o node atual", () => {
      const root = new Node("Root");
      const child1 = new Node("Child1", root);
      const child2 = new Node("Child2", child1);
      const child3 = new Node("Child3", child2);

      expect(child3.getPath()).toBe("Root/Child1/Child2/Child3");
    });

    it("Deve retornar uma string quando o node não possio parents.", () => {
      const node = new Node("node");

      expect(node.getPath()).toBe(node.getName());
    });
  });
});
