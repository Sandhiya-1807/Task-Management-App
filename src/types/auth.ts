/**
 * Authentication mode switch configuration.
 *
 * Set `DEMO_AUTH_MODE: true` to use local client-side demo authentication
 * (backed by localStorage) while Firebase Authentication project permissions or
 * providers are pending configuration.
 *
 * Set `DEMO_AUTH_MODE: false` to switch back directly to live Firebase Authentication.
 */
export const DEMO_AUTH_MODE = true;

/**
 * Common user interface representing an authenticated session.
 * Compatible with Firebase User shape (uid, email, displayName).
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
