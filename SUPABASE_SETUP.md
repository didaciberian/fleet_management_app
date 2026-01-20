# Guía de Configuración de Supabase para Fleet Management App

## Introducción

Esta guía te ayudará a configurar la base de datos PostgreSQL en Supabase para la aplicación de gestión de flota de furgonetas. Supabase es una plataforma de backend de código abierto que proporciona una base de datos PostgreSQL completamente gestionada con autenticación integrada.

## Paso 1: Crear una Cuenta en Supabase

1. Visita [supabase.com](https://supabase.com)
2. Haz clic en **Sign Up** (Registrarse)
3. Puedes registrarte con tu correo electrónico o usar GitHub
4. Completa el proceso de verificación de correo electrónico

## Paso 2: Crear un Nuevo Proyecto

1. Una vez en el dashboard de Supabase, haz clic en **New Project**
2. Ingresa los siguientes datos:
   - **Project Name**: `fleet-management-app` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña fuerte (guárdala en un lugar seguro)
   - **Region**: Selecciona la región más cercana a tu ubicación
   - **Pricing Plan**: Selecciona el plan **Free** para comenzar

3. Haz clic en **Create new project**
4. Espera a que Supabase inicialice tu proyecto (esto puede tomar unos minutos)

## Paso 3: Obtener las Credenciales de Conexión

1. Una vez que el proyecto esté listo, ve a **Project Settings** (Configuración del Proyecto)
2. En el menú izquierdo, selecciona **Database**
3. Aquí encontrarás:
   - **Host**: La dirección del servidor
   - **Port**: El puerto (generalmente 5432)
   - **Database**: El nombre de la base de datos
   - **User**: El usuario de la base de datos
   - **Password**: La contraseña que configuraste

4. Copia la cadena de conexión (Connection String) en formato URI:
   ```
   postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
   ```

## Paso 4: Crear las Tablas en Supabase

### Opción A: Usar SQL Editor (Recomendado)

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Haz clic en **New Query**
3. Copia y pega el siguiente SQL:

```sql
-- Crear tabla TABLA_VANS
CREATE TABLE TABLA_VANS (
  ID SERIAL PRIMARY KEY,
  ACTIVA BOOLEAN NOT NULL DEFAULT true,
  VIN VARCHAR(17) NOT NULL UNIQUE,
  MODELO VARCHAR(100) NOT NULL,
  MATRICULA VARCHAR(20) NOT NULL UNIQUE,
  NUM_POLIZA VARCHAR(50),
  TIPO VARCHAR(50) NOT NULL,
  EMPRESA VARCHAR(100) NOT NULL,
  NUM_LLAVE INTEGER,
  ESTADO VARCHAR(50) NOT NULL,
  ESTADO_ITV BOOLEAN NOT NULL DEFAULT true,
  FECHA_ITV DATE,
  AVERIA BOOLEAN NOT NULL DEFAULT false,
  FECHA_ACTIVACION DATE,
  FECHA_DEFLEETING DATE,
  FECHA_FIN_CONTRATO DATE,
  OBSERVACIONES TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Crear tabla VANS_AVERIAS
CREATE TABLE VANS_AVERIAS (
  ID_AVERIA SERIAL PRIMARY KEY,
  ID INTEGER NOT NULL REFERENCES TABLA_VANS(ID) ON DELETE CASCADE,
  CAUSA_AVERIA TEXT NOT NULL,
  FECHA_AVERIA DATE NOT NULL,
  TALLER VARCHAR(100),
  FECHA_ENTRADA_TALLER DATE,
  ESTIMACION_SALIDA DATE,
  FECHA_SALIDA_TALLER DATE,
  OBSERVACIONES_AVERIA TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_tabla_vans_empresa ON TABLA_VANS(EMPRESA);
CREATE INDEX idx_tabla_vans_estado ON TABLA_VANS(ESTADO);
CREATE INDEX idx_tabla_vans_activa ON TABLA_VANS(ACTIVA);
CREATE INDEX idx_vans_averias_id ON VANS_AVERIAS(ID);
```

4. Haz clic en **Run** para ejecutar el SQL

### Opción B: Usar Migrations (Para Desarrollo)

Si estás usando la estructura de Drizzle ORM del proyecto:

1. Asegúrate de que tienes la variable de entorno `DATABASE_URL` configurada
2. Ejecuta: `pnpm db:push`

## Paso 5: Configurar Variables de Entorno

En tu proyecto local, crea un archivo `.env.local` con las siguientes variables:

```env
# Supabase Connection
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]

# Manus OAuth (Estos se proporcionan automáticamente en Manus)
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
JWT_SECRET=your_jwt_secret
OWNER_OPEN_ID=your_owner_id
OWNER_NAME=Your Name
```

## Paso 6: Habilitar Row Level Security (RLS) - Opcional pero Recomendado

Para mayor seguridad, puedes habilitar Row Level Security:

1. Ve a **Authentication** en el dashboard de Supabase
2. En la sección **Policies**, haz clic en **Enable RLS**
3. Crea políticas de acceso según tus necesidades

## Paso 7: Realizar Backup Automático

1. Ve a **Project Settings** → **Backups**
2. Habilita **Automated Backups**
3. Selecciona la frecuencia de backup (diaria es recomendada)

## Conexión desde la Aplicación

La aplicación se conectará automáticamente a Supabase usando la variable `DATABASE_URL`. El servidor Express + tRPC manejará todas las operaciones de base de datos.

### Flujo de Conexión:

1. **Frontend (React)** → Llama a procedimientos tRPC
2. **Backend (Express + tRPC)** → Se conecta a Supabase usando `DATABASE_URL`
3. **Supabase (PostgreSQL)** → Ejecuta las consultas y devuelve los datos
4. **Backend** → Devuelve los datos al Frontend a través de tRPC

## Troubleshooting

### Error: "Connection refused"
- Verifica que la `DATABASE_URL` sea correcta
- Comprueba que tu IP está en la lista blanca de Supabase (si es necesario)
- Asegúrate de que el proyecto está activo en Supabase

### Error: "Permission denied"
- Verifica que el usuario de la base de datos tiene los permisos correctos
- Comprueba que las tablas se crearon correctamente

### Error: "Table does not exist"
- Ejecuta nuevamente el SQL para crear las tablas
- Verifica que estás usando la base de datos correcta

## Monitoreo y Mantenimiento

### Ver el Uso de la Base de Datos:
1. Ve a **Project Settings** → **Usage**
2. Aquí puedes ver:
   - Almacenamiento utilizado
   - Número de conexiones
   - Transacciones por segundo

### Optimizar Consultas:
1. Ve a **SQL Editor**
2. Usa la herramienta **Query Performance** para analizar consultas lentas
3. Crea índices adicionales si es necesario

## Recursos Adicionales

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Guía de Drizzle ORM](https://orm.drizzle.team/)

## Soporte

Si encuentras problemas durante la configuración:

1. Consulta la [documentación de Supabase](https://supabase.com/docs)
2. Visita el [foro de Supabase](https://github.com/supabase/supabase/discussions)
3. Contacta con el equipo de soporte de Supabase

---

**Nota**: Esta guía asume que estás usando Supabase con PostgreSQL. Si necesitas usar otra base de datos, consulta la documentación correspondiente.
