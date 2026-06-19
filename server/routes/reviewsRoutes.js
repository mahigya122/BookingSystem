import express from "express";
import { supabase } from "../lib/supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { approved } = req.query;
    
    let query = supabase
      .from("reviews")
      .select(`
        *,
        guest:guests (full_name),
        cabin:cabins (name)
      `)
      .order("created_at", { ascending: false });

    if (approved === "true") {
      query = query.eq("is_approved", true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to load reviews" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { cabin_id, guest_id, rating, comment } = req.body;
    const { data, error } = await supabase
      .from("reviews")
      .insert([
        { 
          cabin_id, 
          guest_id, 
          rating, 
          comment,
          is_moderated: false,
          is_approved: false
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to create review" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("reviews")
      .update(req.body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return res.json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to update review" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Failed to delete review" });
  }
});

export default router;
