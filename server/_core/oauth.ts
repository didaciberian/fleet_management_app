import type { Express } from "express";

/**
 * OAuth routes are disabled for simple password authentication
 * Login is handled via tRPC auth.login procedure
 */
export function registerOAuthRoutes(app: Express) {
  // OAuth disabled - using simple password auth instead
}
