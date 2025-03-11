// src/__test__/domain/core/File.spec.ts
import File from "@/domain/core/File";
import Directory from "@/domain/core/Directory";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";
import Bin from "@/domain/core/Bin";

describe("File class", () => {
  let dir: Directory;

  beforeEach(() => {
    dir = new Directory("directory-name");
  });

  afterEach(() => jest.clearAllMocks());

  it("should create a new File instance", () => {
    const file = new File("file-name", "txt", dir);
    expect(file).toBeInstanceOf(File);
  });

  it("should throw an error if file name or extension is not provided", () => {
    expect(() => new File("", "txt", dir)).toThrow(RequiredFieldError);
    expect(() => new File("file-name", "", dir)).toThrow(RequiredFieldError);
  });

  it("should get the name property", () => {
    const file = new File("file-name", "txt", dir);
    expect(file.getName()).toBe("file-name.txt");
  });

  it("should get the parents property", () => {
    const parent = new Directory("parent-name");
    const file = new File("file-name", "txt", parent);
    expect(file.getParents()).toBe(parent);
  });

  it("should rename the file", async () => {
    const renameTo = jest.fn();

    const file = new File("file-name", "txt", dir);
    const newName = "new-file-name";

    await file.rename(newName, renameTo);
    expect(file.getName()).toBe(newName);
  });

  it("should move the file", async () => {
    const moveTo = jest.fn();

    const newParent = new Directory("new-parent-name");
    const file = new File("file-name", "txt", dir);
    dir.addChild(file);

    await file.move(newParent, moveTo);
    expect(file.getParents()).toBe(newParent);
    expect(dir.getChildren()).not.toContain(file);
    expect(newParent.getChildren()).toContain(file);
  });
  it("should move to same directory", async () => {
    const moveTo = jest.fn();

    const newParent = new Directory("new-parent-name");
    const file = new File("file-name", "txt", dir);
    dir.addChild(file);

    expect(file.move(newParent, moveTo)).resolves.toBeUndefined();
  });

  it("should copy the file", async () => {
    const copyTo = jest.fn();

    copyTo.mockResolvedValue("file-name");

    const newParent = new Directory("new-parent-name", dir, []);
    const file = new File("file-name", "txt", dir);
    dir.addChild(file);

    await file.copy(newParent, copyTo);

    expect(file.getParents()).toBe(dir);
    expect(dir.getChildren()).toContain(file);
    //deve haver incremento na pasta de destino
    expect(newParent.getChildren()).toHaveLength(1);
  });

  it("should copy to same directory", async () => {
    const copyTo = jest.fn();
    copyTo.mockResolvedValue("file-name copy");

    const direcotory = new Directory("dirname", dir, []);
    const file = new File("file-name", "txt", direcotory); //direcotory tem [] children por default
    direcotory.addChild(file); //passa a ter length 1

    await file.copy(direcotory, copyTo); //passa a ter length 2

    expect(file.getParents()).toBe(direcotory);
    expect(direcotory.getChildren()).toContain(file);
    //deve haver incremento na pasta de destino
    expect(direcotory.getChildren()).toHaveLength(2);
    const direcotoryFilter = direcotory
      .getChildren()
      ?.filter((child) => child.getName().includes("file-name copy")); //possui a extensão no nome
    expect(direcotoryFilter).toHaveLength(1);
  });

  it("should move the file to bin", async () => {
    const toBin = jest.fn();
    const bin = new Bin();
    const file = new File("file-name", "txt", dir);
    dir.addChild(file);

    await file.moveToBin(bin, toBin);
    expect(dir.getChildren()).not.toContain(file);
    expect(bin.getChildren()).toContain(file);
  });
});
