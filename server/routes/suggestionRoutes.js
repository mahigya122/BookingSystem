import express from 'express';
import { getRandomSuggestions } from '../services/suggestionService.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try{
        const suggestions = getRandomSuggestions();

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