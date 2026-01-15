export function nowIso(): string {
  return new Date().toISOString();
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `loc_${Date.now().toString(36)}_${Math.random().toString(16).slice(2, 10)}`;
}
