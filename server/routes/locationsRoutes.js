import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to load locations" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("locations")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to create location" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("locations")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to update location" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("locations").delete().eq("id", id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to delete location" });
  }
});

export default router;
