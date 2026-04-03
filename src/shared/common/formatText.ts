export function formatText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD") // é → e + ́
    .replace(/[\u0300-\u036f]/g, "") // supprime les diacritiques
    .replace(/['`’]/g, " ") // remplacer les trais d'unions par des espaces
    .replace(/[-]/g, " ") // Supprimer la ponctuation
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/[^a-z0-9\s]/g, "") // garde lettres simples + chiffres
    .replace(/\s+/g, " ")
    .trim();
}
