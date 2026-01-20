import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { getDb } from "./db";
import bcrypt from "bcryptjs";

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Verify a password against its hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Register a new user
 */
export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<{ success: boolean; message: string; userId?: number }> {
  // Validate email domain
  if (!email.endsWith("@iberianrd.es")) {
    return {
      success: false,
      message: "Solo se permiten emails de @iberianrd.es",
    };
  }

  const db = await getDb();
  if (!db) {
    return {
      success: false,
      message: "Error de conexión a la base de datos",
    };
  }

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        message: "El email ya está registrado",
      };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    await db.insert(users).values({
      email,
      passwordHash,
      name,
      role: "user",
      isActive: true,
    });

    const createdUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return {
      success: true,
      message: "Usuario registrado exitosamente",
      userId: createdUser[0]?.id,
    };
  } catch (error) {
    console.error("[Auth] Registration error:", error);
    return {
      success: false,
      message: "Error al registrar el usuario",
    };
  }
}

/**
 * Login user with email and password
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{
  success: boolean;
  message: string;
  user?: (typeof users.$inferSelect) | null;
}> {
  const db = await getDb();
  if (!db) {
    return {
      success: false,
      message: "Error de conexión a la base de datos",
    };
  }

  try {
    // Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userResult.length === 0) {
      return {
        success: false,
        message: "Email o contraseña incorrectos",
      };
    }

    const user = userResult[0];

    // Check if user is active
    if (!user.isActive) {
      return {
        success: false,
        message: "Usuario inactivo",
      };
    }

    // Verify password
    const passwordMatch = await verifyPassword(password, user.passwordHash);

    if (!passwordMatch) {
      return {
        success: false,
        message: "Email o contraseña incorrectos",
      };
    }

    // Update last signed in
    await db
      .update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, user.id));

    return {
      success: true,
      message: "Login exitoso",
      user,
    };
  } catch (error) {
    console.error("[Auth] Login error:", error);
    return {
      success: false,
      message: "Error al iniciar sesión",
    };
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("[Auth] Get user error:", error);
    return null;
  }
}
