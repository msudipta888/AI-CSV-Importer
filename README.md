# GrowEasy AI CSV Importer

An intelligent, AI-powered lead importer application designed to map arbitrary CRM lead CSV files (with dynamic column structures and names) to GrowEasy's fixed CRM schema. The system uses a client-side parser to render real-time file previews and chunks record batches sequentially to the backend, where a Google Gemini AI model processes, restructures, and cleans lead parameters under strict validation rules.

---

## Technical Architecture & Design Decisions

- **100% Stateless**: The application does not utilize databases, Redis caches, or temporary disk directories. All files are parsed in the client browser memory, transmitted as raw JSON batches, processed inside Google Gemini's context, and immediately returned inside the HTTP lifecycle.
- **Rate-Limit Guarding (Gemini Free Tier)**: The backend service processes lead lists in sequential chunks (size 15-20) with a 2-second delay between requests. This protects the service from encountering `429 (Too Many Requests)` rate-limiting exceptions under Gemini's free usage limits.
- **Fail-safe Recovery**: Incorporates a retry mechanism during AI extraction. If Gemini's JSON return structure fails to parse, it retries the extraction request once before marking that batch's records as skipped.
- **Swappable LLM Service**: The AI mapping adapter (`aiExtractor.js`) is decoupled and interfaces via a single function contract. Swapping Gemini for OpenAI, Anthropic, or local models only requires updating this single file.

---

## Applied Position
*   **Role**: **Software Developer (Full-Time)**
*   **Submission To**: varun@groweasy.ai

---

## Deployed Applications (Placeholders)
- **Frontend App (Vercel)**: [https://groweasy-csv-importer-frontend.vercel.app](https://groweasy-csv-importer-frontend.vercel.app)
- **Backend Service (Railway/Render)**: [https://groweasy-csv-importer-backend.onrender.com](https://groweasy-csv-importer-backend.onrender.com)
- **GitHub Repository**: [https://github.com/groweasy-importer/groweasy-csv-importer](https://github.com/groweasy-importer/groweasy-csv-importer)

---

## Environment Variables

### Backend (`backend/.env`)
Create a file at `backend/.env` with:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```
*Note: A free API key can be obtained directly from [Google AI Studio](https://aistudio.google.com/apikey).*

### Frontend (`frontend/.env.local`)
Create a file at `frontend/.env.local` with:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
```

---

## How to Run Locally

Ensure you have [Node.js (v18+)](https://nodejs.org) installed on your system.

1.  **Launch Backend**:
    ```bash
    cd backend
    npm install
    # Set your GEMINI_API_KEY inside backend/.env
    npm run dev
    ```
    The server will boot up at `http://localhost:5000`.

2.  **Launch Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The Next.js client will spin up at `http://localhost:3000`.
