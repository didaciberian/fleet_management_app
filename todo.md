# Fleet Management App - TODO

## Fase 1: Configuració Inicial
- [x] Crear fitxer todo.md i estructura del projecte
- [x] Actualitzar package.json amb dependències necessàries

## Fase 2: Base de Dades
- [x] Dissenyar esquema PostgreSQL per a Supabase
- [x] Crear taula TABLA_VANS amb tots els camps
- [x] Crear taula VANS_AVERIAS amb relació foreign key
- [x] Documentar esquema i instruccions de Supabase

## Fase 3: Procediments tRPC per a Furgonetes
- [x] Crear esquema Zod per a validació de TABLA_VANS
- [x] Implementar procediment tRPC per llistar furgonetes
- [x] Implementar procediment tRPC per crear furgoneta
- [x] Implementar procediment tRPC per actualitzar furgoneta
- [x] Implementar procediment tRPC per eliminar furgoneta
- [x] Implementar procediment tRPC per obtenir furgoneta per ID
- [x] Implementar procediment tRPC per cercar furgonetes

## Fase 4: Procediments tRPC per a Averies
- [x] Crear esquema Zod per a validació de VANS_AVERIAS
- [x] Implementar procediment tRPC per llistar averies
- [x] Implementar procediment tRPC per crear averia
- [x] Implementar procediment tRPC per actualitzar averia
- [x] Implementar procediment tRPC per eliminar averia
- [x] Implementar procediment tRPC per obtenir averies d'una furgoneta

## Fase 5: Dashboard
- [x] Crear component Dashboard principal
- [x] Implementar mètrica: Total furgonetes actives/inactives
- [x] Implementar mètrica: Furgonetes amb ITV próxima a caducar (30 dies)
- [x] Implementar mètrica: Furgonetes actualmente en taller
- [x] Implementar gràfic de distribució per empresa
- [x] Implementar gràfic de distribució per tipus
- [x] Crear cards de mètriques amb disseny elegant

## Fase 6: Gestió de Furgonetes
- [x] Crear component VansList amb taula de furgonetes
- [x] Implementar taula amb columnes: Matrícula, Model, Empresa, Estat, ITV
- [x] Crear component VanForm per crear/editar furgonetes
- [x] Implementar validació de formulari amb Zod
- [x] Crear component VanDetail per veure detalls complerts
- [x] Implementar opcions CRUD (afegir, editar, eliminar)
- [x] Afegir alertes visuals per ITV caducada/próxima

## Fase 7: Gestió d'Averies
- [x] Crear component AveriasList amb llistat d'averies
- [x] Crear component AveriaForm per crear/editar averies
- [x] Implementar validació de formulari amb Zod
- [x] Integrar averies en vista detallada de furgoneta
- [x] Implementar opcions CRUD per averies
- [x] Afegir alertes visuals per averies actives

## Fase 8: Cerca i Filtrat
- [x] Implementar barra de cerca per matrícula
- [x] Implementar filtrat per VIN
- [x] Implementar filtrat per empresa
- [x] Implementar filtrat per estat
- [x] Implementar filtrat per estat ITV
- [x] Crear component de filtres avançats

## Fase 9: Documentació
- [x] Crear guia de configuració de Supabase
- [x] Documentar esquema de base de dades
- [x] Crear instruccions de desplegament
- [x] Documentar variables d'entorn necessàries

## Fase 10: Testing i Finalització
- [x] Testejar CRUD de furgonetes
- [x] Testejar CRUD d'averies
- [x] Testejar dashboard i mètriques
- [x] Testejar cerca i filtrat
- [x] Testejar alertes visuals
- [x] Crear checkpoint final

## Fase 11: Configuració de Supabase
- [x] Obtenir cadena de connexió de Supabase
- [x] Configurar DATABASE_URL en variables d'entorn
- [x] Verificar connexió a la base de dades
- [x] Provar autenticació i accés a l'aplicació

## Fase 12: Despliegue en Replit
- [x] Crear archivo .replit con configuración
- [x] Crear archivo replit.nix con dependencias
- [x] Crear documentación de despliegue en Replit
- [x] Probar despliegue en Replit
- [x] Verificar acceso desde múltiples ordenadores
- [x] Crear guía para compañeros

## Fase 13: Restricción de Acceso por Dominio de Email
- [x] Implementar validación de dominio @iberianrd.es en el backend
- [x] Crear página de acceso denegado
- [x] Testar restricción con emails válidos e inválidos
- [x] Crear checkpoint con restricción de acceso

## Fase 14: Solución de Error OAuth
- [x] Diagnosticar error de OAuth callback
- [x] Verificar conexión a Supabase
- [x] Solucionar problema de autenticación
- [x] Crear página de login simple con autenticación por contraseña
- [x] Implementar procedimiento tRPC para login
- [x] Implementar almacenamiento de sessionToken en localStorage
- [x] Configurar rutas protegidas con verificación de autenticación
- [ ] Resolver problema de caché del navegador (preview muestra login correcto, pero navegador muestra página antigua)
- [ ] Testar login correctamente en navegador

## Fase 15: Funcionalidades de Gestión de Flota
- [ ] Crear página de inicio/dashboard
- [ ] Implementar gestión de vehículos
- [ ] Implementar gestión de conductores
- [ ] Implementar seguimiento de rutas
- [ ] Implementar seguimiento de combustible
- [ ] Implementar gestión de mantenimiento
- [ ] Crear reportes y análisis
