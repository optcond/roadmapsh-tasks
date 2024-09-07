import { Responder } from "./lib/responder";
import { router } from "./lib/router";
import { Storage } from "./lib/storage";
import { Container } from "./types";

const storage = new Storage("tasks-storage");
const responder = new Responder();

const main = () => {
  const container: Container = {
    storage,
    responder,
  };
  const args = process.argv.slice(2);
  router(container, args[0], args.slice(1));
};

main();
