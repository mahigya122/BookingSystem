import express from 'express';
import { getRandomSuggestions } from '../services/suggestionService.js';
import { getUserRole } from '../services/userService.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try{
        const { userId, role: queryRole } = req.query;
        
        // If a specific role is requested (e.g. from the Guest Chat), use it.
        // Otherwise, fallback to the user's account role.
        let role = queryRole;
        if (!role) {
            role = await getUserRole(userId);
        }
        
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