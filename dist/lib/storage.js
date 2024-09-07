"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const fs_1 = __importDefault(require("fs"));
class Storage {
    constructor(filePath) {
        this.filePath = filePath;
        this.storage = {
            lastId: 0,
            tasks: [],
        };
        try {
            if (!fs_1.default.existsSync(this.filePath)) {
                this._saveStorage();
            }
            else {
                this._loadStorage();
            }
        }
        catch (err) {
            throw new Error(`File initialization failed: ${err.message}`);
        }
    }
    getLastId() {
        return this.storage.lastId;
    }
    reload() {
        this._loadStorage();
    }
    _loadStorage() {
        let plainData;
        try {
            plainData = fs_1.default.readFileSync(this.filePath).toString("utf-8");
            if (!plainData.trim())
                return;
        }
        catch (err) {
            throw new Error(`Can't read file ${this.filePath}: ${err.message}`);
        }
        let data;
        try {
            data = JSON.parse(plainData);
        }
        catch (error) {
            throw new Error(`File ${this.filePath} has invalid JSON format`);
        }
        if (!data.hasOwnProperty("lastId") || !data.hasOwnProperty("tasks")) {
            throw new Error(`File ${this.filePath} has a bad storage structure`);
        }
        this.storage = data;
    }
    _saveStorage() {
        try {
            fs_1.default.writeFileSync(this.filePath, JSON.stringify(this.storage));
        }
        catch (err) {
            throw new Error(`Can't write to file ${this.filePath}: ${err.message}`);
        }
    }
    get(id) {
        const found = this.storage.tasks.find((storedTask) => storedTask.id === id);
        return found ? Object.assign({}, found) : null;
    }
    getAll(status) {
        if (!status)
            return [...this.storage.tasks];
        return [...this.storage.tasks.filter((t) => t.status === status)];
    }
    add(task) {
        var _a;
        const add = Object.assign(Object.assign({}, task), { id: ++this.storage.lastId, status: (_a = task.status) !== null && _a !== void 0 ? _a : "todo", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        this.storage.tasks.push(add);
        this._saveStorage();
        return Object.assign({}, add);
    }
    update(task) {
        const foundIndex = this.storage.tasks.findIndex((storedTask) => storedTask.id === task.id);
        if (foundIndex === -1)
            return false;
        this.storage.tasks[foundIndex] = Object.assign(Object.assign({}, task), { updatedAt: new Date().toISOString() });
        this._saveStorage();
        return true;
    }
    delete(id) {
        const foundIndex = this.storage.tasks.findIndex((task) => task.id === id);
        if (foundIndex === -1)
            return false;
        this.storage.tasks.splice(foundIndex, 1);
        this._saveStorage();
        return true;
    }
}
exports.Storage = Storage;
