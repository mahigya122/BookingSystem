import express from "express";
import { createWalkInGuest } from "../controllers/adminGuestController.js";
import { requireAdmin } from "../services/requireAdmin.js";

const router = express.Router();
router.post("/", requireAdmin, createWalkInGuest);

export default router;