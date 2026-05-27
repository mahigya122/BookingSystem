//convert question → SQL, convert results → natural answer
import OpenAI from "openai";

const sqlPrompt = `You are a PostgreSQL SQL generator.

RULES:
- ONLY SELECT queries
- NO explanations
- NO markdown
- NO backticks

Tables:
bookings(id, guest_id, cabin_id, start_date, end_date, status, total_price, created_at, has_breakfast)
guests(id, full_name, email, phone, created_at)
cabins(id, name, capacity, price_per_night, image_url, description, discount, created_at)
`;

export async function generateSQL(question) {
    const openai = new OpenAI({
        apiKey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });
    
    const completion = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: sqlPrompt },
            { role: "user", content: question },
        ],
        temperature: 0.2,
    });

    const sql = completion.choices[0].message.content.trim();

    return {
        sql,
        source: "groq",
        model: "llama-3.3-70b",
    };
}

export async function generateAnswer({question, row, sql}) {
    const openai = new OpenAI ({
        apikey: process.env.GROQ_API_KEY,
        baseURL: "https://api.groq.com/openai/v1",
    });
const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `
                    You are a helpful assistant. Convert database results into a simple
                     1-2 sentence answer. Do NOT show SQL or JSON.
                `,
            },
            {
                role: "user",
                content: `
Question: ${question}
SQL: ${sql}
Rows: ${JSON.stringify(rows.slice(0, 10))}
                `,
            },
        ],
        temperature: 0.2,
    });

    return {
        answer: completion.choices[0].message.content.trim(),
    };
}