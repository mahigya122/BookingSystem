import express from "express";
import {
  createBookingReservation,
  updateBookingReservation,
  patchBookingReservation,
  deleteBookingReservation,
  getAllBookings,
} from "../services/bookingService.js";

const router = express.Router();

// GET all bookings (for admin panel)
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
    const search = req.query.search || "";
    const paymentStatus = req.query.paymentStatus || "all";
    const guestEmail = req.query.guestEmail || "";

    const result = await getAllBookings(
      queryPage,
      queryPageSize,
      filter,
      sort,
      search,
      paymentStatus,
      guestEmail
    );

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
    console.error("❌ CRITICAL ERROR in GET /api/bookings:", {
      message: error.message,
      stack: error.stack,
      details: error
    });
    return res.status(500).json({
      error: error.message || "Failed to load bookings",
      debug_info: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

// POST create booking
router.post("/", async (req, res) => {
  try {
    const booking = await createBookingReservation(req.body);
    return res.status(201).json({ booking });
  } catch (error) {
    const status = error.status || 400;
    return res.status(status).json({
      error: error.message || "Failed to create booking",
    });
  }
});

// PATCH update booking status or other fields partially
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Booking id is required" });
    }
    const booking = await patchBookingReservation(id, req.body);
    return res.json({ booking });
  } catch (error) {
    const status = error.status || 400;
    return res.status(status).json({
      error: error.message || "Failed to patch booking",
    });
  }
});

// PUT update booking
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Booking id is required" });
    }
    const booking = await updateBookingReservation(id, req.body);
    return res.json({ booking });
  } catch (error) {
    const status = error.status || 400;
    return res.status(status).json({
      error: error.message || "Failed to update booking",
    });
  }
});

// DELETE booking
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Booking id is required" });
    }
    await deleteBookingReservation(id);
    return res.json({ success: true });
  } catch (error) {
    const status = error.status || 400;
    return res.status(status).json({
      error: error.message || "Failed to delete booking",
    });
  }
});

export default router;