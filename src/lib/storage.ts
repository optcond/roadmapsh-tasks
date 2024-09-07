import fs from "fs";
import { StorageFormat, Task } from "../types";

export class Storage {
  private storage: StorageFormat = {
    lastId: 0,
    tasks: [],
  };
  constructor(private filePath: string) {
    try {
      if (!fs.existsSync(this.filePath)) {
        this._saveStorage();
      } else {
        this._loadStorage();
      }
    } catch (err) {
      throw new Error(`File initialization failed: ${(err as Error).message}`);
    }
  }

  public getLastId(): number {
    return this.storage.lastId;
  }

  public reload(): void {
    this._loadStorage();
  }

  private _loadStorage(): void {
    let plainData: string;
    try {
      plainData = fs.readFileSync(this.filePath).toString("utf-8");
      if (!plainData.trim()) return;
    } catch (err) {
      throw new Error(
        `Can't read file ${this.filePath}: ${(err as Error).message}`
      );
    }

    let data: Object;
    try {
      data = JSON.parse(plainData);
    } catch (error) {
      throw new Error(`File ${this.filePath} has invalid JSON format`);
    }

    if (!data.hasOwnProperty("lastId") || !data.hasOwnProperty("tasks")) {
      throw new Error(`File ${this.filePath} has a bad storage structure`);
    }

    this.storage = data as StorageFormat;
  }

  private _saveStorage(): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.storage));
    } catch (err) {
      throw new Error(
        `Can't write to file ${this.filePath}: ${(err as Error).message}`
      );
    }
  }

  get(id: number): Task | null {
    const found = this.storage.tasks.find((storedTask) => storedTask.id === id);
    return found ? { ...found } : null;
  }

  getAll(status?: Task["status"]): Task[] {
    if (!status) return [...this.storage.tasks];

    return [...this.storage.tasks.filter((t) => t.status === status)];
  }

  add(task: Partial<Task>): Task {
    const add = {
      ...task,
      id: ++this.storage.lastId,
      status: task.status ?? "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Task;
    this.storage.tasks.push(add);
    this._saveStorage();
    return { ...(add as Task) };
  }
  update(task: Task): boolean {
    const foundIndex = this.storage.tasks.findIndex(
      (storedTask) => storedTask.id === task.id
    );
    if (foundIndex === -1) return false;

    this.storage.tasks[foundIndex] = {
      ...task,
      updatedAt: new Date().toISOString(),
    };
    this._saveStorage();
    return true;
  }
  delete(id: number): boolean {
    const foundIndex = this.storage.tasks.findIndex((task) => task.id === id);
    if (foundIndex === -1) return false;

    this.storage.tasks.splice(foundIndex, 1);
    this._saveStorage();
    return true;
  }
}
