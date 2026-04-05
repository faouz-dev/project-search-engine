import type { Types } from "mongoose";
import { CrawlQueueWebSiteModel } from "../../shared/models/crawl_queue_websites.js";
import { env } from "process";
import { PolitnessCrawl } from "./PolitnessCrawl.js";
import { LinkModel } from "../../shared/models/links.js";
import { PageModel } from "../../shared/models/page.js";
import { PageContentModel } from "../../shared/models/pageContent.js";
import { fetcher } from "./fetcher.js";

let active_crawling_process: number = 0;
const cached_queue = new Map<
  string,
  { url: string; discover_from: Types.ObjectId[] }
>();

export async function crawl(startUrl: string) {
  if (cached_queue.size == 0) {
    const db_queue = await CrawlQueueWebSiteModel.find()
      .sort({ reference_count: -1 })
      .limit(100);
    // Save the chached_queue
    if (db_queue.length > 0) {
      db_queue.forEach((website) => {
        cached_queue.set(website.url, {
          url: website.url,
          discover_from: website.discovered_from,
        });
      });

      // Delete from database
      await CrawlQueueWebSiteModel.deleteMany({
        _id: { $in: db_queue.map((q) => q._id) },
      });

      // Relancement de l'instance
      return crawl(startUrl);
    }
  }

  // Check if reached multipleCrawlLimit
  if (active_crawling_process >= parseInt(env.MAX_SYNC_CRWAL as string)) return;

  const urlToScrapp =
    cached_queue.size > 0
      ? PolitnessCrawl.getOldest(Array.from(cached_queue.keys()))
      : startUrl;

  try {
    // Add starting crawl
    active_crawling_process++;

    const urlToScrapMapObject = cached_queue.get(urlToScrapp);
    cached_queue.delete(urlToScrapp);
    // Check if scrapped url
    const scrappedUrl = await PageModel.findOne({ url: urlToScrapp });
    if (scrappedUrl) {
      if (!urlToScrapMapObject) return;
      // Savelinks
      return await LinkModel.bulkWrite(
        urlToScrapMapObject.discover_from.map((url) => ({
          updateOne: {
            filter: { source_page_id: url, target_page_id: scrappedUrl._id },
            update: {
              $setOnInsert: {
                source_page_id: url,
                target_page_id: scrappedUrl._id,
              },
            },
            upsert: true,
          },
        })),
      );
    }

    const response = await fetcher(urlToScrapp);
    // Save page data
    const page = await PageModel.create({
      url: urlToScrapp,
      title: response.title,
      domain: response.domain,
    });

    await PageContentModel.create({
      page_id: page._id,
      clean_text: response.content,
      meta_description: response.meta_description,
      word_count: response.word_Count,
    });

    // Write Link if exist
    if (urlToScrapMapObject) {
      await LinkModel.bulkWrite(
        urlToScrapMapObject.discover_from.map((id) => ({
          updateOne: {
            filter: { source_page_id: id, target_page_id: page._id },
            update: {
              $setOnInsert: {
                source_page_id: id,
                target_page_id: page._id,
              },
            },
            upsert: true,
          },
        })),
      );
    }

    // Insert new URLs to Queue
    await CrawlQueueWebSiteModel.bulkWrite(
      response.urls.map((url) => ({
        updateOne: {
          filter: { url },
          update: {
            $setOnInsert: {
              url: url,
            },
            $addToSet: { discovered_from: page._id },
            $inc: { reference_count: 1 },
          },
          upsert: true,
        },
      })),
    );
    // console.log("Url crawled : " + urlToScrapp);
  } catch (error) {
    console.error(
      "Failed to get url : " +
        urlToScrapp +
        " reason : " +
        (error as Error).message,
    );
  } finally {
    // Remove ended crawl
    active_crawling_process--;
    setImmediate(() => crawl(startUrl)); // ← appelle sans empiler la stack
  }
}
