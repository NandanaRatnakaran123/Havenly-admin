export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "havenly_admin_session";

/** Readable-by-client cookie holding the role. UI convenience only, never a security boundary. */
export const ROLE_COOKIE_NAME = `${AUTH_COOKIE_NAME}_role`;

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
