# 🌐 KnowSphere — AI-Powered Historical Knowledge Platform

A full-stack application to explore the naming history and historical context of any topic — cities, countries, food, science, and more.

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | Angular 18 (standalone)       |
| Styling   | Bootstrap 5.3 + Bootstrap Icons|
| AI        | Google Gemini 1.5 Flash       |
| Backend   | Node.js + Express.js          |
| Database  | MongoDB + Mongoose            |

---

## Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (`mongod`) OR a MongoDB Atlas connection string
- A free [Google Gemini API key](https://aistudio.google.com/app/apikey)

---

### 1. Backend Setup

```bash
cd backend
npm install

# Create .env from example
cp .env.example .env
# Edit .env — add your MONGODB_URI and GEMINI_API_KEY

# Seed the database (6 pre-built topics)
npm run seed

# Start the API server
npm run dev          # development (nodemon)
# OR
npm start            # production
```

Backend runs on **http://localhost:3000**

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on **http://localhost:4200**

The `proxy.conf.json` automatically proxies `/api/*` → `http://localhost:3000/api/*`

---

## Environment Variables (.env)

```env
MONGODB_URI=mongodb://localhost:27017/knowsphere
GEMINI_API_KEY=your_key_from_aistudio.google.com
PORT=3000
NODE_ENV=development
```

---

## Features

### 🔍 AI-Powered Search
- Search any topic in plain language
- Auto-generates knowledge panels via **Gemini AI** when no result is found
- Returns AI summary of search results

### 📚 Knowledge Panels
Every topic includes:
- **Name Change Timeline** — expandable accordion with language, meaning, context, sources
- **Historical Context** — era-by-era breakdown with dates
- **Quick Facts** — structured table
- **AI Insight** — unique AI observation about naming patterns
- **Related Topics** — cross-reference network

### 💬 Comments & Ratings
- 5-star rating component
- Add/view comments per topic
- Like comments

### 🗂 6 Pre-seeded Topics
Pune, Istanbul, Sri Lanka, Mumbai, Kolkata, Beijing — each with 4–8 name changes, 4–5 historical context entries, related topics, and quick facts.

---

## API Endpoints

| Method | Endpoint                               | Description                        |
|--------|----------------------------------------|------------------------------------|
| GET    | `/api/topics/featured`                 | Get featured topics                |
| GET    | `/api/topics/trending`                 | Get trending topics (by searchCount)|
| GET    | `/api/topics/:slug`                    | Get full topic by slug             |
| GET    | `/api/topics/category/:name`           | Filter topics by category          |
| GET    | `/api/search?q=query&category=opt`     | Search + Gemini AI generation      |
| POST   | `/api/topics/:slug/comments`           | Add a comment                      |
| POST   | `/api/topics/:slug/comments/:id/like`  | Like a comment                     |
| POST   | `/api/ai/search-summary`               | Generate AI search summary         |
| POST   | `/api/ai/topic-insight`                | Generate AI topic insight          |
| GET    | `/api/health`                          | Health check                       |

---

## Project Structure

```
knowsphere/
├── backend/
│   ├── server.js              # Express app entry
│   ├── seed.js                # Database seeder (6 topics)
│   ├── .env.example           # Environment template
│   ├── models/
│   │   └── Topic.js           # Mongoose schema
│   ├── routes/
│   │   ├── topics.js          # CRUD + comments
│   │   ├── search.js          # Search + AI generation
│   │   └── ai.js              # AI endpoints
│   └── middleware/
│       └── gemini.js          # Gemini AI service
│
└── frontend/
    ├── angular.json
    ├── proxy.conf.json        # Dev proxy → backend
    └── src/
        ├── main.ts
        ├── styles.css         # Global styles + Inter font
        └── app/
            ├── app.component.ts
            ├── app.config.ts
            ├── app.routes.ts
            ├── models/
            │   └── topic.model.ts
            ├── services/
            │   └── api.service.ts
            ├── environments/
            │   └── environment.ts
            ├── components/
            │   ├── navbar/
            │   ├── footer/
            │   └── star-rating/
            └── pages/
                ├── home/          # Hero, search, featured, trending
                ├── search/        # AI search results + sidebar
                ├── topic-detail/  # Timeline, context, facts, comments
                ├── categories/    # 12 category grid with expand
                ├── about/         # Mission, tech stack, CTA
                └── not-found/
```

---

## How Gemini AI Works

1. User searches "Peking Duck"
2. No match found in MongoDB
3. Backend calls `generateTopicData("Peking Duck")` via Gemini
4. Gemini returns structured JSON with name changes, historical context, quick facts
5. Topic is saved to MongoDB for future searches
6. AI summary generated and returned with results

Every subsequent search for the same topic uses the cached MongoDB record.

---

## License
MIT
