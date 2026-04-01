import mongoose, { Types } from "mongoose";
import { CRAWLER_BD } from "../common/mongooseConnector.js";

const pageContentSchema = new mongoose.Schema({
  page_id: { type: Types.ObjectId, ref: "pages", unique: true, required: true },
  clean_text: { type: String },
  meta_description: { type: String },
  word_count: { type: Number, required: true },
});

export const PageContentModel = CRAWLER_BD.model(
  "pages_contents",
  pageContentSchema,
);
