import type { Request, Response } from "express";
import { query as searchQuery } from "../function/search.js";

export async function query(req: Request, res: Response) {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || typeof q !== "string") {
      return res.render("search", {
        query: "",
        results: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        error: "Query parameter 'q' is required and must be a string",
      });
    }

    const currentPage = parseInt(page as string, 10) || 1;
    const itemsPerPage = parseInt(limit as string, 10) || 10;

    const searchResult = await searchQuery(q);

    if (!searchResult || !searchResult.success) {
      return res.render("search", {
        query: q,
        results: [],
        total: 0,
        totalPages: 0,
        currentPage,
        error: searchResult ? "No results found" : "Search failed",
      });
    }

    const allResults = searchResult.results;
    const total = allResults!.length;
    const totalPages = Math.ceil(total / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const results = allResults!.slice(startIndex, endIndex);

    return res.render("search", {
      query: q,
      results,
      total,
      totalPages,
      currentPage,
      error: null,
    });
  } catch (error) {
    console.error("Search query error:", error);
    return res.render("search", {
      query: req.query.q || "",
      results: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
      error: "Internal server error",
    });
  }
}
