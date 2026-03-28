import mongoose from "mongoose";
import { INDEXER_DB } from "../common/mongooseConnector.js";

const IndexSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true },
  urls: { type: [{ link: String, scrore: Number }], default: [] },
});


export const IndexerModel = INDEXER_DB.model("reverse_indexes", IndexSchema);
