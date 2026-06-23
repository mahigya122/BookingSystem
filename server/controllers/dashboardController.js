import { getDashboardStats } from "../services/dashboardService.js";

export async function getDashboard(req, res) {
    try {
        const { startDate, endDate } = req.query;
        const stats = await getDashboardStats({ startDate, endDate });
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}