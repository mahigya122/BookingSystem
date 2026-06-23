import express from "express";
import {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../services/locationService.js";

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
    const sort = req.query.sort || "name-az";

    const result = await getAllLocations(queryPage, queryPageSize, search, sort);

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
    return res.status(500).json({ error: error.message || "Failed to load locations" });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = await createLocation(req.body);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to create location" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await updateLocation(id, req.body);
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to update location" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await deleteLocation(id);
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to delete location" });
  }
});

export default router;
