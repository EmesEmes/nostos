# Supabase · NOSTOS

Guía para montar la base de datos desde cero. Sirve para el proyecto de desarrollo y para migrar al Supabase del cliente.

## 1. Crear el proyecto

- Nombre: `nostos`. Guardar la contraseña de la base de datos.
- Región: **East US (North Virginia)**, cerca de las funciones de Vercel (`iad1`).

## 2. Ejecutar el esquema

SQL Editor → pegar `supabase/schema.sql` → Run.

Crea las tablas, las políticas RLS y el bucket `media`.

Si hay archivos en `supabase/migrations/`, ejecutarlos después, en orden numérico.

Por último, `supabase/seed.sql` carga los datos iniciales: los 10 cantones, Chavezpamba y el autor principal. Se puede ejecutar más de una vez sin duplicar nada.

## 3. Autenticación y administradores

1. Authentication → Sign In / Providers → desactivar **Allow new users to sign up**.
2. Authentication → Users → Add user → correo y contraseña, marcar **Auto Confirm User**.
3. SQL Editor:

```sql
insert into public.admins (user_id)
select id from auth.users where email in ('correo@ejemplo.com');
```

## 4. Variables de entorno

Project Settings → API Keys (publishable y secret) y Data API (URL).

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

Van en `.env.local` y en Vercel → Settings → Environment Variables. La secret key nunca lleva `NEXT_PUBLIC_`.

## 5. Tipos de TypeScript

El project id es la parte de la URL antes de `.supabase.co`.

```powershell
npx supabase login
npx supabase gen types typescript --project-id <project-id> | Out-File -Encoding utf8 lib/supabase/database.types.ts
```

Repetir cada vez que cambie el esquema.

## Cambios al esquema

`schema.sql` es el esquema inicial y no se edita. Cada cambio posterior va en un archivo nuevo dentro de `supabase/migrations/` (`001_descripcion.sql`, `002_...`), para poder reproducirlo tal cual en otro proyecto.

## Migrar al Supabase del cliente

1. Crear su proyecto y repetir los pasos 1 a 5 con sus claves y su project id.
2. Datos: si el proyecto del cliente arranca vacío, basta con `seed.sql` (paso 2). Para llevar también lo cargado desde el panel, exportar desde el proyecto de desarrollo e importar en el nuevo.

```powershell
npx supabase db dump --db-url "<cadena-de-conexión-desarrollo>" --data-only -f datos.sql
```

El comando necesita Docker Desktop abierto. La cadena de conexión está en el botón **Connect** del proyecto. Ejecutar `datos.sql` en el SQL Editor del proyecto nuevo.

3. Archivos: descargar el contenido del bucket `media` y subirlo al nuevo con las mismas rutas.
4. Usuarios: crear de nuevo las cuentas del paso 3 en el proyecto del cliente.
5. Actualizar las variables de entorno en Vercel y hacer un redeploy.
