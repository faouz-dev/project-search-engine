import mongoose, { Types } from "mongoose";
import { INDEXER_DB } from "../common/mongooseConnector.js";

const urlScoreSchema = new mongoose.Schema(
  {
    page_id: { type: Types.ObjectId, required: true },
    score: { type: Number, required: true },
  },
  { _id: false },
);

const IndexSchema = new mongoose.Schema<{
  word: string;
  urls: { link: string; score: number }[];
}>({
  word: { type: String, required: true, unique: true },
  urls: { type: [urlScoreSchema], default: [] },
});

export const IndexerModel = INDEXER_DB.model("reverse_indexes", IndexSchema);
