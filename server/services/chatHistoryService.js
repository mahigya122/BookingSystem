import { createClient } from "@supabase/supabase-js";

let supabase;

function getSupabase() {
  if (!supabase) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error("Missing Supabase URL or service role key.");
    }

    supabase = createClient(url, key);
  }

  return supabase;
}

export async function getLatestConversation(userId) {
  const client = getSupabase();

  const { data, error } = await client
    .from("conversations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data || null;
}

export async function getOrCreateConversation(userId) {
  const existing = await getLatestConversation(userId);
  if (existing) return existing;

  const client = getSupabase();
  const { data, error } = await client
    .from("conversations")
    .insert({ user_id: userId, title: "New Chat" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function saveMessage(conversationId, role, content) {
  const client = getSupabase();
  const { error } = await client.from("messages").insert({
    conversation_id: conversationId,
    role,
    content,
  });

  if (error) throw error;
}

export async function getMessages(conversationId) {
  const client = getSupabase();
  const { data, error } = await client
    .from("messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}
