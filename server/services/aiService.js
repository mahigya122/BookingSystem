import OpenAI from "openai";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

const SQL_PROMPT = `
You are a PostgreSQL SQL generator for Supabase.

RULES:
- ONLY generate SELECT queries
- NEVER generate INSERT
- NEVER generate UPDATE
- NEVER generate DELETE
- NEVER generate DROP
- NEVER generate ALTER
- NEVER generate TRUNCATE

- RETURN RAW SQL ONLY
- NO markdown
- NO explanation
- NO backticks

DATABASE:

TABLE bookings
- id
- guest_id
- cabin_id
- start_date
- end_date
- status
- total_price
- created_at
- has_breakfast
- payment_status
- payment_method
- transaction_id
- paid_at

TABLE guests
- id
- full_name
- email
- phone
- created_at

TABLE cabins
- id
- name
- capacity
- price_per_night
- image_url
- description
- discount
- created_at
`;

const ANSWER_PROMPT = `You are a concise assistant that answers database questions.
Use the question, SQL, and returned rows to produce a short friendly answer.
- DO NOT output SQL, JSON, or code blocks.
- Keep it to 1-2 sentences.
`;

const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];
const ALLOWED_TABLES = ["bookings", "guests", "cabins"];

function getGroqApiKey() {
    return process.env.GROQ_API_KEY || process.env.GROQ_KEY || null;
}

function shouldUseFallback() {
    return String(process.env.SQL_AI_ALLOW_FALLBACK || "false").toLowerCase() === "true";
}

function getGroqModels() {
    return [process.env.GROQ_MODEL, ...GROQ_MODELS].filter((model, index, list) => model && list.indexOf(model) === index);
}

function createGroqClient(apiKey) {
    return new OpenAI({ apiKey, baseURL: GROQ_BASE_URL });
}

function isQuotaError(error) {
    const code = error?.code || error?.error?.code;
    return code === "insufficient_quota" || error?.status === 429;
}

function isDeprecatedModelError(message) {
    return /decommissioned|no longer supported/i.test(message);
}

function buildFallbackSQL(question) {
    const text = String(question || "").toLowerCase();

    if (text.includes("checked in") && text.includes("how many")) {
        return `SELECT COUNT(*) AS total_checked_in
FROM bookings
WHERE status = 'checked in'
  AND start_date = CURRENT_DATE`;
    }

    if (text.includes("how many") && text.includes("guest")) {
        return `SELECT COUNT(*) AS total_guests FROM guests`;
    }

    if ((text.includes("arriv") || text.includes("ariv")) && text.includes("today")) {
        return `SELECT
  g.id,
  g.full_name,
  g.email,
  g.phone,
  b.start_date,
  b.end_date,
  b.status,
  c.name AS cabin_name
FROM bookings b
JOIN guests g ON g.id = b.guest_id
LEFT JOIN cabins c ON c.id = b.cabin_id
WHERE b.start_date = CURRENT_DATE
ORDER BY g.full_name ASC /* fallback: arrivals_today */`;
    }

    if (text.includes("today") && text.includes("booking")) {
        return `SELECT
  b.id,
  g.full_name,
  c.name AS cabin_name,
  b.start_date,
  b.end_date,
  b.status,
  b.total_price
FROM bookings b
JOIN guests g ON g.id = b.guest_id
LEFT JOIN cabins c ON c.id = b.cabin_id
WHERE b.start_date = CURRENT_DATE
ORDER BY g.full_name ASC /* fallback: today_bookings */`;
    }

    return `SELECT
  b.id,
  g.full_name,
  c.name AS cabin_name,
  b.start_date,
  b.end_date,
  b.status,
  b.total_price
FROM bookings b
JOIN guests g ON g.id = b.guest_id
LEFT JOIN cabins c ON c.id = b.cabin_id
ORDER BY b.created_at DESC
LIMIT 10`;
}

function summarizeRows(question, rows = [], rowCount = 0) {
    const normalizedQuestion = String(question || "").toLowerCase();
    const firstRow = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (firstRow && typeof firstRow === "object") {
        const countKey = Object.keys(firstRow).find((key) => /count|total|num|size/i.test(key));

        if (countKey) {
            const value = firstRow[countKey];

            if (normalizedQuestion.includes("cabin")) return `There are ${value} cabins available right now.`;
            if (normalizedQuestion.includes("guest")) return `There are ${value} guests in the system right now.`;
            if (normalizedQuestion.includes("booking")) return `There are ${value} bookings matching your question.`;

            return `There are ${value} records matching your question.`;
        }
    }

    if (rowCount === 0 || rows.length === 0) {
        return normalizedQuestion.includes("today")
            ? "I couldn't find any matching records for today."
            : "I couldn't find any matching records.";
    }

    if (rows.length === 1) {
        return "I found one matching record.";
    }

    return `I found ${rows.length} matching records.`;
}

