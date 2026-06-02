import express from "express";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const getGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;
    return new Groq({ apiKey });
};

const getSupabaseClient = () => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) return null;
    return createClient(url, key);
};

router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        console.log(`[Guest AI] Received message: ${message}`);

        if (!message) {
            return res.status(400).json({
                error: "Message is required"
            });
        }

        const groq = getGroqClient();
        const supabase = getSupabaseClient();

        if (!groq || !supabase) {
            console.error("[Guest AI] Configuration missing");
            return res.status(503).json({
                error: "AI service is currently unavailable (Configuration missing)"
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

        console.log(`[Guest AI] Found ${cabins?.length || 0} cabins`);

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

        console.log("[Guest AI] Requesting completion from Groq...");
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Use a valid supported model
            temperature: 0.7,
            messages: [
                {
                    role: "system",
                    content: `
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
          `,
                },
                {
                    role: "user",
                    content: message,

                },
            ],
        });

        const reply =
            completion.choices?.[0]?.message?.content ||
            "Sorry, I could not generate a response.";

        return res.json({
            reply,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: err.message || "Failed to process AI request",
        });
    }
});

export default router;