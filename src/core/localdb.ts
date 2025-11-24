import path from "node:path";
import { DB } from "./db.js";

export class LocalDB {
  /** @private */
  private basepath: string;
  constructor(basepath: string) {
    this.basepath = path.isAbsolute(basepath) ? basepath : path.resolve(basepath);
  }
  public db(name: string): DB {
    const filepath = path.resolve(this.basepath, name.toLowerCase());
    return new DB(filepath);
  }
}