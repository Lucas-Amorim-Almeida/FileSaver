import Bin from "@/domain/core/Bin";
import Directory from "@/domain/core/Directory";
import Node from "@/domain/core/Node";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";
import * as config from "../../../../config/config.json";
import InvalidFieldError from "@/domain/errors/InvalidFieldError";
import InternalError from "@/domain/errors/InternalError";

describe("Directory", () => {
  describe("Constructor", () => {
    it("Deve instanciar um objeto  da classe Directory", () => {
      const node = new Node("node_name");
      const children = [
        new Node("chldrn-1"),
        new Node("chldrn-2"),
        new Node("chldrn-3"),
        new Node("chldrn-4"),
        new Node("chldrn-5"),
      ];
      expect(new Directory("dir_name", node, children)).toBeInstanceOf(
        Directory,
      );
      expect(new Directory("dir_name", node)).toBeInstanceOf(Directory);
      expect(new Directory("dir_name")).toBeInstanceOf(Directory);
      expect(new Directory("dir_name", null, children)).toBeInstanceOf(
        Directory,
      );
      expect(new Directory("dir_name", null, [])).toBeInstanceOf(Directory);
    });

    it("Deve lançar uma exceção RequiredFieldError quando o nome do diretório for uma string vazia", () => {
      const node = new Node("node_name");
      const children = [
        new Node("chldrn-1"),
        new Node("chldrn-2"),
        new Node("chldrn-3"),
      ];
      expect(() => new Directory("", node, children)).toThrow(
        RequiredFieldError,
      );
      expect(() => new Directory("", node)).toThrow(RequiredFieldError);
      expect(() => new Directory("")).toThrow(RequiredFieldError);
      expect(() => new Directory("", null, children)).toThrow(
        RequiredFieldError,
      );
      expect(() => new Directory("", null, [])).toThrow(RequiredFieldError);
    });
  });

  describe("isBinDir", () => {
    it("Deve retornar false, nome do diretório não coincide com o da lixeira.", () => {
      const dir = new Directory("dir_name");
      expect(dir.isBinDir()).toBe(false);
    });

    it("Deve retornar false, nome do diretório coincide mas não tem diretório pai.", () => {
      const dir = new Directory(config.BIN_DIR);
      expect(dir.isBinDir()).toBe(false);
    });
    it("Deve retornar false, nome do diretório coincide com o da lixeira e não está na raiz.", () => {
      const rootDir = new Directory(config.ROOT_DIR);
      const parentDir = new Directory("parent_dir", rootDir);
      const dir = new Directory(config.BIN_DIR, parentDir);
      expect(dir.isBinDir()).toBe(false);
    });

    it("Deve retornar true.", () => {
      const rootDir = new Directory(config.ROOT_DIR);
      const dir = new Directory(config.BIN_DIR, rootDir);
      expect(dir.isBinDir()).toBe(true);
    });
  });

  describe("isRootDir", () => {
    it("Deve retornar false, nome do diretório nao coincide com o da raiz.", () => {
      const dir = new Directory("dir_name");
      expect(dir.isRootDir()).toBe(false);
    });

    it("Deve retornar false, nome do diretório coincide com o da raiz e o diretorio tem um pai.", () => {
      const parentDir = new Directory("parent_dir");
      const dir = new Directory(config.ROOT_DIR, parentDir);
      expect(dir.isRootDir()).toBe(false);
    });
    it("Deve retornar true", () => {
      const dir = new Directory(config.ROOT_DIR);
      expect(dir.isRootDir()).toBe(true);
    });
  });

  describe("rename", () => {
    let dir: Directory;
    beforeEach(() => {
      dir = new Directory("directory name");
    });

    afterEach(() => jest.clearAllMocks());

    it("Deve undefined (não retornar) quando o nome do diretório for uma string vazia.", async () => {
      const renameTo = jest.fn();
      expect(await dir.rename("", renameTo)).toBeUndefined();
    });

    it("Deve lançar uma exceção InvalidFieldError quando o nomo do diretório for igual ao nome da lixeira ou da raiz.", async () => {
      const renameTo = jest.fn();
      expect(
        async () => await dir.rename(config.BIN_DIR, renameTo),
      ).rejects.toThrow(InvalidFieldError);
      expect(
        async () => await dir.rename(config.ROOT_DIR, renameTo),
      ).rejects.toThrow(InvalidFieldError);
    });

    it("Deve renomear o diretório.", async () => {
      const renameTo = jest.fn();
      const newDirName = "new directory name";

      await dir.rename(newDirName, renameTo);
      expect(dir.getName()).toEqual(newDirName);
      expect(renameTo).toHaveBeenCalledWith(dir, newDirName);
    });
  });

  describe("move", () => {
    const rootDir = new Directory(config.ROOT_DIR);
    let dir: Directory;
    beforeEach(() => {
      dir = new Directory("directory name", rootDir);
      rootDir.addChild(dir);
    });

    afterEach(() => jest.clearAllMocks());
    afterEach(() => rootDir.removeChild(dir));

    it("Deve lançar uma exceção InternalError quando o diretório atual for a lixeira ou a raiz.", async () => {
      const moveTo = jest.fn();
      const rootDir = new Directory(config.ROOT_DIR);
      const binDir = new Directory(config.BIN_DIR, rootDir);

      expect(async () => await rootDir.move(dir, moveTo)).rejects.toThrow(
        InternalError,
      );
      expect(async () => await binDir.move(dir, moveTo)).rejects.toThrow(
        InternalError,
      );
    });

    it("Deve retornar undefined (não retornar) quando se tenta mover o diretório para o mesmo local onde ele está.", async () => {
      const moveTo = jest.fn();
      expect(await dir.move(dir, moveTo)).toBeUndefined();
    });

    it("Deve mover o diretório para o destino adequado.", async () => {
      const moveTo = jest.fn();

      const newParent = new Directory("new parent name");
      await dir.move(newParent, moveTo);

      //o diretório não deve está como child do antigo diretório parent
      expect(rootDir.getChildren()).not.toContain(dir);

      //o diretório deve ter um novo parent
      expect(dir.getParent()).toBe(newParent);

      //o diretório de destino deve ter uma child a mais, sendo ela o diretório dir.
      expect(newParent.getChildren()).toContain(dir);
      expect(moveTo).toHaveBeenCalledWith(dir, newParent);
    });
  });

  describe("copy", () => {
    let dir: Directory;
    const rootDir = new Directory(config.ROOT_DIR);
    beforeEach(() => {
      dir = new Directory("directory name", rootDir);
      rootDir.addChild(dir);
    });

    afterEach(() => rootDir.removeChild(dir));
    afterEach(() => jest.clearAllMocks());

    it("Deve lançar uma exceção InternalError quando o diretório atual for a lixeira ou a raiz.", async () => {
      const copyTo = jest.fn();
      const rootDir = new Directory(config.ROOT_DIR);
      const binDir = new Directory(config.BIN_DIR, rootDir);

      expect(async () => await rootDir.copy(dir, copyTo)).rejects.toThrow(
        InternalError,
      );
      expect(async () => await binDir.copy(dir, copyTo)).rejects.toThrow(
        InternalError,
      );
    });

    it("Deve copiar a pasta para outra pasta destino.", async () => {
      const copyTo = jest.fn();
      const destDir = new Directory("destiny-dir");

      copyTo.mockResolvedValue(dir.getName());

      const copyOfDir = await dir.copy(destDir, copyTo);

      //o diretório original deve se manter inalterado
      expect(dir.getParent()).toBe(rootDir);
      expect(rootDir.getChildren()).toContain(dir);

      //um novo diretório deve ser adicionado a pasta de destino
      expect(copyOfDir.getParent()).toBe(destDir);
      expect(copyOfDir.getName()).toBe(dir.getName());
      expect(destDir.getChildren()).toContain(copyOfDir);
      expect(copyTo).toHaveBeenCalledWith(dir, destDir);
    });

    it("Deve copiar a pasta para a mesma pasta em que se encontra.", async () => {
      const copyTo = jest.fn();
      copyTo.mockResolvedValue(dir.getName() + " copy");

      const copyOfDir = await dir.copy(dir, copyTo);

      //o diretório original deve se manter inalterado
      expect(dir.getParent()).toBe(rootDir);
      expect(rootDir.getChildren()).toContain(dir);

      //um novo diretório deve ser adicionado a pasta de destino
      expect(copyOfDir.getParent()).toBe(dir);
      expect(copyOfDir.getName()).toBe(dir.getName() + " copy");
      expect(dir.getChildren()).toContain(copyOfDir);
      expect(copyTo).toHaveBeenCalledWith(dir, dir);
    });
  });

  describe("moveToBin", () => {
    it("Deve mover um diretório para a lixeira", async () => {
      const toBin = jest.fn();
      const dir = new Directory("dir-name");
      const bin = new Bin();
      const directory = new Directory("directory-name", dir);
      dir.addChild(directory);

      await directory.moveToBin(bin, toBin);

      //o diretório movido deve continuar referenciando o antigo parent
      expect(directory.getParent()).toBe(dir);
      //o antigo parent do diretório movido não deve contê-lo entre suas children
      expect(dir.getChildren()).not.toContain(directory);
      //a lixeira deve ter como child o diretório movido
      expect(bin.getChildren()).toContain(directory);
    });
  });
});
