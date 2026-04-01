import { PageModel } from "../../shared/models/page.js";
import { tfIdf } from "./tfIdf.js";

// score = 0.7 * TF-IDF + 0.3 * PageRank
export function calculScore(
  word_occurence: number,
  page_words_count: number,
  docsWithWord: number,
  totalDocs: number,
  pageRank: number,
) {
  return (
    0.7 * tfIdf(word_occurence, page_words_count, docsWithWord, totalDocs) +
    0.3 * pageRank
  );
}
