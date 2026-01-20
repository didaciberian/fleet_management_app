import {
  boolean,
  date,
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: text("name"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * TABLA_VANS - Main vehicles table
 * Stores information about all vans in the fleet
 */
export const tablaVans = mysqlTable("TABLA_VANS", {
  ID: int("ID").autoincrement().primaryKey(),
  ACTIVA: boolean("ACTIVA").notNull().default(true),
  VIN: varchar("VIN", { length: 17 }).notNull().unique(),
  MODELO: varchar("MODELO", { length: 100 }).notNull(),
  MATRICULA: varchar("MATRICULA", { length: 20 }).notNull().unique(),
  NUM_POLIZA: varchar("NUM_POLIZA", { length: 50 }),
  TIPO: varchar("TIPO", { length: 50 }).notNull(),
  EMPRESA: varchar("EMPRESA", { length: 100 }).notNull(),
  NUM_LLAVE: int("NUM_LLAVE"),
  ESTADO: varchar("ESTADO", { length: 50 }).notNull(),
  ESTADO_ITV: boolean("ESTADO_ITV").notNull().default(true),
  FECHA_ITV: date("FECHA_ITV"),
  AVERIA: boolean("AVERIA").notNull().default(false),
  FECHA_ACTIVACION: date("FECHA_ACTIVACION"),
  FECHA_DEFLEETING: date("FECHA_DEFLEETING"),
  FECHA_FIN_CONTRATO: date("FECHA_FIN_CONTRATO"),
  OBSERVACIONES: text("OBSERVACIONES"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TablaVan = typeof tablaVans.$inferSelect;
export type InsertTablaVan = typeof tablaVans.$inferInsert;

/**
 * VANS_AVERIAS - Breakdowns/Issues table
 * Stores information about vehicle breakdowns and maintenance issues
 * Foreign key relationship with TABLA_VANS
 */
export const vansAverias = mysqlTable("VANS_AVERIAS", {
  ID_AVERIA: int("ID_AVERIA").autoincrement().primaryKey(),
  ID: int("ID")
    .notNull()
    .references(() => tablaVans.ID, { onDelete: "cascade" }),
  CAUSA_AVERIA: text("CAUSA_AVERIA").notNull(),
  FECHA_AVERIA: date("FECHA_AVERIA").notNull(),
  TALLER: varchar("TALLER", { length: 100 }),
  FECHA_ENTRADA_TALLER: date("FECHA_ENTRADA_TALLER"),
  ESTIMACION_SALIDA: date("ESTIMACION_SALIDA"),
  FECHA_SALIDA_TALLER: date("FECHA_SALIDA_TALLER"),
  OBSERVACIONES_AVERIA: text("OBSERVACIONES_AVERIA"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type VanAveria = typeof vansAverias.$inferSelect;
export type InsertVanAveria = typeof vansAverias.$inferInsert;
