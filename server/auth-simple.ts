import { TRPCError } from "@trpc/server";
import { z } from "zod";

// Contraseña única para acceso (configurable via ENV)
const APP_PASSWORD = process.env.APP_PASSWORD || "admin123";

export const authSimpleRouter = {
  login: async ({ password }: { password: string }) => {
    if (password !== APP_PASSWORD) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Contraseña incorrecta",
      });
    }

    // Generate a simple session token (in production, use JWT)
    const token = Buffer.from(
      JSON.stringify({
        authenticated: true,
        timestamp: Date.now(),
      })
    ).toString("base64");

    return {
      success: true,
      message: "Login exitoso",
      token,
    };
  },

  verifyToken: async ({ token }: { token: string }) => {
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString());
      return {
        valid: decoded.authenticated === true,
        authenticated: decoded.authenticated === true,
      };
    } catch {
      return {
        valid: false,
        authenticated: false,
      };
    }
  },

  logout: async () => {
    return {
      success: true,
      message: "Sesión cerrada",
    };
  },
};
