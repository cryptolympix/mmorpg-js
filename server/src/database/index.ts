import { JsonDB, Config } from "node-json-db";
import GameConfig from "../../../shared/config.json";

const saveOnPush = true;
const humanReadable = GameConfig.dev.debug;
const config = new Config("database", saveOnPush, humanReadable, "/");
const database = new JsonDB(config);

export { database };
