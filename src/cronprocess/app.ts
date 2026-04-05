import express from "express";
import { globalWebSiteRanking } from "../indexer/function/pageRanking.js";
import { startIndexing } from "../indexer/function/startIndexing.js";
import {
  CRAWLER_BD,
  INDEXER_DB,
  waitForMongooseInstancesConnected,
} from "../shared/common/mongooseConnector.js";
import { crawl } from "../crawler/function/crawl.js";

const app = express();
let indexing = false;

app.get("/health", (rq, res) => res.send("i'm alive"));

app.get("/index", async (_, res) => {
  if (indexing) return res.send("a indexing process already active");
  res.send("starting indexing");
  indexing = true;
  await globalWebSiteRanking(20);
  await startIndexing();
  indexing = false;
});

async function main() {
  await waitForMongooseInstancesConnected([CRAWLER_BD, INDEXER_DB]);
  app.listen(process.env.PORT || 3000, () => console.log("App started"));

  crawl("https://fr.africanews.com");
}
main();
export default app;
