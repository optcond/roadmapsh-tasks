export interface Task {
  id: number;
  description: string;
  status: "todo" | "in-progress" | "done";
  createdAt: string;
  updatedAt: string;
}

export interface StorageFormat {
  lastId: number;
  tasks: Task[];
}

export interface Container {
  [key: string]: Object;
}
