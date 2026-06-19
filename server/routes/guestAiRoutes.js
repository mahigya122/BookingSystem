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
        const [
            { data: cabins, error: cabinError },
            { data: reviews, error: reviewError },
            { data: activities, error: activityError }
        ] = await Promise.all([
            supabase.from("cabins").select("id, name, capacity, price_per_night, description, discount"),
            supabase.from("reviews").select("cabin_id, rating"),
            supabase.from("activities").select("cabin_id, name")
        ]);

        if (cabinError || reviewError || activityError) {
            console.error("[Guest AI] Supabase Error:", cabinError || reviewError || activityError);
            throw cabinError || reviewError || activityError;
        }

        // Aggregate Ratings
        const ratingMap = (reviews || []).reduce((acc, rev) => {
            if (!acc[rev.cabin_id]) acc[rev.cabin_id] = { sum: 0, count: 0 };
            acc[rev.cabin_id].sum += rev.rating;
            acc[rev.cabin_id].count += 1;
            return acc;
        }, {});

        // Aggregate Activities
        const activityMap = (activities || []).reduce((acc, act) => {
            if (!acc[act.cabin_id]) acc[act.cabin_id] = [];
            acc[act.cabin_id].push(act.name);
            return acc;
        }, {});

        const cabinContext = cabins
            ?.slice(0, 15) // Limit to top 15 cabins to stay within token limits
            .map((cabin) => {
                const ratings = ratingMap[cabin.id];
                const avgRating = ratings ? (ratings.sum / ratings.count).toFixed(1) : "No ratings yet";
                const cabinActivities = activityMap[cabin.id] || [];
                
                // For "free breakfast", we'll check if it's in the description or assume luxury cabins (price > 500) have it
                const hasFreeBreakfast = cabin.description.toLowerCase().includes("breakfast") || cabin.price_per_night > 500;

                // Shorten description to further save tokens
                const shortDesc = cabin.description.length > 120 
                    ? cabin.description.substring(0, 120) + "..." 
                    : cabin.description;

                return `
                Cabin: ${cabin.name}, 
                Capacity: ${cabin.capacity}, 
                Price: $${cabin.price_per_night}/night, 
                Discount: ${cabin.discount}%, 
                Rating: ${avgRating} stars,
                Activities: ${cabinActivities.slice(0, 3).join(", ")},
                Breakfast: ${hasFreeBreakfast ? "Yes" : "No"},
                Desc: ${shortDesc}
                `;
            }).join("\n");

        const systemPrompt = `
You are a premium luxury hotel AI concierge for CabinHub.

Your Goal:
- Provide simple, clear, and elegant answers.
- Help guests choose cabins based on their needs.
- Provide information on booking procedures.
- Always be warm, professional, and concise.

Guidelines:
- NEVER mention internal IDs, UUIDs, or any technical strings.
- NEVER mention databases, SQL, or internal systems.
- Avoid repetitive phrasing. If you've mentioned a price, don't repeat the same logic in the same sentence.
- Keep answers focused on the guest's experience.

Key Information:
- Booking: Guests can book directly on the website by clicking the "Reserve" button on any cabin page.
- Payment: We accept all major credit cards and Google Pay.
- Breakfast: Some of our premium cabins (listed below) include a complimentary gourmet breakfast.

Available cabins and details:
${cabinContext}

Specific questions you should be ready to answer:
1. "Which is the most 5-star rated cabin?" (Refer to Average Rating)
2. "Which cabin offers the most activities?" (Refer to Activities list)
3. "Which cabin has free breakfast?" (Refer to Free Breakfast field)
4. "Which cabin is lowest in price?" (Compare price_per_night)
5. "How do I book a cabin?" (Explain the website booking process)
6. "Can Cabin X occupy Y guests?" (Check capacity)
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