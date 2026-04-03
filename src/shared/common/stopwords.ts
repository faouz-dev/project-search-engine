import { fra, eng, spa, jpn } from "stopword";

export const STOPWORDS = [...new Set([...fra, ...eng, ...spa, ...jpn])];
