import File from "@/domain/core/File";
import Directory from "@/domain/core/Directory";
import RequiredFieldError from "@/domain/errors/RequiredFieldError";
import Bin from "@/domain/core/Bin";

describe("File", () => {
  describe("Constructor", () => {
    it("Deve instanciar um objeto  da classe File", () => {
      const dir = new Directory("dir_name");
      expect(new File("filename", "ext", dir)).toBeInstanceOf(File);
      expect(new File("filename", "ext")).toBeInstanceOf(File);
    });

    it("Deve lançar uma exceção RequiredFieldError quando o nome do arquivo for uma string vazia", () => {
      const dir = new Directory("dir_name");
      expect(() => new File("", "ext", dir)).toThrow(RequiredFieldError);
      expect(() => new File("", "ext")).toThrow(RequiredFieldError);
    });

    it("Deve lançar uma exceção RequiredFieldError quando a extensão do arquivo for uma string vazia", () => {
      const dir = new Directory("dir_name");
      expect(() => new File("filename", "", dir)).toThrow(RequiredFieldError);
      expect(() => new File("filename", "")).toThrow(RequiredFieldError);
    });
  });

  describe("rename", () => {
    let file: File;
    beforeEach(() => {
      file = new File("filename", "ext");
    });

    afterEach(() => jest.clearAllMocks());

    it("Deve undefined (não retornar) quando o nome do arquivo for uma string vazia.", async () => {
      const renameTo = jest.fn();
      expect(await file.rename("", renameTo)).toBeUndefined();
    });

    it("Deve renomear o arquivo.", async () => {
      const renameTo = jest.fn();
      const newFileName = "new file name";

      await file.rename(newFileName, renameTo);
      expect(file.getName()).toEqual(`${newFileName}.ext`);
      expect(renameTo).toHaveBeenCalledWith(file, newFileName);
    });
  });

  describe("move", () => {
    const rootDir = new Directory("dir-name");
    let file: File;
    beforeEach(() => {
      file = new File("filename", "ext", rootDir);
      rootDir.addChild(file);
    });

    afterEach(() => jest.clearAllMocks());
    afterEach(() => rootDir.removeChild(file));

    it("Deve retornar undefined (não retornar) quando se tenta mover o arquivo para o mesmo local onde ele está.", async () => {
      const moveTo = jest.fn();
      expect(await file.move(rootDir, moveTo)).toBeUndefined();
    });

    it("Deve mover o arquivo para o destino adequado.", async () => {
      const moveTo = jest.fn();

      const newParent = new Directory("new parent name");
      await file.move(newParent, moveTo);

      //o diretório não deve está como child do antigo diretório parent
      expect(rootDir.getChildren()).not.toContain(file);

      //o diretório deve ter um novo parent
      expect(file.getParent()).toBe(newParent);

      //o diretório de destino deve ter uma child a mais, sendo ela o diretório dir.
      expect(newParent.getChildren()).toContain(file);
      expect(moveTo).toHaveBeenCalledWith(file, newParent);
    });
  });

  describe("copy", () => {
    let file: File;
    const parentDir = new Directory("dir-name");
    beforeEach(() => {
      file = new File("filename", "ext", parentDir);
      parentDir.addChild(file);
    });

    afterEach(() => parentDir.removeChild(file));
    afterEach(() => jest.clearAllMocks());

    it("Deve copiar o arquivo para outro diretório de destino.", async () => {
      const copyTo = jest.fn();
      const destDir = new Directory("destiny-dir");

      copyTo.mockResolvedValue("filename");

      const copyOfFile = await file.copy(destDir, copyTo);

      //o diretório original deve se manter inalterado
      expect(file.getParent()).toBe(parentDir);
      expect(parentDir.getChildren()).toContain(file);

      //um novo diretório deve ser adicionado a pasta de destino
      expect(copyOfFile.getParent()).toBe(destDir);
      expect(copyOfFile.getName()).toBe(file.getName());
      expect(destDir.getChildren()).toContain(copyOfFile);
      expect(copyTo).toHaveBeenCalledWith(file, destDir);
    });

    it("Deve copiar o arquivo para o mesmo diretório em que se encontra.", async () => {
      const copyTo = jest.fn();
      copyTo.mockResolvedValue("filename" + " copy");

      const copyOfFile = await file.copy(parentDir, copyTo);

      //o diretório original deve se manter inalterado
      expect(file.getParent()).toBe(parentDir);
      expect(parentDir.getChildren()).toContain(file);

      //um novo diretório deve ser adicionado a pasta de destino
      expect(copyOfFile.getParent()).toBe(parentDir);
      const [filename, ext] = file.getName().split(".");
      expect(copyOfFile.getName()).toBe(`${filename} copy.${ext}`);
      expect(copyTo).toHaveBeenCalledWith(file, parentDir);
    });
  });

  describe("moveToBin", () => {
    it("Deve mover um diretório para a lixeira", async () => {
      const toBin = jest.fn();
      const dir = new Directory("dir-name");
      const file = new File("filename", "ext", dir);
      dir.addChild(file);

      const bin = new Bin();

      await file.moveToBin(bin, toBin);

      //o diretório movido deve continuar referenciando o antigo parent
      expect(file.getParent()).toBe(dir);
      //o antigo parent do diretório movido não deve contê-lo entre suas children
      expect(dir.getChildren()).not.toContain(file);
      //a lixeira deve ter como child o diretório movido
      expect(bin.getChildren()).toContain(file);
    });
  });
});
