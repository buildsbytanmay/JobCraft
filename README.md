# JobCraft — AI Job Description Builder

A complete, production-grade **MERN Stack (MongoDB, Express.js, React.js, Node.js)** web application integrated with **Google Gemini AI** to generate, customize, copy, and store professional recruitment job descriptions.

Reorganized into a clean, conventional MERN project structure with separate `frontend/` and `backend/` folders.

---

## 🏛️ High-Level MERN Architecture

```text
                USER / BROWSER
                      │
                      ▼
            ┌──────────────────┐
            │  React Frontend  │  (Port 3000 / Vite)
            │    frontend/     │
            └────────┬─────────┘
                     │
                     │ REST API Requests (Axios)
                     ▼
            ┌──────────────────┐
            │ Express Backend  │  (Port 5000 / Node.js)
            │     backend/     │
            └───────┬─────┬────┘
                    │     │
              ┌─────┘     └──────┐
              ▼                  ▼
       ┌─────────────┐    ┌─────────────┐
       │   MongoDB   │    │ Gemini AI   │
       │   (Atlas)   │    │   (v2 SDK)  │
       └─────────────┘    └─────────────┘
```

---

## 📂 Project Structure

```text
JobCraft/
│
├── frontend/                     # React Single Page Application (Client)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx        # Top navigation and brand header
│   │   │   ├── JobForm.tsx       # Input form with validation & quick presets
│   │   │   ├── JobDescriptionEditor.tsx # Editable markdown draft area & copy/save
│   │   │   ├── JobCard.tsx       # Saved job card with safe inline delete
│   │   │   ├── JobList.tsx       # Filterable & searchable job gallery
│   │   │   ├── JobViewModal.tsx  # Full modal view with clipboard copy & delete
│   │   │   └── Toast.tsx         # Notification alerts
│   │   ├── services/
│   │   │   └── api.ts            # Axios REST API client
│   │   ├── types.ts              # TypeScript interfaces for frontend state
│   │   ├── App.tsx               # Main application container
│   │   ├── main.tsx              # React DOM mount point
│   │   └── index.css             # Tailwind CSS styles
│   ├── public/                   # Static assets & icons
│   ├── index.html                # HTML entry template
│   ├── package.json              # Frontend dependencies (React, Axios, Vite, etc.)
│   ├── vite.config.ts            # Vite bundler configuration & API proxy
│   ├── tsconfig.json             # Frontend TypeScript config
│   ├── .env.example              # Frontend environment variables template
│   └── .gitignore                # Frontend git ignore rules
│
├── backend/                      # Node.js & Express REST API (Server)
│   ├── config/
│   │   └── db.ts                 # MongoDB connection & in-memory fallback
│   ├── controllers/
│   │   └── jobController.ts      # API controllers (generate, save, get, delete)
│   ├── models/
│   │   └── JobDescription.ts     # Mongoose schema & validation
│   ├── routes/
│   │   └── jobRoutes.ts          # Express REST routes (/api/jobs)
│   ├── services/
│   │   └── aiService.ts          # Gemini AI integration with model fallback chain
│   ├── middleware/
│   │   └── errorMiddleware.ts    # Global API error handler
│   ├── server.ts                 # Express entry point
│   ├── package.json              # Backend dependencies (Express, Mongoose, Gemini SDK)
│   ├── tsconfig.json             # Backend TypeScript config
│   ├── .env.example              # Backend environment variables template
│   └── .gitignore                # Backend git ignore rules
│
├── README.md                     # Project documentation & setup instructions
├── ARCHITECTURE.md               # System architecture & data flow diagrams
└── .gitignore                    # Root git ignore rules
```

---

## ⚡ Quick Start & Running Locally

### Prerequisites
- **Node.js**: v18+ 
- **npm**: v9+
- **Google Gemini API Key**: from [Google AI Studio](https://aistudio.google.com/)
- **MongoDB** *(Optional)*: Free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster URI (defaults gracefully to in-memory persistence if offline).

---

### Step 1: Start the Backend (Terminal 1)

```bash
cd backend
npm install
cp .env.example .env
```

Configure your `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobcraft?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:
```bash
npm run dev
```
> The backend server will run at: `http://localhost:5000`

---

### Step 2: Start the Frontend (Terminal 2)

```bash
cd frontend
npm install
cp .env.example .env
```

Configure your `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```
> The React frontend will run at: `http://localhost:3000` (or `http://localhost:5173`)

---

## 📡 REST API Reference

All requests to the backend are routed through `/api/jobs`:

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/jobs/generate` | Generate concise job description with Gemini AI | `{ jobTitle, company, experience, skills, location, employmentType }` |
| `POST` | `/api/jobs` | Save job description to database | `{ jobTitle, company, experience, skills, location, employmentType, description }` |
| `GET` | `/api/jobs` | Retrieve all saved job descriptions (newest first) | *None* |
| `GET` | `/api/jobs/:id` | Retrieve a single job description by ID | *None* |
| `DELETE`| `/api/jobs/:id` | Delete a job description by ID | *None* |
| `GET` | `/api/health` | Service health & database connectivity check | *None* |

---

## 🔒 Security & Best Practices

1. **Strict Client/Server Separation**:
   - `GEMINI_API_KEY` and `MONGODB_URI` are strictly stored on the server-side (`backend/`).
   - The React client never handles secret keys or makes direct third-party SDK calls.
2. **Iframe & Sandboxed Environment Compatibility**:
   - Deletion uses safe inline state transitions instead of blocking browser dialogs (`window.confirm`).
3. **Resilient AI Pipeline**:
   - Automatic fallback chains (`gemini-3.1-flash-lite` -> `gemini-3.7-flash` -> `gemini-flash-latest`) handle temporary high demand.
4. **Structured Grounding Rules**:
   - Prompt engineering prevents AI hallucinations (no invented perks, benefits, or corporate marketing fluff).

---

## 📄 License
MIT License.
