# Paytm Clone

A full-stack Paytm clone application featuring user authentication, account balance tracking, and secure peer-to-peer money transfers using MongoDB transactions.

## Architecture

- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose with ACID transactions), Zod validation, JWT authentication, and bcrypt.
- **Frontend**: React (Vite), TypeScript, Tailwind CSS.

## Project Structure

```
paytm/
├── backend/            # Express TypeScript API server
│   ├── src/            # Source code (routes, db schema, auth middleware)
│   ├── .env.example    # Environment variable template
│   ├── package.json
│   └── tsconfig.json
├── frontend/           # React + Vite frontend
│   ├── src/            # UI components, pages (Dashboard, SendMoney, etc.)
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB connection URI (e.g. MongoDB Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and supply your MONGO_URL and JWT_SECRET
npm run build
npm start # or development runner
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
