// src/__test__/domain/core/Bin.spec.ts
import Bin from "@/domain/core/Bin";
import Node from "@/domain/core/Node";
import InternalError from "@/domain/errors/InternalError";

describe("Bin", () => {
  //criação da lixeira com seus children
  let bin: Bin;
  beforeEach(() => {
    bin = new Bin();
    bin.addChild(new Node("node A", new Node("parent")));
    bin.addChild(
      new Node("node B", new Node("parent"), [
        new Node("child1"),
        new Node("child2"),
      ]),
    );
    bin.addChild(new Node("node C", new Node("parett2")));
    bin.addChild(new Node("node D"));
  });

  afterEach(() => jest.clearAllMocks());

  describe("clear", () => {
    it("Deve limpar corretamente a lixeira", async () => {
      const clearBin = jest.fn();

      //limpa lixeira
      await bin.clear(clearBin);
      expect(bin.getChildren()).toEqual([]);
    });
  });

  describe("restore", () => {
    it("Deve mover os nodes de volta para seus parents originais.", async () => {
      const restoreElement = jest.fn();
      const parent = new Node("node");
      const node = new Node("node", parent);
      bin.addChild(node);

      await bin.restore(node, restoreElement);
      expect(bin.getChildren()).not.toContain(node);
      expect(parent.getChildren()).toContain(node);
    });

    it("Deve lança exceção quando o node tem null como parent.", async () => {
      const restoreElement = jest.fn();
      const node = new Node("node", null);
      bin.addChild(node);

      expect(
        async () => await bin.restore(node, restoreElement),
      ).rejects.toThrow(InternalError);
    });
  });

  describe("isEmpty", () => {
    it("Deve retornar false quando existem children na lixeira.", () => {
      expect(bin.isEmpty()).toBe(false);
    });

    it("Deve retornar true quando não há children na lixeira.", () => {
      bin = new Bin();
      expect(bin.isEmpty()).toBe(true);
    });
  });
});
