import { fetchJson } from "@shared/services/http";

let hasSeed = false;

export async function initializeData() {
  if (import.meta.env.VITE_ENABLE_BOOTSTRAP !== "true") return;
  if (hasSeed) return;
  hasSeed = true;

  try {
    console.log("🌱 Bootstrapping data from the server...");
    await fetchJson("/bootstrap", { method: "POST" });
    console.log("✅ Bootstrap complete");
  } catch (error) {
    console.warn("Bootstrap skipped or failed:", error);
  }
}
