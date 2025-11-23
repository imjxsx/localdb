import { randomUUID } from "node:crypto";
import { IDocument } from "../types/index.js";

export class Collection<T extends IDocument> {
  private documents: Record<string, T>;
  constructor(store: Record<string, T>) {
    this.documents = store;
  }
  private matches(document: T, filter?: Partial<T>): boolean {
    return Object.entries(filter ?? {}).every(([key, value]) => (document[key as keyof T] === value));
  }
  public insertOne(value: Omit<T, "__uuid" | "updatedAt" | "createdAt">): T {
    const uuid = randomUUID();
    const document = <T>{
      ...value,
      __uuid: uuid,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    this.documents[uuid] = document;
    return document;
  }
  public insertMany(values: Omit<T, "__uuid" | "updatedAt" | "createdAt">[]): T[] {
    return values.map((v) => (this.insertOne(v)));
  }
  public findOne(filter: Partial<T>): T | null {
    return Object.values(this.documents).find((document) => (this.matches(document, filter))) ?? null;
  }
  public find(filter?: Partial<T>): T[] {
    return Object.values(this.documents).filter((document) => (this.matches(document, filter)));
  }
  public exists(filter: Partial<T>): boolean {
    return this.findOne(filter) !== null;
  }
  public count(filter?: Partial<T>): number {
    return this.find(filter).length;
  }
  public updateOne(filter: Partial<T>, update: Partial<T>): T | null {
    const target = this.findOne(filter);
    if (!target) {
      return null;
    }
    Object.assign(target, update, { updatedAt: new Date() });
    return target;
  }
  public updateMany(filter: Partial<T>, update: Partial<T>): number {
    const documents = this.find(filter);
    documents.forEach((v) => (Object.assign(v, update, { updatedAt: new Date() })));
    return documents.length;
  }
  public deleteOne(filter: Partial<T>): boolean {
    for (const [uuid, document] of Object.entries(this.documents)) {
      if (this.matches(document, filter)) {
        delete this.documents[uuid];
        return true;
      }
    }
    return false;
  }
  public deleteMany(filter: Partial<T>): number {
    let count = 0;
    for (const [uuid, document] of Object.entries(this.documents)) {
      if (this.matches(document, filter)) {
        delete this.documents[uuid];
        count++;
      }
    }
    return count;
  }
}
