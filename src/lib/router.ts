import { Container } from "../types";
import {
  actionAdd,
  actionDelete,
  actionList,
  actionMark,
  actionUpdate,
} from "./actions";
import { Responder } from "./responder";

export function router(container: Container, command: string, args: string[]) {
  switch (command) {
    case "add":
      actionAdd(container, args[0]);
      break;
    case "update":
      actionUpdate(container, args[0], args[1]);
      break;
    case "delete":
      actionDelete(container, args[0]);
      break;
    case "mark-in-progress":
      actionMark(container, args[0], "in-progress");
      break;
    case "mark-done":
      actionMark(container, args[0], "done");
      break;
    case "list":
      actionList(container, args[0] as any);
      break;
    default:
      (container["responder"] as Responder).output([`Wrong command`]);
  }
}
