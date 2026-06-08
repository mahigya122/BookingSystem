import express from "express";
import { generateSQL, generateAnswer } from "../services/aiService.js";
import { validateSQL } from "../validators/validateSQL.js";
import { executeSQL } from "../services/sqlExecutionService.js";

import {
  getOrCreateConversation,
    getLatestConversation,
  saveMessage,
  getMessages,
} from "../services/chatHistoryService.js";

const router = express.Router();

router.get("/conversation/latest", async (req, res) => {
    try {
        const userId = String(req.query.userId || "anonymous");
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

router.post("/ask", async (req, res) => {
    try {
        const { question, userId, conversationId } = req.body;

        if (!question) {
            return res.status(400).json({ error: "Question is required" });
        }

        // conversation
    const conversation = conversationId
      ? { id: conversationId }
      : await getOrCreateConversation(userId || "anonymous");

    const cid = conversation.id;

    // save user message
    await saveMessage(cid, "user", question);


        // AI generates SQL
        const { sql, source, model, error: genError } = await generateSQL(question);

        // Security check
        if (!validateSQL(sql)) {
            return res.status(400).json({ error: "Unsafe SQL blocked" });
        }

        // Execute query
        const result = await executeSQL(sql);

        // Optional natural language answer
        const answerData = await generateAnswer({
            question,
            sql,
            rows: result.rows,
        });

        // save assistant message
        await saveMessage(cid, "assistant", answerData.answer);

        // get full history
        const history = await getMessages(cid);

        return res.json({
            answer: answerData.answer,
            conversationId: cid,
            history,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err.message || " Failed to process the question",
        });
    }
});
export default router;