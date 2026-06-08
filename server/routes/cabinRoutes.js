import express from "express";
import { getCabinAvailability } from "../services/bookingService.js";
import { getCabinById } from "../services/cabinService.js";

const router = express.Router();

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