import express from "express";
import { supabase } from "../lib/supabase.js";
import { generateChatReply } from "../services/aiService.js";
import {
    getOrCreateConversation,
    getLatestConversation,
    saveMessage,
    getMessages,
} from "../services/chatHistoryService.js";

async function getBookingsContext(userId, message, history) {
    try {
        let targetGuestId = null;
        let targetEmail = null;
        let targetBookingId = null;

        if (userId && userId !== "anonymous") {
            targetGuestId = userId;
        }

        // Try to extract potential email, guest ID (UUID) or booking ID (UUID) from the message and history
        const allTexts = [message, ...((history || []).map(h => h.content))].join(" ");
        
        // UUID regex: matches 8-4-4-4-12 hex format
        const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

        const uuidMatches = allTexts.match(uuidRegex);
        const emailMatches = allTexts.match(emailRegex);

        let guestBookings = [];
        let guestInfo = null;
        let specificBooking = null;

        // 1. If we found a UUID, it could be a guest_id or a booking_id. Let's query both.
        if (uuidMatches) {
            for (const uuid of uuidMatches) {
                // Check if it's a guest_id in the guests table
                const { data: guestData } = await supabase
                    .from("guests")
                    .select("id, full_name, email, phone")
                    .eq("id", uuid);
                
                if (guestData && guestData.length > 0) {
                    guestInfo = guestData[0];
                    targetGuestId = guestInfo.id;
                } else {
                    // Check if it's a booking_id in the bookings table
                    const { data: bookingData } = await supabase
                        .from("bookings")
                        .select(`
                            id,
                            start_date,
                            end_date,
                            status,
                            total_price,
                            has_breakfast,
                            payment_status,
                            payment_method,
                            created_at,
                            guests (id, full_name, email, phone),
                            cabins (name)
                        `)
                        .eq("id", uuid);
                    
                    if (bookingData && bookingData.length > 0) {
                        specificBooking = bookingData[0];
                        if (specificBooking.guests) {
                            guestInfo = specificBooking.guests;
                            targetGuestId = guestInfo.id;
                        }
                    }
                }
            }
        }

        // 2. If we found an email, query guest by email
        if (emailMatches && !guestInfo) {
            for (const email of emailMatches) {
                const { data: guestData } = await supabase
                    .from("guests")
                    .select("id, full_name, email, phone")
                    .ilike("email", email.trim());
                
                if (guestData && guestData.length > 0) {
                    guestInfo = guestData[0];
                    targetGuestId = guestInfo.id;
                    break;
                }
            }
        }

        // 3. If we have a targetGuestId, fetch all their bookings
        if (targetGuestId) {
            const { data: bookingsData } = await supabase
                .from("bookings")
                .select(`
                    id,
                    start_date,
                    end_date,
                    status,
                    total_price,
                    has_breakfast,
                    payment_status,
                    payment_method,
                    created_at,
                    cabins (name)
                `)
                .eq("guest_id", targetGuestId)
                .order("start_date", { ascending: true });
            
            if (bookingsData) {
                guestBookings = bookingsData;
            }

            // Also fetch guest info if we don't have it yet
            if (!guestInfo) {
                const { data: guestData } = await supabase
                    .from("guests")
                    .select("id, full_name, email, phone")
                    .eq("id", targetGuestId);
                if (guestData && guestData.length > 0) {
                    guestInfo = guestData[0];
                } else {
                    // Try profiles table (e.g. for recently registered users with no bookings yet)
                    const { data: profileData } = await supabase
                        .from("profiles")
                        .select("id, email, full_name, phone_no")
                        .eq("id", targetGuestId)
                        .maybeSingle();
                    if (profileData) {
                        guestInfo = {
                            id: profileData.id,
                            full_name: profileData.full_name,
                            email: profileData.email,
                            phone: profileData.phone_no
                        };
                    }
                }
            }
        }

        // Build context string
        let contextStr = "";
        if (guestInfo) {
            contextStr += `Guest Profile:\n`;
            contextStr += `- Client/Guest ID: ${guestInfo.id}\n`;
            contextStr += `- Name: ${guestInfo.full_name || "Guest"}\n`;
            contextStr += `- Email: ${guestInfo.email}\n`;
            contextStr += `- Phone: ${guestInfo.phone || "N/A"}\n\n`;
        }

        if (guestBookings && guestBookings.length > 0) {
            contextStr += `Guest Bookings:\n`;
            guestBookings.forEach((b, index) => {
                const cabinName = b.cabins ? b.cabins.name : "Unknown Cabin";
                contextStr += `${index + 1}. Cabin: ${cabinName}
   Start Date: ${b.start_date}
   End Date: ${b.end_date}
   Status: ${b.status}
   Total Price: $${b.total_price}
   Payment Status: ${b.payment_status}
   Payment Method: ${b.payment_method}
   Breakfast Included: ${b.has_breakfast ? "Yes" : "No"}
   Created At: ${b.created_at}
   Booking ID: ${b.id}\n`;
            });
        } else if (specificBooking) {
            const cabinName = specificBooking.cabins ? specificBooking.cabins.name : "Unknown Cabin";
            contextStr += `Specific Booking Found:\n`;
            contextStr += `- Cabin: ${cabinName}
- Start Date: ${specificBooking.start_date}
- End Date: ${specificBooking.end_date}
- Status: ${specificBooking.status}
- Total Price: $${specificBooking.total_price}
- Payment Status: ${specificBooking.payment_status}
- Payment Method: ${specificBooking.payment_method}
- Breakfast Included: ${specificBooking.has_breakfast ? "Yes" : "No"}
- Created At: ${specificBooking.created_at}
- Booking ID: ${specificBooking.id}\n`;
        } else if (guestInfo) {
            contextStr += `Guest Bookings: None. This guest has not made any reservations yet.\n`;
        }

        return contextStr;
    } catch (e) {
        console.error("Error generating bookings context for guest AI chat:", e);
        return "";
    }
}

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

        // REAL-TIME CABIN DATA (Including Bookings to track occupancy levels)
        console.log("[Guest AI] Fetching cabins and bookings from Supabase...");
        const [
            { data: cabins, error: cabinError },
            { data: reviews, error: reviewError },
            { data: activities, error: activityError },
            { data: bookings, error: bookingsError }
        ] = await Promise.all([
            supabase.from("cabins").select("id, name, capacity, price_per_night, description, discount"),
            supabase.from("reviews").select("cabin_id, rating"),
            supabase.from("activities").select("cabin_id, name"),
            supabase.from("bookings").select("cabin_id, start_date, end_date, status").in("status", ["booked", "checked-in"])
        ]);

        if (cabinError || reviewError || activityError || bookingsError) {
            console.error("[Guest AI] Supabase Error:", cabinError || reviewError || activityError || bookingsError);
            throw cabinError || reviewError || activityError || bookingsError;
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

        // Aggregate Cabin Bookings
        const bookingsMap = (bookings || []).reduce((acc, b) => {
            if (!acc[b.cabin_id]) acc[b.cabin_id] = [];
            acc[b.cabin_id].push(b);
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

                // Occupancy levels
                const cabinBookings = bookingsMap[cabin.id] || [];
                const activeBookingsCount = cabinBookings.length;
                let occupancyLevel = "Low";
                if (activeBookingsCount >= 4) occupancyLevel = "Very High (Fully Booked/Packed)";
                else if (activeBookingsCount >= 2) occupancyLevel = "High / Popular";
                else if (activeBookingsCount >= 1) occupancyLevel = "Moderate";

                const occupiedRanges = cabinBookings
                    .map(b => `${b.start_date} to ${b.end_date}`)
                    .slice(0, 3)
                    .join(", ");

                return `
                Cabin: ${cabin.name}, 
                Capacity: ${cabin.capacity}, 
                Price: $${cabin.price_per_night}/night, 
                Discount: ${cabin.discount}%, 
                Rating: ${avgRating} stars,
                Activities: ${cabinActivities.slice(0, 3).join(", ")},
                Breakfast: ${hasFreeBreakfast ? "Yes" : "No"},
                Occupancy Level: ${occupancyLevel} (${activeBookingsCount} bookings),
                Occupied Dates: ${occupiedRanges || "None (Fully Available)"},
                Desc: ${shortDesc}
                `;
            }).join("\n");

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

        // Get bookings context for the guest
        const bookingsContext = await getBookingsContext(userId, message, history);

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

${bookingsContext ? `---
Guest Profile and Bookings Context:
${bookingsContext}
---` : ''}

Available cabins and details:
${cabinContext}

Specific questions you should be ready to answer:
1. "Which is the most 5-star rated cabin?" (Refer to Average Rating)
2. "Which cabin offers the most activities?" (Refer to Activities list)
3. "Which cabin has free breakfast?" (Refer to Free Breakfast field)
4. "Which cabin is lowest in price?" (Compare price_per_night)
5. "How do I book a cabin?" (Explain the website booking process)
6. "Can Cabin X occupy Y guests?" (Check capacity)
7. "When is my next booking reserved for?" (If bookings details are provided in Guest Profile and Bookings Context, summarize them. If bookings context shows "None" or is empty, tell them politely that they don't have any reservations yet but you're happy to help them choose a cabin).
8. "Have I booked any cabins?" or "Do I have any stays?" (Check the bookings details in the Guest Profile and Bookings Context. If they have bookings, list them beautifully. If bookings context shows "None" or is empty, kindly let them know they haven't booked any cabins yet).
9. "How packed/busy is the cabin nowadays?", "Is Cabin X busy?", or "What are the occupancy levels/booked dates of Cabin X?" (Refer to the Occupancy Level and Occupied Dates context for the specified cabin to answer exactly how popular/packed it is and what dates are already taken).
          `;

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