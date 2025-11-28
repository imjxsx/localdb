import path from "node:path";
import { isObject, toError, replacer, reviver } from "../utils/index.js";
import fs from "node:fs";
import { BSON } from "bson";
import { Collection } from "./collection.js";
import { IDocument, IDBStats } from "../types/index.js";

export class DB {
  /** @private */
  private filepath: string;
  /** @private */
  private store: Record<string, any>;
  /** @private */
  private timeout: NodeJS.Timeout | null = null;
  public catch?: (err: Error) => void;
  constructor(filepath: string) {
    this.filepath = path.isAbsolute(filepath) ? filepath : path.resolve(filepath);
    if (!this.filepath.endsWith(".bson")) {
      this.filepath = `${this.filepath}.bson`;
    }
    this.store = {};
  }
  public async load(): Promise<void> {
    try {
      try {
        await fs.promises.access(this.filepath);
      }
      catch {
        await this.save();
        return;
      }
      const readed = await fs.promises.readFile(this.filepath);
      const deserialized = BSON.deserialize(readed);
      const revived = reviver(deserialized);
      if (!isObject(revived)) {
        return;
      }
      this.store = revived;
    }
    catch (e) {
      if (this.catch) {
        this.catch(toError(e));
      }
    }
  }
  public async save(): Promise<void> {
    try {
      const replaced = replacer(this.store);
      if (!isObject(replaced)) {
        return;
      }
      const serialized = BSON.serialize(replaced);
      await fs.promises.writeFile(this.filepath, serialized);
    }
    catch (e) {
      if (this.catch) {
        this.catch(toError(e));
      }
    }
  }
  public collection<T extends IDocument = IDocument>(name: string): Collection<T> {
    name = name.toLowerCase();
    if (!name.endsWith("s")) {
      name = `${name}s`;
    }
    if (!(name in this.store)) {
      this.store[name] = {};
    }
    return new Collection<T>(this.store[name]);
  }
  public collections(): string[] {
    return Object.keys(this.store);
  }
  public async drop(): Promise<void> {
    try {
      await fs.promises.unlink(this.filepath);
      this.store = {};
      if (this.timeout) {
        clearInterval(this.timeout);
      }
    }
    catch (e) {
      if (this.catch) {
        this.catch(toError(e));
      }
    }
  }
  public async stats(): Promise<IDBStats | null> {
    try {
      const stat = await fs.promises.stat(this.filepath);
      const collections = this.collections();
      const documents = collections.reduce((acc, name) => {
        const collection = this.store[name];
        return acc + Object.keys(collection).length;
      }, 0);
      return {
        name: this.name,
        collections: collections.length,
        documents,
        size: stat.size,
        filepath: this.filepath,
      };
    }
    catch (e) {
      if (this.catch) {
        this.catch(toError(e));
      }
      return null;
    }
  }
  public get name(): string {
    return path.basename(this.filepath, ".bson");
  }
  public autosave(delay: number): void {
    if (this.timeout !== null) {
      return;
    }
    this.timeout = setInterval(async () => {
      try {
        await this.save();
      }
      catch (e) {
        if (this.catch) {
          this.catch(toError(e));
        }
      }
    }, delay);
  }
}