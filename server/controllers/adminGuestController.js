import { randomUUID } from "crypto";
import { supabase } from "../lib/supabase.js";
import { getPool } from "../services/dbPool.js";

export const createWalkInGuest = async (req, res) => {
    const { full_name, email, phone } = req.body;

    if (!full_name || !full_name.trim()) {
        return res.status(400).json({ error: "Full name is required" });
    }

    const finalEmail = email?.trim() || `walkin-${randomUUID()}@no-reply.internal`;

    try {
        let guestId;

        const pool = getPool();
        const existing = await pool.query(
            `SELECT id FROM auth.users WHERE email = $1`,
            [finalEmail]
        );

        if (existing.rows.length > 0) {
            guestId = existing.rows[0].id;
        } else {
            const { data: authData, error: authError } =
                await supabase.auth.admin.createUser({
                    email: finalEmail,
                    email_confirm: true,
                    user_metadata: { full_name, phone: phone || null, is_walk_in: true },
                });

            if (authError) throw authError;
            guestId = authData.user.id;
        }

        // Upsert instead of update — self-heals if the auth trigger never
        // created the guests row (or created it incomplete).
        const { data: guestRow, error: upsertError } = await supabase
            .from("guests")
            .upsert(
                { id: guestId, full_name, email: finalEmail, phone: phone || null },
                { onConflict: "id" }
            )
            .select()
            .single();

        if (upsertError) throw upsertError;

        return res.status(201).json({ guest: guestRow });
    } catch (err) {
        console.error("createWalkInGuest failed:", err);
        return res.status(500).json({ error: err.message || "Failed to create guest" });
    }
};