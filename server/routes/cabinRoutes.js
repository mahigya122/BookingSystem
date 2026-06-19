import express from "express";
import { getCabinAvailability } from "../services/bookingService.js";
import { createCabin, deleteCabin, getAllCabins, getCabinById, updateCabin } from "../services/cabinService.js";

const router = express.Router();

// GET all cabins
router.get("/", async (req, res) => {
  try {
    const cabins = await getAllCabins();
    return res.json(cabins);
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
