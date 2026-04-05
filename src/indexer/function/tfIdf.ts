/**
 *
 * @param word_occurence Le nombre d'occurence du mots sur la page
 * @param page_words_count Le nombre total de mots dans la page
 * @param docsWithWord Le nombre totals de documents contenants le mots
 * @param totalDocs le nombre total de documents enregistrés
 * @returns {number}
 *
 * @description Le TF-IDF (de l'anglais term frequency-inverse document frequency) est une méthode de pondération souvent utilisée en recherche d'information et en particulier dans la fouille de textes. Cette mesure statistique permet d'évaluer l'importance d'un terme contenu dans un document, relativement à une collection ou un corpus. Le poids augmente proportionnellement au nombre d'occurrences du mot dans le document. Il varie également en fonction de la répartition du mot dans le corpus. Des variantes de la formule originale sont souvent utilisées dans des moteurs de recherche pour apprécier la pertinence d'un document en fonction des critères de recherche de l'utilisateur. <source: WIKIPEDIA>
 */
export function tfIdf(
  word_occurence: number,
  page_words_count: number,
  docsWithWord: number,
  totalDocs: number,
): number {
  if (
    !Number.isFinite(word_occurence) ||
    !Number.isFinite(page_words_count) ||
    !Number.isFinite(docsWithWord) ||
    !Number.isFinite(totalDocs)
  ) return 0;

  if (word_occurence < 0 || page_words_count <= 0 || docsWithWord < 0 || totalDocs <= 0) return 0;

  if (docsWithWord > totalDocs) docsWithWord = totalDocs;

  // TF logarithmique — atténue l'avantage des mots très répétés
  const tf = Math.log(1 + word_occurence / page_words_count);

  // IDF 
  const idf = Math.log((totalDocs + 1) / (docsWithWord + 1)) + 1;

  const score = tf * idf;

  if (!Number.isFinite(score) || score < 0) return 0;

  return score;
}
