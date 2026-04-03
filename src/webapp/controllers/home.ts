import type { Response, Request } from "express";
import { getScrappedPagesCount } from "../function/getScrappedPagesCount.js";

export async function home(req: Request, res: Response) {
  const pagesCount = await getScrappedPagesCount();
  return res.render("home", { pagesCount: pagesCount });
}
