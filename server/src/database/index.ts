import { JsonDB, Config } from "node-json-db";

import { HeroSchema } from "../../../shared/database.schemas";

const saveOnPush = true;
const humanReadable = true;
const config = new Config("database", saveOnPush, humanReadable, "/");
const database = new JsonDB(config);

export { database, HeroSchema };
