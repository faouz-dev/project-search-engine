import dotenv from "dotenv";

import path from "node:path";
import {
  CRAWLER_BD,
  waitForMongooseInstancesConnected,
} from "../shared/common/mongooseConnector.js";
import { crawl } from "./function/crawl.js";
dotenv.config({ path: path.join(import.meta.dirname, "../../.env") });

const startUrl = "https://fr.africanews.com";

async function main() {
  // Connect to mongoose
  await waitForMongooseInstancesConnected([CRAWLER_BD]);
  console.log("Connected to mongoose\n\nLauching Crawl");

  crawl(startUrl);
}

main();
