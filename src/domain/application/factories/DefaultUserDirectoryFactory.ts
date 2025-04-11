import User from "@/domain/core/User";
import UserDirectoryFactory from "../interfaces/UserDirectoryFactory";
import Root from "@/domain/core/Root";
import NodeManager from "@/domain/core/interfaces/NodeManager";
import Bin from "@/domain/core/Bin";

export default class DefaultUserDirectoryFactory
  implements UserDirectoryFactory
{
  constructor(private readonly nodeManager: NodeManager) {}

  async createFor(user: User): Promise<void> {
    const userRootDir = new Root(user);
    const userBinDir = new Bin(userRootDir);

    await this.nodeManager.createNode(userRootDir);
    await this.nodeManager.createNode(userBinDir);

    userRootDir.addChild(userBinDir);
  }

  async removeFor(user: User): Promise<void> {
    const userRootDir = new Root(user);
    await this.nodeManager.deleteNode(userRootDir);
  }
}
