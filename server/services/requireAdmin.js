import { supabase } from "../lib/supabase.js";
import { getUserRole } from "../services/userService.js";

export const requireAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing authorization token" });
    }

    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
        return res.status(401).json({ error: "Invalid or expired session" });
    }

    const role = await getUserRole(data.user.id);
    if (role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
    }

    req.adminUser = data.user;
    next();
};