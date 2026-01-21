import { describe, it, expect, beforeEach } from "vitest";
import { createExpressContextOptions } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { COOKIE_NAME } from "@shared/const";

describe("Auth Integration Tests", () => {
  it("should login and then verify user is authenticated", async () => {
    // Mock Express request and response
    const mockReq = {
      headers: {},
      protocol: "https",
    } as any;

    const mockRes = {
      cookie: function(name: string, value: string, options: any) {
        this.cookies = this.cookies || {};
        this.cookies[name] = value;
        return this;
      },
      cookies: {},
    } as any;

    // Step 1: Login
    const caller = appRouter.createCaller({
      req: mockReq,
      res: mockRes,
      user: null,
    });

    const loginResult = await caller.auth.login({ password: "appIrds2026" });
    expect(loginResult.success).toBe(true);
    expect(loginResult.token).toBeDefined();

    // Step 2: Verify cookie was set
    expect(mockRes.cookies[COOKIE_NAME]).toBe(loginResult.token);

    // Step 3: Simulate authenticated request
    const authenticatedReq = {
      headers: {
        cookie: `${COOKIE_NAME}=${loginResult.token}`,
      },
      protocol: "https",
    } as any;

    const authenticatedRes = {
      cookie: function() { return this; },
      cookies: {},
    } as any;

    const authenticatedContext = await createContext({
      req: authenticatedReq,
      res: authenticatedRes,
    });

    expect(authenticatedContext.user).toBeDefined();
    expect(authenticatedContext.user?.email).toBe("app@fleet.local");

    // Step 4: Call auth.me with authenticated context
    const authenticatedCaller = appRouter.createCaller(authenticatedContext);
    const meResult = await authenticatedCaller.auth.me();
    expect(meResult).toBeDefined();
    expect(meResult?.email).toBe("app@fleet.local");
  });
});
