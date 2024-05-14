import { env } from "./env";
import { createServer } from "./server";
import { log } from "@repo/logger";

const port = env.api.port;
const server = createServer();

server.listen(port, () => {
  log(`api running on ${port}`);
});
