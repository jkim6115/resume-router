import { closeSync, openSync } from "node:fs";

closeSync(openSync("prisma/test.db", "a"));
