# Guía de Despliegue en Replit

## Introducción

Esta guía te ayudará a desplegar la aplicación de gestión de flota de furgonetas en **Replit**, permitiendo que tus compañeros accedan desde cualquier ordenador con conexión a internet.

## Requisitos Previos

- Cuenta de **Replit** (gratuita en [replit.com](https://replit.com))
- Acceso a la **cadena de conexión de Supabase** (DATABASE_URL)
- Cuenta de **GitHub** (opcional, pero recomendado)

## Paso 1: Crear un Nuevo Replit

### Opción A: Desde GitHub (Recomendado)

1. Ve a [replit.com](https://replit.com) e inicia sesión
2. Haz clic en **"+ Create"** en la esquina superior izquierda
3. Selecciona **"Import from GitHub"**
4. Pega la URL de tu repositorio de GitHub
5. Haz clic en **"Import"**

Replit clonará automáticamente el código y detectará que es un proyecto Node.js.

### Opción B: Subir Archivos Manualmente

1. Ve a [replit.com](https://replit.com) e inicia sesión
2. Haz clic en **"+ Create"** y selecciona **"Node.js"**
3. Descarga el código del proyecto desde Manus
4. Sube los archivos a Replit usando el gestor de archivos

## Paso 2: Configurar Variables de Entorno

Una vez que el proyecto esté en Replit, necesitas configurar la conexión a Supabase:

1. En el panel izquierdo de Replit, haz clic en el ícono de **"Secrets"** (candado)
2. Haz clic en **"Add new secret"**
3. Añade la siguiente variable:
   - **Key:** `DATABASE_URL`
   - **Value:** Tu cadena de conexión de Supabase
     ```
     postgresql://postgres:datosIrds_2026@db.tpjwuewgjwpttcagescw.supabase.co:5432/postgres
     ```
4. Haz clic en **"Add Secret"**

### Variables Adicionales (Automáticas)

Las siguientes variables se configuran automáticamente en Replit:
- `VITE_APP_ID`: ID de la aplicación Manus
- `OAUTH_SERVER_URL`: URL del servidor OAuth
- `JWT_SECRET`: Clave secreta para sesiones

Si necesitas configurarlas manualmente, contacta con el equipo de Manus.

## Paso 3: Instalar Dependencias y Desplegar

1. Haz clic en el botón **"Run"** en la parte superior
2. Replit ejecutará automáticamente el comando en `.replit`:
   ```bash
   pnpm install && pnpm build && pnpm start
   ```

Este proceso puede tardar 2-5 minutos la primera vez.

3. Una vez completado, verás un mensaje como:
   ```
   Server running on http://localhost:3000/
   ```

## Paso 4: Obtener la URL Pública

Replit genera automáticamente una URL pública para tu aplicación:

1. En la parte superior derecha, verás un botón **"Share"**
2. Haz clic en él y copia la URL pública (algo como `https://fleet-management-app.username.repl.co`)
3. Esta es la URL que compartirás con tus compañeros

## Paso 5: Compartir con Compañeros

Envía a tus compañeros:

1. **La URL pública** de Replit
2. **Instrucciones de acceso:**
   - Abre la URL en el navegador
   - Haz clic en **"Sign in"**
   - Auténtica con tu cuenta de Manus
   - ¡Listo! Tendrás acceso al dashboard

## Consideraciones Importantes

### Rendimiento

- En el plan gratuito de Replit, la aplicación puede ser un poco lenta
- Si la aplicación no se usa durante 30 minutos, Replit la pone en "hibernación"
- Cuando alguien acceda nuevamente, tardará unos segundos en reactivarse

### Seguridad

- La URL pública es accesible por cualquiera que la conozca
- Recomendamos compartir solo con compañeros de confianza
- Todas las operaciones se registran en la base de datos de Supabase

### Límites

- **Almacenamiento:** 500 MB (suficiente para miles de registros)
- **Ancho de banda:** Limitado pero suficiente para uso interno
- **CPU:** Compartido, pero adecuado para equipos pequeños

## Solución de Problemas

### La aplicación no inicia

1. Verifica que `DATABASE_URL` esté correctamente configurado en Secrets
2. Haz clic en **"Stop"** y luego **"Run"** nuevamente
3. Revisa los logs en la consola de Replit

### Error de conexión a Supabase

1. Verifica que la cadena de conexión es correcta
2. Asegúrate de que Supabase está activo y accesible
3. Prueba la conexión desde la consola de Supabase

### La aplicación es muy lenta

1. Esto es normal en el plan gratuito de Replit
2. Considera actualizar a un plan de pago si necesitas mejor rendimiento
3. O usa Railway/Render como alternativa

### Los compañeros no pueden acceder

1. Verifica que la URL es correcta
2. Asegúrate de que Replit está ejecutándose (botón "Run" activo)
3. Comprueba que los compañeros tienen conexión a internet

## Actualizar la Aplicación

Si haces cambios en el código:

1. **Desde GitHub:** Replit se sincroniza automáticamente (en algunos casos)
2. **Manualmente:** Sube los archivos nuevos a través del gestor de archivos
3. Haz clic en **"Stop"** y luego **"Run"** para reiniciar

## Alternativas

Si Replit no te funciona bien, considera:

- **Railway:** Mejor rendimiento, pero requiere tarjeta de crédito
- **Render:** Similar a Railway, muy fácil de usar
- **Manus:** Ya está funcionando, sin necesidad de cambios

## Soporte

Si tienes problemas:

1. Revisa los logs en la consola de Replit
2. Verifica que todas las variables de entorno están configuradas
3. Contacta con el equipo de Manus para soporte técnico

---

**¡Listo!** Tu aplicación está ahora accesible para todos tus compañeros. Disfruta de la gestión de tu flota de furgonetas.
