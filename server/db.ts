import { eq, and, like, gte, lte, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, tablaVans, vansAverias, TablaVan, VanAveria } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ TABLA_VANS Operations ============

export async function getAllVans() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(tablaVans).orderBy(desc(tablaVans.createdAt));
}

export async function getVanById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(tablaVans).where(eq(tablaVans.ID, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function searchVans(query: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const searchTerm = `%${query}%`;
  return db.select().from(tablaVans).where(
    like(tablaVans.MATRICULA, searchTerm)
  ).orderBy(desc(tablaVans.createdAt));
}

export async function filterVans(filters: {
  empresa?: string;
  estado?: string;
  activa?: boolean;
  averia?: boolean;
  estadoITV?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const conditions = [];
  
  if (filters.empresa) conditions.push(eq(tablaVans.EMPRESA, filters.empresa));
  if (filters.estado) conditions.push(eq(tablaVans.ESTADO, filters.estado));
  if (filters.activa !== undefined) conditions.push(eq(tablaVans.ACTIVA, filters.activa));
  if (filters.averia !== undefined) conditions.push(eq(tablaVans.AVERIA, filters.averia));
  if (filters.estadoITV !== undefined) conditions.push(eq(tablaVans.ESTADO_ITV, filters.estadoITV));
  
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return db.select().from(tablaVans)
    .where(whereClause)
    .orderBy(desc(tablaVans.createdAt));
}

export async function createVan(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(tablaVans).values(data);
  return result;
}

export async function updateVan(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.update(tablaVans)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tablaVans.ID, id));
  
  return result;
}

export async function deleteVan(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(tablaVans).where(eq(tablaVans.ID, id));
}

// ============ VANS_AVERIAS Operations ============

export async function getAveriasByVanId(vanId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(vansAverias)
    .where(eq(vansAverias.ID, vanId))
    .orderBy(desc(vansAverias.createdAt));
}

export async function getAllAverias() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(vansAverias).orderBy(desc(vansAverias.createdAt));
}

export async function getAveriaById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(vansAverias)
    .where(eq(vansAverias.ID_AVERIA, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function createAveria(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(vansAverias).values(data);
  return result;
}

export async function updateAveria(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.update(vansAverias)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(vansAverias.ID_AVERIA, id));
  
  return result;
}

export async function deleteAveria(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(vansAverias).where(eq(vansAverias.ID_AVERIA, id));
}

// ============ Analytics/Metrics ============

export async function getMetrics() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const allVans = await db.select().from(tablaVans);
  const activaVans = allVans.filter(v => v.ACTIVA);
  const inactivaVans = allVans.filter(v => !v.ACTIVA);
  const vansWithAveria = allVans.filter(v => v.AVERIA);
  
  // Vans with ITV expiring in 30 days
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const itvExpiringVans = allVans.filter(v => {
    if (!v.FECHA_ITV) return false;
    const itvDate = new Date(v.FECHA_ITV);
    return itvDate <= thirtyDaysFromNow && itvDate >= today;
  });
  
  // Vans with expired ITV
  const itvExpiredVans = allVans.filter(v => {
    if (!v.FECHA_ITV) return false;
    const itvDate = new Date(v.FECHA_ITV);
    return itvDate < today;
  });
  
  // Count vans in workshop (with active breakdowns)
  const vansInWorkshop = await db.select().from(vansAverias)
    .where(eq(vansAverias.FECHA_SALIDA_TALLER, null as any));
  
  // Distribution by company
  const companyCounts = allVans.reduce((acc: Record<string, number>, van) => {
    acc[van.EMPRESA] = (acc[van.EMPRESA] || 0) + 1;
    return acc;
  }, {});
  
  // Distribution by type
  const typeCounts = allVans.reduce((acc: Record<string, number>, van) => {
    acc[van.TIPO] = (acc[van.TIPO] || 0) + 1;
    return acc;
  }, {});
  
  return {
    totalVans: allVans.length,
    activaVans: activaVans.length,
    inactivaVans: inactivaVans.length,
    vansWithAveria: vansWithAveria.length,
    itvExpiringVans: itvExpiringVans.length,
    itvExpiredVans: itvExpiredVans.length,
    vansInWorkshop: vansInWorkshop.length,
    companyCounts,
    typeCounts,
  };
}
