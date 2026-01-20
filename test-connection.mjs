import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const DATABASE_URL = "postgresql://postgres.tpjwuewgjwpttcagescw:datosIrds2026@aws-1-eu-west-2.pooler.supabase.com:5432/postgres";

console.log("🔍 Intentando conectar a Supabase...");
console.log(`📍 URL: ${DATABASE_URL.replace(/:[^@]*@/, ":****@")}`);

try {
  // Intentar conexión básica
  const connection = await mysql.createConnection({
    host: "aws-1-eu-west-2.pooler.supabase.com",
    user: "postgres.tpjwuewgjwpttcagescw",
    password: "datosIrds2026",
    database: "postgres",
    port: 5432,
  });

  console.log("✅ Conexión exitosa a Supabase!");
  
  // Verificar que las tablas existen
  const [tables] = await connection.execute(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
  );
  
  console.log("\n📊 Tablas en la base de datos:");
  tables.forEach((table) => {
    console.log(`  - ${table.table_name}`);
  });

  await connection.end();
  console.log("\n✅ Prueba completada exitosamente!");
  
} catch (error) {
  console.error("❌ Error de conexión:");
  console.error(`   ${error.message}`);
  console.error("\n💡 Posibles soluciones:");
  console.error("   1. Verifica que la contraseña es correcta");
  console.error("   2. Comprueba que Supabase está activo");
  console.error("   3. Verifica que el Session Pooler está habilitado");
  process.exit(1);
}
