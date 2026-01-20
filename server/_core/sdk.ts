import { Request, Response } from "express";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";

type SessionData = {
  authenticated: boolean;
  timestamp: number;
};

/**
 * Simple session management for password-based auth
 */
export class SDKServer {
  private sessionSecret = process.env.JWT_SECRET || "dev-secret-key";

  parseCookies(cookieHeader?: string): Map<string, string> {
    const cookies = new Map<string, string>();
    if (!cookieHeader) return cookies;

    cookieHeader.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      if (name && value) {
        cookies.set(name, decodeURIComponent(value));
      }
    });

    return cookies;
  }

  async getUser(req: Request, res: Response) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);

    if (!sessionCookie) {
      throw new Error("No session cookie");
    }

    try {
      // Decode session token
      const sessionData = JSON.parse(
        Buffer.from(sessionCookie, "base64").toString()
      ) as SessionData;

      if (!sessionData.authenticated) {
        throw new Error("Invalid session");
      }

      // Return a generic authenticated user
      return {
        id: 1,
        email: "app@fleet.local",
        passwordHash: "",
        name: "Fleet Manager",
        role: "admin" as const,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      };
    } catch (error) {
      throw new Error("Failed to verify session");
    }
  }

  setSessionCookie(res: Response, token: string) {
    const cookieOptions = getSessionCookieOptions({
      protocol: "https",
      headers: {},
    } as any);

    res.cookie(COOKIE_NAME, token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  clearSessionCookie(res: Response) {
    const cookieOptions = getSessionCookieOptions({
      protocol: "https",
      headers: {},
    } as any);

    res.clearCookie(COOKIE_NAME, {
      ...cookieOptions,
      maxAge: -1,
    });
  }
}

export const sdk = new SDKServer();
