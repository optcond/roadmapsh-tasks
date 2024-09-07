"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionAdd = actionAdd;
exports.actionUpdate = actionUpdate;
exports.actionDelete = actionDelete;
exports.actionMark = actionMark;
exports.actionList = actionList;
function actionAdd(container, text) {
    if (!text || !text.trim()) {
        container["responder"].output([`Empty text supplied`]);
        return;
    }
    let task;
    try {
        task = container["storage"].add({
            description: text,
        });
        container["responder"].output([
            `Task added successfully (ID: ${task.id})`,
        ]);
    }
    catch (err) {
        container["responder"].output([
            `Database interaction failed: ${err.message}`,
        ]);
    }
}
function _update(container, id, data) {
    let task;
    try {
        task = container["storage"].get(id);
        if (!task) {
            return `Task with id ${id} not exists`;
        }
    }
    catch (err) {
        return `Database interaction failed: ${err.message}`;
    }
    task = Object.assign(Object.assign({}, task), data);
    try {
        const result = container["storage"].update(task);
        if (!result) {
            return `Failed to save task ${id}`;
        }
        return `Task ${id} updated`;
    }
    catch (err) {
        return `Database interaction failed: ${err.message}`;
    }
}
function actionUpdate(container, id, text) {
    let parsedId = parseInt(id);
    if (!parsedId) {
        container["responder"].output([
            `Supplied ID is not a number`,
        ]);
        return;
    }
    if (!text || !text.trim()) {
        container["responder"].output([`Supplied text is empty`]);
        return;
    }
    container["responder"].output([
        _update(container, parsedId, { description: text }),
    ]);
}
function actionDelete(container, id) {
    let parsedId = parseInt(id);
    if (!parsedId) {
        container["responder"].output([
            `Supplied ID is not a number`,
        ]);
        return;
    }
    try {
        const result = container["storage"].delete(parsedId);
        if (result) {
            container["responder"].output([
                `Task ${parsedId} deleted`,
            ]);
        }
        else {
            container["responder"].output([
                `Task ${parsedId} doesn't exist`,
            ]);
        }
    }
    catch (err) {
        container["responder"].output([
            `Database interaction failed: ${err.message}`,
        ]);
    }
}
function actionMark(container, id, status) {
    let parsedId = parseInt(id);
    if (!parsedId) {
        container["responder"].output([
            `Supplied ID is not a number`,
        ]);
        return;
    }
    if (!["done", "in-progress", "todo"].includes(status)) {
        container["responder"].output([`Wrong status value`]);
        return;
    }
    container["responder"].output([
        _update(container, parsedId, { status: status }),
    ]);
}
function actionList(container, status) {
    if (status && !["done", "in-progress", "todo"].includes(status)) {
        container["responder"].output([`Wrong status value`]);
        return;
    }
    let tasks;
    try {
        tasks = container["storage"].getAll(status);
        const response = [];
        if (tasks && tasks.length) {
            response.push(`id\tstatus\tcreated\tupdated\tdescription`);
            tasks.forEach((t) => {
                response.push(`${t.id}\t${t.status}\t${t.createdAt}\t${t.updatedAt}\t${t.description}`);
            });
        }
        else {
            response.push(`No tasks`);
        }
        container["responder"].output(response);
    }
    catch (err) {
        container["responder"].output([
            `Database interaction failed: ${err.message}`,
        ]);
    }
}
