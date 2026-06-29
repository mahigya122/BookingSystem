import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import aiRouter from "./routes/aiRoutes.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import guestAiRoutes from "./routes/guestAiRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import cabinRoutes from "./routes/cabinRoutes.js";
import locationsRoutes from "./routes/locationsRoutes.js";
import offersRoutes from "./routes/offersRoutes.js";
import activitiesRoutes from "./routes/activitiesRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import { executeSQL } from "./services/sqlExecutionService.js";
import { patchBookingReservation } from "./services/bookingService.js";
import { seedFullData } from "./seed_full.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envCandidates = [
    path.resolve(process.cwd(), "server/.env"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(__dirname, ".env"),
];

for (const envPath of envCandidates) {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath, override: true });
    }
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use("/api/suggestions", suggestionRoutes);
app.use("/api/ai/guest", guestAiRoutes); // Move more specific route up
app.use("/api/ai", aiRouter);
app.use("/api/bookings", bookingRoutes);
app.use("/api/cabins", cabinRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/offers", offersRoutes);
app.use("/api/activities", activitiesRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.post("/api/bootstrap", async (req, res) => {
    try {
        await seedFullData();
        return res.json({ success: true });
    } catch (error) {
        console.error("Bootstrap seeding failed:", error);
        return res.status(500).json({
            error: error.message || "Failed to bootstrap data",
        });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 UNHANDLED SERVER ERROR:", {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        debug: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

// --------------------
// ESEWA CONFIG
// --------------------
const ESEWA_SECRET = "8gBm/:&EnhH.1/q";
const PRODUCT_CODE = "EPAYTEST";

// Use env vars so these work both locally and in production.
// Set BACKEND_URL and FRONTEND_URL in Vercel project settings (Environment Variables).
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// --------------------
// SIGNATURE FUNCTION
// --------------------
function generateSignature(message) {
    return crypto
        .createHmac("sha256", ESEWA_SECRET)
        .update(message)
        .digest("base64");
}

// --------------------
// ESEWA INIT
// --------------------
app.post("/api/esewa/init", (req, res) => {
    const { amount, bookingId } = req.body;

    const message = `total_amount=${amount},transaction_uuid=${bookingId},product_code=${PRODUCT_CODE}`;

    const signature = generateSignature(message);

    const paymentData = {
        amount,
        tax_amount: 0,
        product_service_charge: 0,
        product_delivery_charge: 0,
        total_amount: amount,
        transaction_uuid: bookingId,
        product_code: PRODUCT_CODE,

        // Redirect from eSewa sandbox will hit these backend endpoints first for verification.
        success_url: `${BACKEND_URL}/api/esewa/success`,
        failure_url: `${BACKEND_URL}/api/esewa/failure`,

        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
    };

    res.json(paymentData);
});

// --------------------
// ESEWA SUCCESS
// --------------------
app.get("/api/esewa/success", async (req, res) => {
    try {
        const { data } = req.query;
        if (!data) {
            console.error("No data parameter received in eSewa success callback");
            return res.redirect(`${FRONTEND_URL}/payment/failure`);
        }

        // Decode eSewa response data (Base64-encoded JSON)
        const decodedString = Buffer.from(data, "base64").toString("utf-8");
        const paymentDetails = JSON.parse(decodedString);
        console.log("Decoded eSewa success details:", paymentDetails);

        const { status, transaction_uuid, total_amount, transaction_code, signature } = paymentDetails;

        if (status !== "COMPLETE") {
            console.error("eSewa status not COMPLETE:", status);
            return res.redirect(`${FRONTEND_URL}/payment/failure`);
        }

        // Verify the signature to prevent fraudulent database updates
        const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${PRODUCT_CODE}`;
        const calculatedSignature = generateSignature(message);
        if (calculatedSignature !== signature) {
            console.error("eSewa signature verification failed!", { calculatedSignature, signature });
            return res.redirect(`${FRONTEND_URL}/payment/failure`);
        }

        console.log("Payment success verified for booking:", transaction_uuid);

        // Update the booking in Supabase using the database service (executeSQL is SELECT-only)
        await patchBookingReservation(transaction_uuid, {
            payment_status: "paid",
            payment_method: "esewa",
            paid_at: new Date().toISOString(),
            transaction_id: `ESEWA-${transaction_code || Date.now()}`,
        });

        // Redirect the user back to the frontend success route
        return res.redirect(
            `${FRONTEND_URL}/payment/success?bookingId=${transaction_uuid}`
        );
    } catch (error) {
        console.error("Error in eSewa success redirect handler:", error);
        return res.redirect(`${FRONTEND_URL}/payment/failure`);
    }
});

// --------------------
// ESEWA FAILURE
// --------------------
app.get("/api/esewa/failure", (req, res) => {
    console.log("Payment failed or cancelled via eSewa");
    return res.redirect(`${FRONTEND_URL}/payment/failure`);
});

// --------------------
// START SERVER & WEBSOCKET SETUP
// --------------------
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// --------------------
// WEBSOCKET & REALTIME CONFLICT RESOLUTION
// --------------------
const activeSelections = new Map(); // cabinId -> Map<clientId, { startDate, endDate, ws }>

const wss = new WebSocketServer({ noServer: true });

function parseDateString(str) {
    const [year, month, day] = str.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getDatesInRange(startStr, endStr) {
    if (!startStr) return [];
    const dates = [];
    let curr = parseDateString(startStr);
    const end = endStr ? parseDateString(endStr) : curr;
    let count = 0;
    while (curr <= end && count < 100) {
        dates.push(formatDateString(curr));
        curr.setDate(curr.getDate() + 1);
        count++;
    }
    return dates;
}

function broadcastSelections(cabinId) {
    const cabinSelections = activeSelections.get(cabinId);
    if (!cabinSelections) return;

    const selections = {};
    for (const [cid, sel] of cabinSelections.entries()) {
        if (sel.startDate) {
            selections[cid] = {
                startDate: sel.startDate,
                endDate: sel.endDate
            };
        }
    }

    const payload = JSON.stringify({
        type: "update",
        selections
    });

    for (const sel of cabinSelections.values()) {
        if (sel.ws && sel.ws.readyState === 1) { // OPEN
            sel.ws.send(payload);
        }
    }
}

wss.on("connection", (ws) => {
    let currentCabinId = null;
    let currentClientId = null;

    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());

            if (data.type === "subscribe") {
                const { cabinId, clientId } = data;
                currentCabinId = cabinId;
                currentClientId = clientId;

                if (!activeSelections.has(cabinId)) {
                    activeSelections.set(cabinId, new Map());
                }

                const cabinSelections = activeSelections.get(cabinId);
                cabinSelections.set(clientId, { startDate: null, endDate: null, ws });

                broadcastSelections(cabinId);
            }

            else if (data.type === "select_dates") {
                const { cabinId, clientId, startDate, endDate } = data;

                if (!cabinId || !clientId) return;

                if (!activeSelections.has(cabinId)) {
                    activeSelections.set(cabinId, new Map());
                }

                const cabinSelections = activeSelections.get(cabinId);

                if (startDate) {
                    const requestedDates = getDatesInRange(startDate, endDate);
                    const conflictingClients = [clientId];

                    for (const [otherClientId, otherSel] of cabinSelections.entries()) {
                        if (otherClientId === clientId) continue;
                        if (otherSel.startDate) {
                            const otherDates = getDatesInRange(otherSel.startDate, otherSel.endDate);
                            const intersects = requestedDates.some(d => otherDates.includes(d));
                            if (intersects) {
                                conflictingClients.push(otherClientId);
                            }
                        }
                    }

                    if (conflictingClients.length > 1) {
                        // Choose one at random
                        const winnerId = conflictingClients[Math.floor(Math.random() * conflictingClients.length)];

                        for (const confId of conflictingClients) {
                            const confSel = cabinSelections.get(confId);
                            if (confId === winnerId) {
                                if (confId === clientId) {
                                    cabinSelections.set(clientId, { startDate, endDate, ws });
                                }
                            } else {
                                if (confSel) {
                                    confSel.startDate = null;
                                    confSel.endDate = null;
                                    if (confSel.ws && confSel.ws.readyState === 1) {
                                        confSel.ws.send(JSON.stringify({
                                            type: "conflict",
                                            message: "Someone else selected this date! Please choose a new date."
                                        }));
                                    }
                                }
                            }
                        }
                    } else {
                        cabinSelections.set(clientId, { startDate, endDate, ws });
                    }
                } else {
                    if (cabinSelections.has(clientId)) {
                        const existing = cabinSelections.get(clientId);
                        cabinSelections.set(clientId, { startDate: null, endDate: null, ws: existing.ws });
                    }
                }

                broadcastSelections(cabinId);
            }
        } catch (err) {
            console.error("Error processing WS message:", err);
        }
    });

    ws.on("close", () => {
        if (currentCabinId && currentClientId) {
            const cabinSelections = activeSelections.get(currentCabinId);
            if (cabinSelections && cabinSelections.has(currentClientId)) {
                cabinSelections.delete(currentClientId);
                broadcastSelections(currentCabinId);
            }
        }
    });
});

server.on("upgrade", (request, socket, head) => {
    const { pathname } = new URL(request.url, `http://${request.headers.host}`);
    if (pathname === "/api/ws" || pathname === "/ws") {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    } else {
        socket.destroy();
    }
});

// --------------------
// DB CHECK
// --------------------
async function checkDatabaseConnection() {
    try {
        await executeSQL("SELECT 1 AS ok");
        console.log("Database connection ready.");
    } catch (error) {
        console.warn("Database not ready:", error.message || error);
    }
}

checkDatabaseConnection();

export default app;