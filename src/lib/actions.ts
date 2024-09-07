import { Container, Task } from "../types";
import { Responder } from "./responder";
import { Storage } from "./storage";

export function actionAdd(container: Container, text: string): void {
  if (!text || !text.trim()) {
    (container["responder"] as Responder).output([`Empty text supplied`]);
    return;
  }
  let task: Task;
  try {
    task = (container["storage"] as Storage).add({
      description: text,
    });
    (container["responder"] as Responder).output([
      `Task added successfully (ID: ${task.id})`,
    ]);
  } catch (err) {
    (container["responder"] as Responder).output([
      `Database interaction failed: ${(err as Error).message}`,
    ]);
  }
}

function _update(container: Container, id: number, data: Partial<Task>) {
  let task: Task | null;
  try {
    task = (container["storage"] as Storage).get(id);
    if (!task) {
      return `Task with id ${id} not exists`;
    }
  } catch (err) {
    return `Database interaction failed: ${(err as Error).message}`;
  }

  task = { ...task, ...data };

  try {
    const result = (container["storage"] as Storage).update(task);
    if (!result) {
      return `Failed to save task ${id}`;
    }
    return `Task ${id} updated`;
  } catch (err) {
    return `Database interaction failed: ${(err as Error).message}`;
  }
}

export function actionUpdate(
  container: Container,
  id: string | undefined,
  text: string | undefined
): void {
  let parsedId = parseInt(id as string);
  if (!parsedId) {
    (container["responder"] as Responder).output([
      `Supplied ID is not a number`,
    ]);
    return;
  }

  if (!text || !text.trim()) {
    (container["responder"] as Responder).output([`Supplied text is empty`]);
    return;
  }

  (container["responder"] as Responder).output([
    _update(container, parsedId, { description: text }),
  ]);
}

export function actionDelete(container: Container, id: string): void {
  let parsedId = parseInt(id as string);
  if (!parsedId) {
    (container["responder"] as Responder).output([
      `Supplied ID is not a number`,
    ]);
    return;
  }

  try {
    const result = (container["storage"] as Storage).delete(parsedId);
    if (result) {
      (container["responder"] as Responder).output([
        `Task ${parsedId} deleted`,
      ]);
    } else {
      (container["responder"] as Responder).output([
        `Task ${parsedId} doesn't exist`,
      ]);
    }
  } catch (err) {
    (container["responder"] as Responder).output([
      `Database interaction failed: ${(err as Error).message}`,
    ]);
  }
}

export function actionMark(
  container: Container,
  id: string,
  status: Task["status"]
): void {
  let parsedId = parseInt(id as string);
  if (!parsedId) {
    (container["responder"] as Responder).output([
      `Supplied ID is not a number`,
    ]);
    return;
  }

  if (!["done", "in-progress", "todo"].includes(status)) {
    (container["responder"] as Responder).output([`Wrong status value`]);
    return;
  }

  (container["responder"] as Responder).output([
    _update(container, parsedId, { status: status }),
  ]);
}

export function actionList(
  container: Container,
  status?: Task["status"]
): void {
  if (status && !["done", "in-progress", "todo"].includes(status)) {
    (container["responder"] as Responder).output([`Wrong status value`]);
    return;
  }

  let tasks: Task[];
  try {
    tasks = (container["storage"] as Storage).getAll(status);

    const response: string[] = [];
    if (tasks && tasks.length) {
      response.push(`id\tstatus\tcreated\tupdated\tdescription`);
      tasks.forEach((t) => {
        response.push(
          `${t.id}\t${t.status}\t${t.createdAt}\t${t.updatedAt}\t${t.description}`
        );
      });
    } else {
      response.push(`No tasks`);
    }
    (container["responder"] as Responder).output(response);
  } catch (err) {
    (container["responder"] as Responder).output([
      `Database interaction failed: ${(err as Error).message}`,
    ]);
  }
}
