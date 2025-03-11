// src/__test__/domain/core/Directory.spec.ts
import Bin from "@/domain/core/Bin";
import Directory from "@/domain/core/Directory";
import Node from "@/domain/core/Node";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";
import * as config from "../../../../config/config.json";

describe("Directory class", () => {
  let dir: Directory;
  beforeEach(() => {
    dir = new Directory("directory name");
  });

  afterEach(() => jest.clearAllMocks());
  it("should create a new Directory instance", () => {
    const directory = new Directory("dirname");
    expect(directory).toBeInstanceOf(Directory);
  });

  it("should throw an error if directory name is not provided", () => {
    expect(() => new Directory("")).toThrow(RequiredFieldError);
  });

  it("should set the name property", () => {
    const directory = new Directory("dirname");
    expect(directory.getName()).toBe("dirname");
  });

  it("should set the parents property", () => {
    const parent = new Node("parent-name");
    const directory = new Directory("directory-name", parent);
    expect(directory.getParents()).toBe(parent);
  });

  it("should set the children property", () => {
    const child = new Node("child-name");
    dir.addChild(child);
    expect(dir.getChildren()).toContain(child);
  });

  it("should remove a child node", () => {
    const child = new Node("child-name");
    const directory = new Directory("directory-name", dir, [child]);
    directory.removeChild(child);
    expect(directory.getChildren()).not.toContain(child);
  });

  it("directory must be a root directory", () => {
    const directory = new Directory(config.ROOT_DIR, null);
    expect(directory.isRootDir()).toBe(true);
  });
  it("directory must not be a root directory", () => {
    const directory = new Directory("directory-name", dir);
    expect(directory.isRootDir()).toBe(false);
  });

  it("should check if directory is bin directory", () => {
    const directory = new Directory("directory-name");
    expect(directory.isBinDir()).toBe(false);
  });

  it("should rename the directory", async () => {
    const renameTo = jest.fn();
    await dir.rename("new-directory-name", renameTo);
    expect(dir.getName()).toBe("new-directory-name");
  });

  it("should move the directory", async () => {
    const moveTo = jest.fn();

    //construção da estrutura de diretórios
    const directory = new Directory("directory-name", dir);
    const newParent = new Directory("new-parent-name", dir);
    dir.addChild(directory);
    dir.addChild(newParent);

    await directory.move(newParent, moveTo);
    expect(directory.getParents()).toBe(newParent);
    expect(dir.getChildren()).not.toContain(directory);
    expect(newParent.getChildren()).toContain(directory);
  });

  it("should move to same directory", async () => {
    const moveTo = jest.fn();

    //construção da estrutura de diretórios
    const directory = new Directory("directory-name", dir);
    dir.addChild(directory);

    expect(directory.move(directory, moveTo)).resolves.toBeUndefined();
  });

  it("should copy the directory", async () => {
    const copyTo = jest.fn();
    copyTo.mockResolvedValue("directory-name");
    //construção da estrutura de diretórios
    const directory = new Directory("directory-name", dir);
    const newParent = new Directory("new-parent-name", dir, []);
    dir.addChild(directory);
    dir.addChild(newParent);

    await directory.copy(newParent, copyTo);
    expect(directory.getParents()).toBe(dir);
    expect(dir.getChildren()).toContain(directory);
    //como newParent foi criada com [] de children apos o file.copy deve-se ter 1 de length
    expect(newParent.getChildren()).toHaveLength(1);
  });

  it("should copy to same directory", async () => {
    const copyTo = jest.fn();
    copyTo.mockResolvedValue("dirname copied");
    //construção da estrutura de diretórios
    const directory = new Directory("directory-name", dir, []);
    dir.addChild(directory); //passa a ter length 1

    await directory.copy(dir, copyTo);

    expect(directory.getParents()).toBe(dir);
    expect(dir.getChildren()).toContain(directory);
    //como newParent foi criada com [] de children apos o file.copy deve-se ter 1 de length
    expect(dir.getChildren()).toHaveLength(2);
    const dirFilter = dir
      .getChildren()
      ?.filter((child) => child.getName() === "dirname copied");
    expect(dirFilter).toHaveLength(1);
  });

  it("should move the directory to bin", async () => {
    const toBin = jest.fn();

    const bin = new Bin();
    const directory = new Directory("directory-name", dir);
    dir.addChild(directory);

    await directory.moveToBin(bin, toBin);
    expect(directory.getParents()).toBe(dir);
    expect(dir.getChildren()).not.toContain(directory);
    expect(bin.getChildren()).toContain(directory);
  });
});
