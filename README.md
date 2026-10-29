# Módulo de gestión de trámites

## Requisitos previos

Para ejecutar el proyecto se necesita:

- Node.js y npm.
- PostgreSQL.
- Un editor de código, como Visual Studio Code.

## 1. Configurar la base de datos

Crear una base de datos en PostgreSQL con el nombre `tramites_db`.

Después, ejecutar el archivo `backend/schema.sql` para crear la tabla necesaria.

También se puede hacer desde la terminal:

```bash
createdb -U postgres tramites_db
psql -U postgres -d tramites_db -f backend/schema.sql
```

## 2. Ejecutar el backend

Abrir una terminal en la carpeta principal del proyecto e ingresar:

```bash
cd backend
npm install
```

Crear un archivo `.env` dentro de `backend`, tomando como referencia `.env.example`.

Configurar las siguientes variables:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:TU_CONTRASEÑA@localhost:5432/tramites_db
JWT_SECRET=d376e90d3fbacaac17513b062f3927bdffb3be2d0062f1693af63f564db4db0b
CORS_ORIGIN=http://localhost:5173
```

Para ejecutar las pruebas:

```bash
npm test
```

Para iniciar el servidor:

```bash
npm start
```

La API se ejecuta en `http://localhost:3000`.

## 3. Ejecutar el frontend

Abrir otra terminal y acceder a la carpeta del frontend:

```bash
cd frontend
npm install
npm run dev
```

Abrir en el navegador:

`http://localhost:5173`

La página contiene un listado de trámites, un filtro por estatus y un campo para ingresar un JWT de prueba.

## 4. Generar un JWT de prueba

Desde la carpeta `backend`, con el archivo `.env` configurado, ejecutar:

```bash
node -e "require('dotenv').config();console.log(require('jsonwebtoken').sign({id:1,rol:'admin'},process.env.JWT_SECRET,{expiresIn:'1h'}))"
```

Copiar el token generado e introducirlo en el campo correspondiente de la interfaz.

Los roles utilizados son `admin`, `supervisor` y `empleado`. Solo `admin` y `supervisor` pueden modificar el estatus de un trámite.

## 5. Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/tramites` | Registrar un trámite |
| GET | `/api/tramites` | Consultar trámites con paginación y filtros |
| PATCH | `/api/tramites/:id/estatus` | Actualizar el estatus de un trámite |

Los endpoints requieren autenticación mediante JWT.

## 6. Validaciones implementadas

Se valida el formato de la CURP y que el tipo de trámite corresponda a uno de los valores permitidos: `TRASPASO`, `RETIRO` o `CONSTANCIA`.

La consulta de trámites permite utilizar paginación y filtro por estatus.

Los trámites con estatus `CANCELADO` o `CONCLUIDO` no pueden volver a modificarse.

Las consultas a PostgreSQL utilizan parámetros para evitar inyección SQL.

## 7. Pruebas

Las pruebas unitarias se encuentran en `backend/tests/tramites.service.test.js`.

Se verifican cuatro situaciones:

1. No permitir actualizar un trámite cancelado.
2. No permitir actualizar un trámite concluido.
3. Responder correctamente cuando el trámite no existe.
4. Permitir la actualización de un trámite cuyo estado admite cambios.