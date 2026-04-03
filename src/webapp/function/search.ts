import { removeStopwords, fra, eng } from "stopword";
import { IndexerModel } from "../../shared/models/index.js";
import { PageModel } from "../../shared/models/page.js";
import { PageContentModel } from "../../shared/models/pageContent.js";
import { formatText } from "../../shared/common/formatText.js";
import { STOPWORDS } from "../../shared/common/stopwords.js";

export async function query(q: string) {
  // Tokenisation et nettoyage
  const searchArray = formatText(q).split(/\s+/);

  if (searchArray.length === 0) throw Error("No search input");

  const tokens = removeStopwords(searchArray, STOPWORDS);

  if (tokens.length === 0) return null;

  // Récupération des index
  const indexResults = await IndexerModel.find({
    word: { $in: tokens },
  }).lean();

  if (indexResults.length === 0) return { success: false };

  const allPageIds = [
    ...new Set(
      indexResults.flatMap((r) => r.urls.map((u) => u.page_id.toString())),
    ),
  ];

  const pages = await PageModel.find({
    _id: { $in: allPageIds },
  }).lean();

  const contents = await PageContentModel.find({
    page_id: { $in: allPageIds.map((p) => p.toString()) },
  }).lean();

  const pagesMap = new Map(pages.map((page) => [page._id.toString(), page]));

  const contentsMap = new Map(
    contents.map((content) => [content.page_id.toString(), content]),
  );

  const webPageMap = new Map();

  for (const indexResult of indexResults) {
    for (const { page_id, score } of indexResult.urls) {
      const page = pagesMap.get(page_id.toString());
      if (!page) continue;

      const existing = webPageMap.get(page_id.toString());

      if (existing) {
        // Additionner les scores si la page apparaît pour plusieurs mots
        existing.score += score;
      } else {
        const content = contentsMap.get(page_id.toString());

        webPageMap.set(page_id.toString(), {
          url: page.url,
          title: page.title ?? undefined,
          meta_description: content?.meta_description ?? undefined,
          content_part: content?.clean_text?.slice(0, 300) ?? undefined,
          score: score,
        });
      }
    }
  }

  const results = Array.from(webPageMap.values()).sort(
    (a, b) => b.score - a.score,
  );

  return {
    success: true,
    count: results.length,
    results,
  };
}
