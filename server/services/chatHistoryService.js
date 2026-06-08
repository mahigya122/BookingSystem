import { supabase } from "../lib/supabase.js";

export async function getLatestConversation(userId) {
  const { data, error } = await supabase
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

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user_id: userId, title: "New Chat" })
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function saveMessage(conversationId, role, content) {
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    role,
    content,
  });

  if (error) throw error;
}

export async function getMessages(conversationId) {
  const { data, error } = await supabase
    .from("messages")
    .select("role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

