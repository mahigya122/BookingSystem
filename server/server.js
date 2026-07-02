import express from "express";
import { supabase } from "./lib/supabase.js";
import cors from "cors";
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

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use("/api/suggestions", suggestionRoutes);
app.use("/api/ai/guest", guestAiRoutes);
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
        return res.status(500).json({ error: error.message || "Failed to bootstrap data" });
    }
});

app.use((err, req, res, next) => {
    console.error("UNHANDLED SERVER ERROR:", { message: err.message, path: req.path, method: req.method });
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message,
        debug: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

// ESEWA CONFIG
const ESEWA_SECRET = "8gBm/:&EnhH.1/q";
const PRODUCT_CODE = "EPAYTEST";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

function generateSignature(message) {
    return crypto.createHmac("sha256", ESEWA_SECRET).update(message).digest("base64");
}

app.post("/api/esewa/init", (req, res) => {
    const { amount, bookingId } = req.body;
    const message = `total_amount=${amount},transaction_uuid=${bookingId},product_code=${PRODUCT_CODE}`;
    const signature = generateSignature(message);
    res.json({
        amount,
        tax_amount: 0,
        product_service_charge: 0,
        product_delivery_charge: 0,
        total_amount: amount,
        transaction_uuid: bookingId,
        product_code: PRODUCT_CODE,
        success_url: `${BACKEND_URL}/api/esewa/success`,
        failure_url: `${BACKEND_URL}/api/esewa/failure`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
    });
});

app.get("/api/esewa/success", async (req, res) => {
    try {
        const { data } = req.query;
        if (!data) return res.redirect(`${FRONTEND_URL}/payment/failure`);

        const decodedString = Buffer.from(data, "base64").toString("utf-8");
        const paymentDetails = JSON.parse(decodedString);
        const { status, transaction_uuid, total_amount, transaction_code, signature } = paymentDetails;

        if (status !== "COMPLETE") return res.redirect(`${FRONTEND_URL}/payment/failure`);

        const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${PRODUCT_CODE}`;
        const calculatedSignature = generateSignature(message);
        if (calculatedSignature !== signature) return res.redirect(`${FRONTEND_URL}/payment/failure`);

        const { data: existingBooking } = await supabase
            .from("bookings")
            .select("payment_method")
            .eq("id", transaction_uuid)
            .single();

        const methodToSave = (existingBooking && existingBooking.payment_method && existingBooking.payment_method.startsWith("esewa"))
            ? existingBooking.payment_method
            : "esewa";

        await patchBookingReservation(transaction_uuid, {
            payment_status: "paid",
            payment_method: methodToSave,
            paid_at: new Date().toISOString(),
            transaction_id: `ESEWA-${transaction_code || Date.now()}`,
        });

        return res.redirect(`${FRONTEND_URL}/payment/success?bookingId=${transaction_uuid}`);
    } catch (error) {
        console.error("Error in eSewa success handler:", error);
        return res.redirect(`${FRONTEND_URL}/payment/failure`);
    }
});

app.get("/api/esewa/failure", (req, res) => {
    return res.redirect(`${FRONTEND_URL}/payment/failure`);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

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