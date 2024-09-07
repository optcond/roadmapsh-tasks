"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responder_1 = require("./lib/responder");
const router_1 = require("./lib/router");
const storage_1 = require("./lib/storage");
const storage = new storage_1.Storage("tasks-storage");
const responder = new responder_1.Responder();
const main = () => {
    const container = {
        storage,
        responder,
    };
    const args = process.argv.slice(2);
    (0, router_1.router)(container, args[0], args.slice(1));
};
main();
