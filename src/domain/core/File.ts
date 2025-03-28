import RequiredFieldError from "../errors/RequiredFieldError";
import Directory from "./Directory";
import * as config from "../../../config/config.json";
import Node from "./Node";
import Bin from "./Bin";

export default class File extends Node {
  constructor(
    filename: string,
    ext: string,
    dir: Directory = new Directory(config.ROOT_DIR),
  ) {
    if (!filename || !ext) {
      throw new RequiredFieldError("Filename or extension");
    }
    super(`${filename}.${ext}`, dir, null);
  }

  async rename(
    newFilename: string,
    renameTo: (file: File, filename: string) => Promise<void>,
  ): Promise<void> {
    if (newFilename) {
      const [, ext] = this.getName().split(".");
      await renameTo(this, newFilename);
      this.setName(`${newFilename}.${ext}`);
    }
  }

  async move(
    dir: Directory,
    moveTo: (file: File, destiny: Directory) => Promise<void>,
  ): Promise<void> {
    if (!this.equals(dir)) {
      await moveTo(this, dir);
      this.getParent()!.removeChild(this);
      this.setParent(dir);
      dir.addChild(this);
    }
  }

  async copy(
    dir: Directory,
    copyTo: (file: File, destiny: Directory) => Promise<string>,
  ): Promise<File> {
    const [, extFile] = this.getName().split(".");

    const copyFileName = await copyTo(this, dir);
    const file = new File(copyFileName, extFile, dir);
    dir.addChild(file);
    return file;
  }

  async moveToBin(
    bin: Bin,
    toBin: (dir: File) => Promise<void>,
  ): Promise<void> {
    await toBin(this);
    this.getParent()?.removeChild(this);
    bin.addChild(this);
  }
}
