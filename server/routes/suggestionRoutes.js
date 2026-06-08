import express from 'express';
import { getRandomSuggestions } from '../services/suggestionService.js';
import { getUserRole } from '../services/userService.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try{
        const { userId } = req.query;
        const role = await getUserRole(userId);
        const suggestions = getRandomSuggestions(role);

        return res.json({
            suggestions,
        });
    }catch(error) {
        return res.status(500).json({
            error:"failed to fetch suggestions",
        });
    }
});
export default router;