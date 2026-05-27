export function validateSQL(query) {
  const normalized = (query || "").trim().replace(/;\s*$/u, "");
  const lower = normalized.toLowerCase();

  if (!normalized) {
    return false;
  }

  if (normalized.includes(";")) {
    return false;
  }

  const blocked = [
    "insert",
    "update",
    "delete",
    "drop",
    "alter",
    "truncate",
  ];

  const hasBlockedWord = blocked.some((word) =>
    lower.includes(word)
  );

  if (hasBlockedWord) {
    return false;
  }

  if (!lower.startsWith("select")) {
    return false;
  }

  return true;
}