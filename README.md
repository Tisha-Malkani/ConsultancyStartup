# NovaConsult Consultancy Startup Website

A commercial-style consulting platform for a supply chain and operations advisory startup. The project includes a React frontend and an Express/MongoDB backend with lead capture, ESG diagnostics, simulated case studies, insights content, and conceptual client/admin dashboards.

## What is included

- Homepage with positioning and value proposition
- About page with leadership and business credibility framing
- Services portfolio across supply chain, procurement, vendor development, Six Sigma, logistics, inventory, and ESG
- Industry solutions section
- Case studies and blog content backed by MongoDB
- Consultation booking flow
- ESG calculator with saved runs for logged-in users
- Client dashboard and consultant admin workspace

## Tech stack

- Frontend: React, Vite, Tailwind CSS, React Router, Recharts
- Backend: Express, Mongoose, JWT auth
- Database: MongoDB Atlas or local MongoDB

## Project structure

```text
frontend/   React application
backend/    Express API and MongoDB models
```

## Local setup

### 1. Backend

Copy the backend env template:

```bash
cp backend/.env.example backend/.env
```

Set at minimum:

- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_INVITE_CODE`
- `FRONTEND_URL`

Install and run:

```bash
cd backend
npm install
npm run dev
```

Optional seed data:

```bash
npm run data:import
```

### 2. Frontend

Copy the frontend env template:

```bash
cp frontend/.env.example frontend/.env
```

Set:

- `VITE_API_URL=http://localhost:5001/api`

Install and run:

```bash
cd frontend
npm install
npm run dev
```

## Production deployment checklist

### Frontend

- Deploy `frontend/` to Vercel or Netlify
- Set `VITE_API_URL` to your live backend API URL

### Backend

- Deploy `backend/` to Render, Railway, Fly.io, or your own VM/container
- Set `NODE_ENV=production`
- Set a strong `JWT_SECRET`
- Set a private `ADMIN_INVITE_CODE`
- Set `FRONTEND_URL` to your deployed frontend origin
- Set MongoDB and email service credentials in environment variables

### Security and deployment notes

- Public admin signup has been removed from the frontend
- Backend auth no longer falls back to demo secrets
- Production CORS is restricted by `FRONTEND_URL`
- Rate limiting is enabled on auth and booking endpoints
- Rotate all secrets before going live
- Do not commit real `.env` files

## Useful commands

From `frontend/`:

```bash
npm run dev
npm run build
npm run lint
```

From `backend/`:

```bash
npm run dev
npm start
npm run data:import
npm run data:destroy
```

## Submission positioning

This project is strongest when presented as a deployment-capable consulting platform prototype with commercial UX, real workflow coverage, and a backend-backed dashboard experience.
