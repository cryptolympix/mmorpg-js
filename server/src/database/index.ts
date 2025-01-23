import { JsonDB, Config } from "node-json-db";

import HeroSchema from "./schemas/hero.schemas";

const database = new JsonDB(new Config("database", true, false, "/"));

export { database, HeroSchema };
