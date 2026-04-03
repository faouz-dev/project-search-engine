import { PageModel } from "../../shared/models/page.js";

export async function getScrappedPagesCount() {
  try {
    return await PageModel.countDocuments();
  } catch (error) {
    return 0;
  }
}
