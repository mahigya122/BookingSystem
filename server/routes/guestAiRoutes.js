import express from "express";
import { supabase } from "../lib/supabase.js";
import { generateChatReply } from "../services/aiService.js";
import {
    getOrCreateConversation,
    getLatestConversation,
    saveMessage,
    getMessages,
} from "../services/chatHistoryService.js";

const router = express.Router();

router.get("/conversation/latest", async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId || userId === "anonymous") {
            return res.json({ conversationId: null, history: [] });
        }

        const conversation = await getLatestConversation(userId);

        if (!conversation) {
            return res.json({ conversationId: null, history: [] });
        }

        const history = await getMessages(conversation.id);

        return res.json({
            conversationId: conversation.id,
            history,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err.message || "Failed to load conversation history",
        });
    }
});

router.post("/chat", async (req, res) => {
    try {
        const { message, userId, conversationId, history: clientHistory } = req.body;
        console.log(`[Guest AI] Received message: ${message} (User: ${userId || "anonymous"})`);

        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        // REAL-TIME CABIN DATA
        console.log("[Guest AI] Fetching cabins from Supabase...");
        const { data: cabins, error } = await supabase
            .from("cabins")
            .select(`
        name,
        capacity,
        price_per_night,
        description,
        discount
      `);

        if (error) {
            console.error("[Guest AI] Supabase Error:", error);
            throw error;
        }

        const cabinContext = cabins
            ?.map(
                (cabin) => `
                Cabin: ${cabin.name}, 
                Capacity: ${cabin.capacity}, 
                Price: ${cabin.price_per_night}, 
                Discount: ${cabin.discount}, 
                Description: ${cabin.description}
                `
            ).join("\n");

        const systemPrompt = `
You are a premium luxury hotel AI concierge.

Your job:
- Help guests choose cabins
- Answer booking questions
- Recommend cabins
- Explain prices and discounts
- Be warm, luxurious, modern, and concise

Never mention SQL or databases.

Available cabins:
${cabinContext}
          `;

        let cid = conversationId;
        let history = [];

        // If logged in, handle persistence
        if (userId && userId !== "anonymous") {
            const conversation = cid 
                ? { id: cid } 
                : await getOrCreateConversation(userId);
            cid = conversation.id;
            
            // Save user message
            await saveMessage(cid, "user", message);
            
            // Get history for context
            const prevMessages = await getMessages(cid);
            history = prevMessages.map(m => ({ role: m.role, content: m.content }));
        } else {
            // PUBLIC CONCIERGE: Use client-provided history
            if (Array.isArray(clientHistory) && clientHistory.length > 0) {
                history = clientHistory;
            } else {
                history = [{ role: "user", content: message }];
            }
        }

        console.log("[Guest AI] Requesting completion from AI service...");
        const { reply } = await generateChatReply({
            messages: history,
            systemPrompt,
            temperature: 0.7
        });

        // If logged in, save assistant reply
        if (cid && userId && userId !== "anonymous") {
            await saveMessage(cid, "assistant", reply);
            // Refresh history to include assistant reply
            history = await getMessages(cid);
        } else {
            // For public users, update history with reply before returning
            history.push({ role: "assistant", content: reply });
        }

        return res.json({
            reply,
            conversationId: cid,
            history: history.length > 0 ? history : undefined
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: err.message || "Failed to process AI request",
        });
    }
});

export default router;