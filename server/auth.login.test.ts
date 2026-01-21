import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; cookies: Map<string, string> } {
  const cookies = new Map<string, string>();

  const user: AuthenticatedUser = {
    id: 1,
    email: "app@fleet.local",
    passwordHash: "",
    name: "Fleet Manager",
    role: "admin",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      cookie: (name: string, value: string, options: any) => {
        cookies.set(name, value);
      },
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx, cookies };
}

describe("auth.login", () => {
  it("returns success and token with correct password", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.login({ password: "appIrds2026" });

    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
    expect(result.message).toBe("Login exitoso");
  });

  it("throws UNAUTHORIZED error with incorrect password", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.login({ password: "wrongpassword" });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.code).toBe("UNAUTHORIZED");
      expect(error.message).toContain("Contraseña incorrecta");
    }
  });

  it("token is base64 encoded JSON", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.login({ password: "appIrds2026" });

    // Decode the token
    const decoded = JSON.parse(Buffer.from(result.token, "base64").toString());
    expect(decoded.authenticated).toBe(true);
    expect(decoded.timestamp).toBeDefined();
  });
});
