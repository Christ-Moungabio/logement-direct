export const ACTIVITY_COOKIE = "ndako_last_seen";

export const SESSION_IDLE_DAYS = 7;

export const SESSION_IDLE_SECONDS = SESSION_IDLE_DAYS * 24 * 60 * 60;

export const ACTIVITY_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 365 * 24 * 60 * 60,
};

export function isIdleExpired(lastSeen, now = Date.now()) {
  const timestamp = Number(lastSeen);
  if (!Number.isFinite(timestamp) || timestamp <= 0) return false;
  return now - timestamp > SESSION_IDLE_SECONDS * 1000;
}
