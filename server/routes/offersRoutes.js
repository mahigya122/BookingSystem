import express from "express";
import {
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
} from "../services/offerService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    const page = req.query.page ? Number(req.query.page) : undefined;
    const pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;
    
    let queryPage = page;
    let queryPageSize = pageSize;
    
    if (limit !== undefined && offset !== undefined) {
      queryPageSize = limit;
      queryPage = Math.floor(offset / limit) + 1;
    }

    const search = req.query.search || "";

    const result = await getAllOffers(queryPage, queryPageSize, search);

    const data = result.data !== undefined ? result.data : result;
    const count = result.count !== undefined ? result.count : data.length;
    const responseLimit = queryPageSize || limit || data.length;
    const responseOffset = queryPage && queryPageSize ? (queryPage - 1) * queryPageSize : offset || 0;

    return res.json({
      data,
      count,
      limit: responseLimit,
      offset: responseOffset
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to load offers" });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = await createOffer(req.body);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to create offer" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await updateOffer(id, req.body);
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to update offer" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteOffer(id);
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to delete offer" });
  }
});

export default router;
