import InternalError from "../errors/InternalError";
import RequiredFieldError from "../errors/RequiredFieldError";
import * as config from "../../../config/config.json";
import InvalidFieldError from "../errors/InvalidFieldError";
import Node from "./Node";
import Bin from "./Bin";

export default class Directory extends Node {
  constructor(
    dirName: string,
    parents: Node | null = null,
    children: Node[] = [],
  ) {
    if (!dirName) {
      throw new RequiredFieldError("Directory name");
    }
    super(dirName, parents, children);
  }

  isBinDir(): boolean {
    if (this.getName() !== config.BIN_DIR) {
      return false;
    }

    //se o pai for null (falsy) é raiz e não lixeira
    if (!this.getParent()) {
      return false;
    }

    const root = new Directory(config.ROOT_DIR);
    if (!root.equals(this.getParent() as Node)) {
      return false;
    }

    return true;
  }

  isRootDir(): boolean {
    if (this.getName() !== config.ROOT_DIR) {
      return false;
    }

    //se existe diretório pai não é raiz
    if (this.getParent()) {
      return false;
    }

    const root = new Directory(config.ROOT_DIR);
    return root.equals(this);
  }

  async rename(
    newDirName: string,
    renameTo: (dir: Directory, dirname: string) => Promise<void>,
  ): Promise<void> {
    if (!newDirName) {
      return;
    }
    if (newDirName === config.BIN_DIR || newDirName === config.ROOT_DIR) {
      throw new InvalidFieldError("Directory name");
    }

    await renameTo(this, newDirName);
    this.setName(newDirName);
  }

  async move(
    dir: Directory,
    moveTo: (dir: Directory, destiny: Directory) => Promise<void>,
  ): Promise<void> {
    if (this.isBinDir() || this.isRootDir()) {
      throw new InternalError();
    }

    if (this.equals(dir)) {
      return;
    }

    await moveTo(this, dir);
    this.getParent()?.removeChild(this);
    this.setParent(dir);
    dir.addChild(this);
  }

  async copy(
    dir: Directory,
    copyTo: (dir: Directory, destiny: Directory) => Promise<string>, //returns copyDir name
  ): Promise<Directory> {
    if (this.isBinDir() || this.isRootDir()) {
      throw new InternalError();
    }

    const copyDirName = await copyTo(this, dir);

    //em Directory nunca terá children = null, isso só acontecerá em File
    const copyDir: Directory = new Directory(
      copyDirName,
      dir,
      this.getChildren() as Node[],
    );
    dir.addChild(copyDir);

    return copyDir;
  }

  async moveToBin(
    bin: Bin,
    toBin: (dir: Directory) => Promise<void>,
  ): Promise<void> {
    await toBin(this);

    //Volta até o pai e remove este de seus filhos
    //este continuara tendo o pai normalmente para que o restore da Bin funcione
    const thisParents = this.getParent();
    thisParents?.removeChild(this);
    bin.addChild(this);
  }
}
