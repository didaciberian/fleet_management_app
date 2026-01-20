import { z } from "zod";

// ============ TABLA_VANS Schemas ============

export const createVanSchema = z.object({
  ACTIVA: z.boolean().default(true),
  VIN: z.string().min(17).max(17).toUpperCase(),
  MODELO: z.string().min(1).max(100),
  MATRICULA: z.string().min(1).max(20).toUpperCase(),
  NUM_POLIZA: z.string().max(50).optional().nullable(),
  TIPO: z.string().min(1).max(50),
  EMPRESA: z.string().min(1).max(100),
  NUM_LLAVE: z.number().int().optional().nullable(),
  ESTADO: z.string().min(1).max(50),
  ESTADO_ITV: z.boolean().default(true),
  FECHA_ITV: z.string().date().optional().nullable(),
  AVERIA: z.boolean().default(false),
  FECHA_ACTIVACION: z.string().date().optional().nullable(),
  FECHA_DEFLEETING: z.string().date().optional().nullable(),
  FECHA_FIN_CONTRATO: z.string().date().optional().nullable(),
  OBSERVACIONES: z.string().optional().nullable(),
});

export const updateVanSchema = createVanSchema.partial();

export const vanFilterSchema = z.object({
  empresa: z.string().optional(),
  estado: z.string().optional(),
  activa: z.boolean().optional(),
  averia: z.boolean().optional(),
  estadoITV: z.boolean().optional(),
});

export type CreateVan = z.infer<typeof createVanSchema>;
export type UpdateVan = z.infer<typeof updateVanSchema>;
export type VanFilter = z.infer<typeof vanFilterSchema>;

// ============ VANS_AVERIAS Schemas ============

export const createAveriaSchema = z.object({
  ID: z.number().int().positive("El ID de la furgoneta és obligatori"),
  CAUSA_AVERIA: z.string().min(1, "La causa de l'averia és obligatòria").max(1000),
  FECHA_AVERIA: z.string().date("La data de l'averia ha de ser una data vàlida"),
  TALLER: z.string().max(100).optional().nullable(),
  FECHA_ENTRADA_TALLER: z.string().date().optional().nullable(),
  ESTIMACION_SALIDA: z.string().date().optional().nullable(),
  FECHA_SALIDA_TALLER: z.string().date().optional().nullable(),
  OBSERVACIONES_AVERIA: z.string().optional().nullable(),
});

export const updateAveriaSchema = createAveriaSchema.partial().omit({ ID: true });

export type CreateAveria = z.infer<typeof createAveriaSchema>;
export type UpdateAveria = z.infer<typeof updateAveriaSchema>;

// ============ Search Schemas ============

export const searchSchema = z.object({
  query: z.string().min(1).max(100),
});

export type SearchQuery = z.infer<typeof searchSchema>;