function createRowsPreview(rows) {
    return Array.isArray(rows) ? JSON.stringify(rows.slice(0, 20)) : "[]";
}

async function runGroqCompletion({ model, messages, temperature = 0.2 }) {
    const client = createGroqClient(getGroqApiKey());
    const completion = await client.chat.completions.create({ model, messages, temperature });
    return completion.choices?.[0]?.message?.content?.trim() || "";
}

async function tryGroqModels({ messages, temperature }) {
    let lastError = null;

    for (const model of getGroqModels()) {
        try {
            const reply = await runGroqCompletion({ model, messages, temperature });

            if (reply) {
                return { reply, model };
            }

            lastError = new Error("Groq returned an empty response.");
        } catch (error) {
            lastError = error;
            const message = error?.message || String(error);

            if (isDeprecatedModelError(message)) {
                continue;
            }

            throw error;
        }
    }

    if (lastError) {
        throw lastError;
    }

    throw new Error("No Groq models were available.");
}

function buildSqlMessages(question) {
    return [
        { role: "system", content: SQL_PROMPT },
        { role: "user", content: question },
    ];
}

function buildAnswerMessages({ question, sql, rows }) {
    return [
        { role: "system", content: ANSWER_PROMPT },
        {
            role: "user",
            content: `Question: ${question}\n\nSQL: ${sql}\n\nRows: ${createRowsPreview(rows)}`,
        },
    ];
}

async function generateFromGroq({ messages, temperature, fallbackValue, sourceOnFallback }) {
    const apiKey = getGroqApiKey();

    if (!apiKey) {
        if (shouldUseFallback()) {
            return { value: fallbackValue(), source: sourceOnFallback };
        }

        throw new Error("Groq API key not found in server environment.");
    }

    try {
        const { reply, model } = await tryGroqModels({ messages, temperature });
        return { value: reply, source: "groq", model };
    } catch (error) {
        const message = error?.message || String(error);

        if (isQuotaError(error)) {
            if (shouldUseFallback()) {
                return { value: fallbackValue(), source: "fallback-quota", error: message };
            }

            throw new Error(message || "Groq quota exhausted.");
        }

        if (shouldUseFallback()) {
            return { value: fallbackValue(), source: "fallback-error", error: message };
        }

        throw error;
    }
}

export async function generateSQL(question) {
    const normalizedQuestion = String(question || "").toLowerCase();

    if (normalizedQuestion.includes("checked in") && normalizedQuestion.includes("how many")) {
        return {
            sql: buildFallbackSQL(question),
            source: "rule",
            model: null,
            error: null,
        };
    }

    const result = await generateFromGroq({
        messages: buildSqlMessages(question),
        temperature: 0.2,
        fallbackValue: () => buildFallbackSQL(question),
        sourceOnFallback: "fallback-no-key",
    });

    return { sql: result.value, source: result.source, model: result.model, error: result.error || null };
}

export async function generateAnswer({ question, sql, rows } = {}) {
    const deterministicAnswer = summarizeRows(question, rows, Array.isArray(rows) ? rows.length : 0);

    if (!getGroqApiKey() && !shouldUseFallback()) {
        return { answer: deterministicAnswer, source: "deterministic" };
    }

    const result = await generateFromGroq({
        messages: buildAnswerMessages({ question, sql, rows }),
        temperature: 0.2,
        fallbackValue: () => deterministicAnswer,
        sourceOnFallback: "deterministic",
    });

    return { answer: result.value, source: result.source, model: result.model, error: result.error || null };
}

export async function generateChatReply({ messages, systemPrompt, temperature = 0.7 }) {
    const chatMessages = [
        { role: "system", content: systemPrompt },
        ...messages
    ];

    const result = await generateFromGroq({
        messages: chatMessages,
        temperature,
        fallbackValue: () => "I am currently unable to process your request. Please try again later.",
        sourceOnFallback: "fallback-chat",
    });

    return { reply: result.value, source: result.source, model: result.model };
}

