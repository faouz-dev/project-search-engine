# SearchHub - Moteur de Recherche Open Source

SearchHub est un moteur de recherche open source , conçu avec une architecture modulaire séparant le crawling, l'indexation et l'interface web.

## 🏗️ Architecture

Le projet est organisé en 3 modules principaux :

### 1. **Crawler** (`src/crawler/`)

Responsable du téléchargement et de l'extraction du contenu des pages web.

### 2. **Indexer** (`src/indexer/`)

Traite et indexe le contenu crawlé pour une recherche rapide.

### 3. **Web App** (`src/webapp/`)

Interface de recherche moderne avec EJS et Express.

## 📊 Algorithmes de Scoring

### **TF-IDF (Term Frequency - Inverse Document Frequency)**

L'algorithme TF-IDF est utilisé pour calculer la pertinence d'un document par rapport aux termes de recherche.

**Formule :**

```
Score = TF × IDF

TF = (Nombre d'occurrences du mot dans la page) / (Nombre total de mots dans la page)

IDF = log((Nombre total de documents) / (Nombre de documents contenant le mot))
```

**Exemple :**

- Si le mot "python" apparaît 5 fois sur une page de 500 mots : TF = 5/500 = 0.01
- Si "python" apparaît dans 100 documents sur 10 000 : IDF = log(10000/100) ≈ 2
- Score pour ce mot = 0.01 × 2 = 0.02

**Implémentation :**

```typescript
export function tfIdf(
  word_occurence: number,
  page_words_count: number,
  docsWithWord: number,
  totalDocs: number,
): number {
  const tf = word_occurence / page_words_count;
  const idf = Math.log(totalDocs + 1 / (docsWithWord + 1));
  return tf * idf;
}
```

### **PageRank**

Le PageRank est un algorithme qui mesure la popularité et l'autorité d'une page web en analysant les liens qui pointent vers elle. Plus une page reçoit de liens de pages populaires, plus son PageRank est élevé.

**Concept :**

- Si une page A a un PageRank élevé et contient un lien vers la page B, cela augmente le PageRank de B
- Le PageRank se propage à travers le réseau de liens du web
- Chaque lien transmet une part du PageRank de la page source

**Formule :**

```
PR(A) = (1 - d) / N + d × Σ(PR(B) / L(B))

Où :
- d = Damping Factor (généralement 0.85)
- N = Nombre total de pages
- B = Pages qui contiennent un lien vers A
- L(B) = Nombre de liens sortants de la page B
```

### **Score Final : TF-IDF + PageRank**

Le score final d'une page pour une requête combine :

```
Score Total = (TF-IDF × Poids IDF) + (PageRank × Poids PR)

```

## 🚀 Démarrage Rapide

### Installation

```bash
npm install
```

### Configuration

Créez un fichier `.env` :

```env
MONGODB_URI_INDEXER=mongodb://localhost:27017/indexer_db
MONGODB_URI_CRAWLER=mongodb://localhost:27017/crawler_db
PORT=3000
```

### Utilisation

**1. Crawler le web**

```bash
npm run crawl
```

**2. Indexer le contenu**

```bash
npm run index
```

**3. Démarrer l'interface web**

```bash
npm run web
```

Accédez à `http://localhost:3000`

## 🛠️ Technologie

- **Runtime** : Node.js
- **Langage** : TypeScript
- **Framework Web** : Express.js
- **Base de données** : MongoDB
- **Templating** : EJS
- **HTML Parsing** : Cheerio, JSDOM
- **Content Extraction** : Mozilla Readability
- **Robots.txt Parser** : robots-parser
- **Stopwords** : FR/EN

## 🤝 Contribution

Ce projet est open source ! Les contributions sont les bienvenues.

## 📞 Auteur

Développé par [@faouz-dev](https://github.com/faouz-dev)
