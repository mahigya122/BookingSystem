import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to load activities" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("activities")
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to create activity" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("activities")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to update activity" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to delete activity" });
  }
});

export default router;
