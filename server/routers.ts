import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure, authorizedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  createVanSchema,
  updateVanSchema,
  vanFilterSchema,
  createAveriaSchema,
  updateAveriaSchema,
  searchSchema,
} from "@shared/schemas";
import {
  getAllVans,
  getVanById,
  searchVans,
  filterVans,
  createVan,
  updateVan,
  deleteVan,
  getAveriasByVanId,
  getAllAverias,
  getAveriaById,
  createAveria,
  updateAveria,
  deleteAveria,
  getMetrics,
} from "./db";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const appPassword = "appIrds2026";
        if (input.password !== appPassword) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Contraseña incorrecta",
          });
        }
        const token = Buffer.from(
          JSON.stringify({
            authenticated: true,
            timestamp: Date.now(),
          })
        ).toString("base64");
        
        // Set session cookie
        sdk.setSessionCookie(ctx.res, token, ctx.req);
        
        return {
          success: true,
          message: "Login exitoso",
          token,
        };
      }),
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ TABLA_VANS Procedures ============
  vans: router({
    // Get all vans
    list: authorizedProcedure.query(async () => {
      try {
        return await getAllVans();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch vans",
        });
      }
    }),

    // Get van by ID
    getById: authorizedProcedure
      .input(z.object({ id: z.number().int() }))
      .query(async ({ input }) => {
        try {
          const van = await getVanById(input.id);
          if (!van) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Van not found",
            });
          }
          return van;
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch van",
          });
        }
      }),

    // Search vans by matricula or VIN
    search: authorizedProcedure
      .input(searchSchema)
      .query(async ({ input }) => {
        try {
          return await searchVans(input.query);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to search vans",
          });
        }
      }),

    // Filter vans
    filter: authorizedProcedure
      .input(vanFilterSchema)
      .query(async ({ input }) => {
        try {
          return await filterVans(input);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to filter vans",
          });
        }
      }),

    // Create van
    create: authorizedProcedure
      .input(createVanSchema)
      .mutation(async ({ input }) => {
        try {
          const result = await createVan(input);
          return { success: true, id: (result as any).insertId || 0 };
        } catch (error: any) {
          if (error.code === "ER_DUP_ENTRY") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "VIN or MATRICULA already exists",
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create van",
          });
        }
      }),

    // Update van
    update: authorizedProcedure
      .input(
        z.object({
          id: z.number().int(),
          data: updateVanSchema,
        })
      )
      .mutation(async ({ input }) => {
        try {
          await updateVan(input.id, input.data);
          return { success: true };
        } catch (error: any) {
          if (error.code === "ER_DUP_ENTRY") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "VIN or MATRICULA already exists",
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update van",
          });
        }
      }),

    // Delete van
    delete: authorizedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input }) => {
        try {
          await deleteVan(input.id);
          return { success: true };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete van",
          });
        }
      }),
  }),

  // ============ VANS_AVERIAS Procedures ============
  averias: router({
    // Get all averias
    list: authorizedProcedure.query(async () => {
      try {
        return await getAllAverias();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch averias",
        });
      }
    }),

    // Get averias by van ID
    getByVanId: authorizedProcedure
      .input(z.object({ vanId: z.number().int() }))
      .query(async ({ input }) => {
        try {
          return await getAveriasByVanId(input.vanId);
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch averias",
          });
        }
      }),

    // Get averia by ID
    getById: authorizedProcedure
      .input(z.object({ id: z.number().int() }))
      .query(async ({ input }) => {
        try {
          const averia = await getAveriaById(input.id);
          if (!averia) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Averia not found",
            });
          }
          return averia;
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch averia",
          });
        }
      }),

    // Create averia
    create: authorizedProcedure
      .input(createAveriaSchema)
      .mutation(async ({ input }) => {
        try {
          // Verify van exists
          const van = await getVanById(input.ID);
          if (!van) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Van not found",
            });
          }

          const result = await createAveria(input);
          return { success: true, id: (result as any).insertId || 0 };
        } catch (error) {
          if (error instanceof TRPCError) throw error;
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create averia",
          });
        }
      }),

    // Update averia
    update: authorizedProcedure
      .input(
        z.object({
          id: z.number().int(),
          data: updateAveriaSchema,
        })
      )
      .mutation(async ({ input }) => {
        try {
          await updateAveria(input.id, input.data);
          return { success: true };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update averia",
          });
        }
      }),

    // Delete averia
    delete: authorizedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ input }) => {
        try {
          await deleteAveria(input.id);
          return { success: true };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to delete averia",
          });
        }
      }),
  }),

  // ============ Metrics ============
  metrics: router({
    getDashboard: authorizedProcedure.query(async () => {
      try {
        return await getMetrics();
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch metrics",
        });
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
