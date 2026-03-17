# 🚗 BMW Mod Tracker

A full-stack app to track modifications on your BMW — user auth, car management, and a Kanban board for mods with drag and drop.

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Spring Boot 3, Java 21, Spring Security, JWT |
| Database | PostgreSQL (Supabase) |
| Frontend | React + Vite, dnd-kit |
| Backend hosting | Railway |
| Frontend hosting | Vercel |

## Project Structure

```
bmw-mod-tracker/
├── backend/    # Spring Boot REST API
└── frontend/   # React app
```

---

## Local Development

### Backend

1. Copy the example properties file:
   ```bash
   cp backend/src/main/resources/application.properties.example \
      backend/src/main/resources/application.properties
   ```
2. Fill in your Supabase URL, password, and JWT secret (`openssl rand -base64 32`)
3. Run:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Frontend

1. Copy the env file:
   ```bash
   cp frontend/.env.example frontend/.env.local
   ```
2. Install and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Open `http://localhost:5173`

---

## Deployment

### Backend → Railway

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **New Project → Deploy from GitHub repo**
3. Select this repo and set the **root directory** to `backend`
4. Add these environment variables in Railway's dashboard:

   | Variable | Value |
   |---|---|
   | `SPRING_DATASOURCE_URL` | `jdbc:postgresql://db.YOUR_REF.supabase.co:5432/postgres?sslmode=require` |
   | `SPRING_DATASOURCE_USERNAME` | `postgres` |
   | `SPRING_DATASOURCE_PASSWORD` | your Supabase password |
   | `JWT_SECRET` | output of `openssl rand -base64 32` |
   | `JWT_EXPIRATION_MS` | `86400000` |

5. Railway will build and deploy automatically. Copy the generated URL (e.g. `https://bmw-mod-tracker.up.railway.app`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New Project → Import** this repo
3. Set **root directory** to `frontend`
4. Add this environment variable:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | your Railway backend URL (no trailing slash) |

5. Click **Deploy** — Vercel handles the rest

---

## API Endpoints

```
POST /api/auth/register     — create account
POST /api/auth/login        — login, returns JWT

GET    /api/cars            — list your cars
POST   /api/cars            — add a car
PUT    /api/cars/:id        — update a car
DELETE /api/cars/:id        — delete a car

GET    /api/cars/:id/mods          — list mods for a car
POST   /api/cars/:id/mods          — add a mod
PUT    /api/cars/:id/mods/:modId   — update a mod
PATCH  /api/cars/:id/mods/:modId/status — move mod to new column
DELETE /api/cars/:id/mods/:modId   — delete a mod
```

## Roadmap

- [x] User registration & login (JWT)
- [x] Add/manage cars
- [x] Kanban board (Wishlist → Planned → In Progress → Done)
- [x] Drag and drop mod cards
- [x] Cost tracking per mod
- [ ] Deploy to Railway + Vercel
- [ ] Mod photos / receipts
- [ ] Total spend dashboard
