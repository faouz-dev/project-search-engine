import express from "express";
import path from "path";
import {
  CRAWLER_BD,
  INDEXER_DB,
  waitForMongooseInstancesConnected,
} from "../shared/common/mongooseConnector.js";
import { query } from "./controllers/query.js";

const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "webapp", "views"));

async function main() {
  await waitForMongooseInstancesConnected([INDEXER_DB, CRAWLER_BD]);
  console.log("mongoose connected");

  app.get("/", (req, res) => {
    res.render("home");
  });

  app.get("/search", query);

  app.listen(process.env.PORT ?? 3000, () => {
    console.log("Web app started");
  });
}

main();
export default app;
