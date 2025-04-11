import Directory from "@/domain/core/Directory";
import User from "@/domain/core/User";
import * as config from "../../../config/config.json";

export default class Root extends Directory {
  private isCreated = false;
  constructor(user: User) {
    const userRootDirname = `${config.ROOT_DIR}${user.getUsername()}`;
    super(userRootDirname);

    //Estabelece relações entre o dirtório raiz da aplicação e a raiz para um usuário
    this.setParent(this.APP_ROOT);
    this.APP_ROOT.addChild(this);
  }

  getIsCreated(): boolean {
    return this.isCreated;
  }
}
