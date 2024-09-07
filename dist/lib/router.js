"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = router;
const actions_1 = require("./actions");
function router(container, command, args) {
    switch (command) {
        case "add":
            (0, actions_1.actionAdd)(container, args[0]);
            break;
        case "update":
            (0, actions_1.actionUpdate)(container, args[0], args[1]);
            break;
        case "delete":
            (0, actions_1.actionDelete)(container, args[0]);
            break;
        case "mark-in-progress":
            (0, actions_1.actionMark)(container, args[0], "in-progress");
            break;
        case "mark-done":
            (0, actions_1.actionMark)(container, args[0], "done");
            break;
        case "list":
            (0, actions_1.actionList)(container, args[0]);
            break;
        default:
            container["responder"].output([`Wrong command`]);
    }
}
