# RigIt Platform - Milestone 1

Complete full-stack scaffolding marketplace platform with Docker-based architecture.

## 🏗️ Architecture

- **PostgreSQL 15 + PostGIS** (Docker container)
- **Node.js + Express.js** Backend API (Docker container)
- **React 19 + TypeScript + Vite** Frontend (Docker container)

---

## 🚀 How to Run the Project

### Step 1: Prerequisites

Before starting, ensure you have:

- **Docker Desktop** installed and running
  - Download from: https://www.docker.com/products/docker-desktop
  - Make sure Docker Desktop is running (you should see the Docker icon in your system tray)
- **Git** (optional, if cloning from repository)

### Step 2: Get Supabase Credentials

You need a Supabase account for authentication:

1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (SUPABASE_URL)
   - **anon/public key** (SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

### Step 3: Configure Environment Variables

1. **Navigate to the project directory:**
   ```bash
   cd "D:\Kashif Ali\Arslan"
   ```

2. **Create `.env` file from the example:**
   ```bash
   # On Windows (PowerShell)
   Copy-Item .env.example .env
   
   # On Mac/Linux
   cp .env.example .env
   ```

3. **Edit `.env` file** and replace the placeholder values with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   DATABASE_URL=postgresql://rigit_user:rigit_password@db:5432/rigit_db
   
   NODE_ENV=development
   PORT=5000
   
   VITE_API_URL=http://localhost:5000
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### Step 4: Start Docker Containers

**First time setup (builds containers):**
```bash
docker-compose up --build
```

**Subsequent runs (if containers already built):**
```bash
docker-compose up
```

**Run in background (detached mode):**
```bash
docker-compose up -d
```

This will start three containers:
- **PostgreSQL** with PostGIS extension (port 5432)
- **Backend API** (port 5000)
- **Frontend** (port 5173)

**Wait for all containers to be healthy** - you'll see messages like:
```
✅ Connected to PostgreSQL database
🚀 Backend server running on port 5000
VITE v5.x.x  ready in xxx ms
```

### Step 5: Run Database Migrations

**Open a new terminal window** (keep Docker running) and run:

```bash
cd "D:\Kashif Ali\Arslan"
docker-compose exec backend npm run migrate
```

You should see output like:
```
Batch 1 run: 9 migrations
```

This creates all 8 database tables plus enables PostGIS extension.

### Step 6: Access the Application

Once everything is running:

- **Frontend Application:** http://localhost:5173
  - Open in your browser
  - You should see the landing page

- **Backend API:** http://localhost:5000
  - Health check: http://localhost:5000/health
  - API endpoints: http://localhost:5000/api/*

- **PostgreSQL Database:**
  - Host: `localhost`
  - Port: `5432`
  - User: `rigit_user`
  - Password: `rigit_password`
  - Database: `rigit_db`

### Step 7: Test the Application

1. **Open** http://localhost:5173 in your browser
2. **Click "Register"** to create a new account
3. **Fill in the registration form** (email, password, name)
4. **After registration**, you'll be redirected to the dashboard
5. **Explore** the different pages:
   - Dashboard
   - Projects
   - Suppliers
   - Profile

---

## 🛑 Stopping the Project

**Stop all containers:**
```bash
docker-compose down
```

**Stop and remove all data (⚠️ deletes database):**
```bash
docker-compose down -v
```

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

---

## 🔧 Troubleshooting

### Issue: Port already in use

**Error:** `port is already allocated` or `address already in use`

**Solution:**
- Stop any services using ports 5000, 5173, or 5432
- Or change ports in `docker-compose.yml`

### Issue: Database connection failed

**Error:** `Connection refused` or `database does not exist`

**Solution:**
1. Make sure PostgreSQL container is running: `docker-compose ps`
2. Wait for health check to pass (takes ~30 seconds)
3. Check logs: `docker-compose logs db`

### Issue: Migrations fail

**Error:** `relation already exists` or migration errors

**Solution:**
```bash
# Rollback migrations
docker-compose exec backend npm run migrate:rollback

# Then run again
docker-compose exec backend npm run migrate
```

### Issue: Frontend can't connect to backend

**Error:** `Network Error` or `CORS error`

**Solution:**
1. Check backend is running: http://localhost:5000/health
2. Verify `VITE_API_URL` in `.env` matches backend URL
3. Restart frontend container: `docker-compose restart frontend`

### Issue: Authentication not working

**Error:** `Invalid token` or Supabase errors

**Solution:**
1. Verify Supabase credentials in `.env` are correct
2. Check Supabase project is active
3. Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` match your Supabase project

---

## 📁 Project Structure

```
Arslan/
├── docker-compose.yml       # Orchestrates all containers
├── .env.example             # Example environment variables
├── .env                     # Your actual environment variables (create this)
├── .gitignore
├── README.md
├── backend/                 # Node.js + Express API
│   ├── Dockerfile
│   ├── package.json
│   ├── knexfile.js
│   └── src/
│       ├── index.js         # Entry point
│       ├── config/          # Database & Supabase config
│       ├── middleware/      # Auth, CORS, error handling
│       ├── routes/          # API route definitions
│       ├── controllers/    # Route handlers
│       └── db/
│           └── migrations/  # Database migrations
└── frontend/                # React + TypeScript + Vite
    ├── Dockerfile
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── src/
        ├── main.tsx         # Entry point
        ├── App.tsx          # Main app component
        ├── pages/           # Page components
        ├── components/      # Reusable components
        ├── contexts/        # React contexts (Auth)
        └── api/             # API client setup
```

---

## 🗄️ Database Schema

The platform uses PostgreSQL with PostGIS extension. Eight core tables:

1. **users** - User accounts linked to Supabase Auth
2. **suppliers** - Supplier profiles with service areas (PostGIS geometry)
3. **projects** - Customer projects with locations (PostGIS point)
4. **scaffold_configurations** - 3D scaffold configs (JSONB)
5. **quotes** - Supplier quotes for projects
6. **bookings** - Confirmed bookings
7. **payments** - Payment records (Stripe integration ready)
8. **reviews** - Customer reviews for suppliers

**Access database directly:**
```bash
docker-compose exec db psql -U rigit_user -d rigit_db
```

---

## 🔌 API Routes

All API routes are prefixed with `/api`:

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/users` - List users (admin only)
- `GET /api/suppliers` - List suppliers
- `GET /api/projects` - List projects (user's own)
- `GET /api/quotes` - List quotes
- `GET /api/bookings` - List bookings
- `GET /api/payments` - List payments

**Test API:**
```bash
# Health check
curl http://localhost:5000/health

# Get suppliers (public)
curl http://localhost:5000/api/suppliers
```

---

## 🔐 Authentication Flow

1. User registers/logs in via Supabase Auth
2. Supabase returns JWT token
3. Frontend stores token in localStorage
4. Frontend sends token in `Authorization: Bearer <token>` header
5. Backend verifies token with Supabase
6. Backend creates/updates user record in PostgreSQL
7. User can access protected routes

---

## 🛠️ Development Commands

### Backend

```bash
# Enter backend container
docker-compose exec backend sh

# Run migrations
docker-compose exec backend npm run migrate

# View backend logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend
```

### Frontend

```bash
# Enter frontend container
docker-compose exec frontend sh

# View frontend logs
docker-compose logs -f frontend

# Restart frontend
docker-compose restart frontend
```

### Database

```bash
# Connect to PostgreSQL
docker-compose exec db psql -U rigit_user -d rigit_db

# View database logs
docker-compose logs -f db

# Backup database
docker-compose exec db pg_dump -U rigit_user rigit_db > backup.sql
```

---

## 📦 Tech Stack

### Backend
- Node.js 18 + Express.js
- PostgreSQL 15 + PostGIS
- Knex.js (migrations & queries)
- Supabase Auth (JWT)
- CORS, Morgan (logging)

### Frontend
- React 19
- TypeScript
- Vite
- React Router v6
- Axios
- Tailwind CSS

---

## 🎯 Milestone 1 Deliverables

✅ Docker Compose with PostgreSQL + Backend + Frontend  
✅ PostgreSQL container with PostGIS extension  
✅ All 8 database tables via Knex migrations  
✅ Backend API with 8 route groups (stub implementations)  
✅ Supabase Auth middleware protecting routes  
✅ React frontend with routing and 8 pages  
✅ User registration/login flow working end-to-end  
✅ Hot-reload enabled for development  

---

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `DATABASE_URL` | PostgreSQL connection string | Auto-set |
| `NODE_ENV` | Environment (development/production) | Optional |
| `PORT` | Backend port (default: 5000) | Optional |
| `VITE_API_URL` | Backend API URL for frontend | Yes |
| `VITE_SUPABASE_URL` | Supabase URL for frontend | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase key for frontend | Yes |

---

## 🐳 Docker Commands Cheat Sheet

```bash
# Start everything
docker-compose up --build

# Start in background
docker-compose up -d

# Stop everything
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Rebuild a specific service
docker-compose build backend

# Execute command in container
docker-compose exec backend npm run migrate
```

---

## 📄 License

Proprietary - RigIt Platform

## 🤝 Support

For issues or questions, please contact the development team.
