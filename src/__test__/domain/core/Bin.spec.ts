// src/__test__/domain/core/Bin.spec.ts
import Bin from "@/domain/core/Bin";
import Node from "@/domain/core/Node";

describe("Bin class", () => {
  it("should create a new Bin instance", () => {
    const bin = new Bin();
    expect(bin).toBeInstanceOf(Bin);
  });

  it("should clear the bin", async () => {
    const bin = new Bin();
    const child = new Node("child-name");
    bin.addChild(child);
    await bin.clearBin(() => Promise.resolve());
    expect(bin.getChildren()).not.toContain(child);
  });

  it("should restore an element from the bin", async () => {
    const restoreFunc = jest.fn();

    const bin = new Bin();
    const element = new Node("element-name");

    bin.addChild(element);
    await bin.restoreElements(element, restoreFunc);
    expect(bin.getChildren()).not.toContain(element);
  });

  it("should check if bin is empty", () => {
    const bin = new Bin();
    expect(bin.isEmpty()).toBe(true);
  });

  it("should check if bin is not empty", () => {
    const bin = new Bin();
    const child = new Node("child-name");
    bin.addChild(child);
    expect(bin.isEmpty()).toBe(false);
  });
});
