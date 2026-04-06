# Planteles San Cirano URBA 2026

Dashboard deportivo para seguir los planteles y resultados de San Cirano en los torneos URBA 2026.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS + React Router v6 + TanStack Query v5 |
| Backend | Node.js + Express + TypeScript + Prisma |
| Base de datos | SQLite (dev) / PostgreSQL (prod) |

---

## Estructura del proyecto

```
san-cirano-urba-2026/
├── frontend/        # SPA React
└── server/          # API / BFF + persistencia
```

---

## Setup rápido

### Requisitos

- Node.js 18+
- npm 9+

### 1. Clonar y configurar variables de entorno

```bash
cp .env.example .env
cp server/.env.example server/.env
```

### 2. Instalar dependencias

```bash
# Frontend
cd frontend && npm install

# Server
cd ../server && npm install
```

### 3. Inicializar base de datos

```bash
cd server
npx prisma migrate dev --name init
```

### 4. Sincronizar datos desde API (seed inicial)

```bash
cd server
npm run sync
```

Esto consume las APIs de URBA para todos los torneos configurados y guarda los datos en SQLite.

### 5. Levantar el proyecto

En dos terminales:

```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Frontend disponible en: http://localhost:5173  
Server disponible en: http://localhost:3001

---

## Configuración de fuente de datos

En `server/.env` podés elegir entre consumir la API externa o la base de datos local:

```env
DATA_SOURCE=api    # "api" | "db"
```

El frontend consulta siempre al server propio. El server decide internamente si sale a la API de URBA o sirve desde la DB.

---

## Endpoints del server

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/championship/:id` | Campeonato con rounds y partidos |
| GET | `/api/positions/:id` | Tabla de posiciones |
| POST | `/api/sync` | Sincronizar todos los torneos a DB |
| POST | `/api/sync/:id` | Sincronizar un torneo específico |

---

## Torneos configurados

Ver `frontend/src/config/tournaments.ts` y `server/src/config/tournaments.ts`.

Para agregar un torneo: simplemente agregar una entrada en el array `tournaments` con su `id`, `slug`, `name` y `trackedTeamName`.

---

## Rutas del frontend

| Ruta | Vista |
|---|---|
| `/` | Home con selector de torneo |
| `/torneo/:slug` | Detalle del torneo seleccionado |
| `/torneo/:slug/equipo/san-cirano` | Vista dedicada de San Cirano |
| `/torneo/:slug/posiciones` | Tabla de posiciones completa |

---

## Re-sincronización manual

```bash
cd server && npm run sync
```

O desde la UI con el botón "Sincronizar" (cuando `DATA_SOURCE=db`).

O via endpoint:

```bash
curl -X POST http://localhost:3001/api/sync
```
