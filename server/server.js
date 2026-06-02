import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRouter from "./routes/aiRoutes.js";
import { executeSQL } from "./services/sqlExecutionService.js";
import suggestionRoutes from "./routes/suggestionRoutes.js";
import guestAiRoutes from "./routes/guestAiRoutes.js";

dotenv.config({ path: "../.env" });
dotenv.config({ path: ".env", override: true });
const app = express();
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
const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

async function checkDatabaseConnection() {
    try {
        await executeSQL("SELECT 1 AS ok");
        console.log("Database connection ready.");
    } catch (error) {
        console.warn("Database connection not ready:", error.message || error);
        console.warn("Add your Supabase Postgres connection string to DATABASE_URL or SUPABASE_DATABASE_URL.");
    }
}

checkDatabaseConnection();