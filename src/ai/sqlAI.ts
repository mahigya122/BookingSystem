export async function askSqlCopilot(question: string, conversationId?: string) {
    const res = await fetch("http://localhost:5000/api/ai/ask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            question,
            userId: "user-1",
            conversationId,
        }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to get database results");
    }

    return res.json();
}

export async function getSuggestions() {
    const res = await fetch("http://localhost:5000/api/suggestions");

    if (!res.ok) {
        throw new Error("Failed to fetch suggestions");
    }

    return res.json();
}

export async function getLatestConversation(userId: string) {
    const res = await fetch(`http://localhost:5000/api/ai/conversation/latest?userId=${encodeURIComponent(userId)}`);

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to load previous conversation");
    }

    return res.json();
}