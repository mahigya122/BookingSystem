import express from "express";
import { getCabinAvailability } from "../services/bookingService.js";
import { createCabin, deleteCabin, getAllCabins, getCabinById, updateCabin } from "../services/cabinService.js";

const router = express.Router();

// GET all cabins
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

    const filter = req.query.filter || "all";
    const sort = req.query.sort || "recent";
    const locationId = req.query.locationId || undefined;
    const activityId = req.query.activityId || undefined;
    const offerId = req.query.offerId || undefined;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
    const capacity = req.query.capacity ? Number(req.query.capacity) : undefined;
    const startDate = req.query.startDate || undefined;
    const endDate = req.query.endDate || undefined;

    const result = await getAllCabins({
      page: queryPage,
      pageSize: queryPageSize,
      filter,
      sort,
      locationId,
      activityId,
      offerId,
      minPrice,
      maxPrice,
      capacity,
      startDate,
      endDate
    });

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
    return res.status(500).json({
      error: error.message || "Failed to load cabins",
    });
  }
});

// GET single cabin details
router.get("/:cabinId", async (req, res) => {
  try {
    const { cabinId } = req.params;
    if (!cabinId) {
      return res.status(400).json({ error: "Cabin id is required" });
    }

    const cabin = await getCabinById(cabinId);

    if (!cabin) {
      return res.status(404).json({ error: "Cabin not found" });
    }

    return res.json(cabin);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Failed to load cabin details",
    });
  }
});

// CREATE cabin
router.post("/", async (req, res) => {
  try {
    const cabin = await createCabin(req.body);
    return res.status(201).json(cabin);
  } catch (error) {
    return res.status(400).json({
      error: error.message || "Failed to create cabin",
    });
  }
});

// UPDATE cabin
router.patch("/:cabinId", async (req, res) => {
  try {
    const { cabinId } = req.params;
    if (!cabinId) {
      return res.status(400).json({ error: "Cabin id is required" });
    }

    const cabin = await updateCabin(cabinId, req.body);
    return res.json(cabin);
  } catch (error) {
    return res.status(400).json({
      error: error.message || "Failed to update cabin",
    });
  }
});

// DELETE cabin
router.delete("/:cabinId", async (req, res) => {
  try {
    const { cabinId } = req.params;
    if (!cabinId) {
      return res.status(400).json({ error: "Cabin id is required" });
    }

    await deleteCabin(cabinId);
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({
      error: error.message || "Failed to delete cabin",
    });
  }
});

// GET cabin availability
router.get("/:cabinId/availability", async (req, res) => {
  try {
    const { cabinId } = req.params;

    if (!cabinId) {
      return res.status(400).json({ error: "Cabin id is required" });
    }

    const availability = await getCabinAvailability(cabinId);
    return res.json(availability);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Failed to load cabin availability",
    });
  }
});

export default router;
