# AI-Powered Social Media Scheduler
<small>An advanced, full-stack application designed to help users compose, generate, and schedule social media posts across multiple platforms. Leveraging Google Gemini for content generation, Leonardo.ai for image generation, Cloudinary for persistent media hosting, and Zernio for multi-platform social media integration (Twitter, LinkedIn, Facebook, Instagram).</small>
---
## 🚀 Key Features
* **AI Post Composer:** Write compelling post copy instantly using built-in Google Gemini AI.
* **AI Image Generator:** Generate custom visuals for posts using Leonardo AI directly inside the editor.
* **Multi-Platform Sync:** Connect Twitter/X, LinkedIn, Facebook, and Instagram accounts via **Zernio**.
* **Smart Scheduling:** Pick a future date and time to automatically publish posts.
* **Media Uploads:** Seamless media uploads and persistent cloud hosting using Cloudinary.
* **Analytics & Activity logs:** Detailed history showing when posts are scheduled, published, or if any connection failures occur.
---
## 🛠️ Technology Stack
### Frontend (`/client`)
* **Core:** React 19, TypeScript, Vite
* **Styling:** Tailwind CSS (v4)
* **Icons:** Lucide React, Simple Icons
* **Routing & State:** React Router Dom (v7), React Hot Toast, Context API
### Backend (`/server`)
* **Core:** Node.js, Express (v5), TypeScript
* **Database:** MongoDB (via Mongoose ODM)
* **Background Workers:** Node-cron (for checking and publishing scheduled posts)
* **Security:** JSON Web Tokens (JWT), Bcrypt password hashing
* **File Uploads:** Multer (local fallback) & Cloudinary SDK
---
## 📂 Directory Structure
```text
social-scheduler/
├── client/                 # React SPA (Vite + TS)
│   ├── src/
│   │   ├── api/            # Axios API config
│   │   ├── components/     # Reusable layout and home elements
│   │   ├── context/        # Auth and Theme providers
│   │   ├── pages/          # Login, Register, Dashboard, AI Composer, Accounts
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # Express REST API (Node + TS)
│   ├── config/             # DB connection, Cloudinary, Env configurations
│   ├── controllers/        # Auth, Social auth, Posts, Activity controllers
│   ├── models/             # Mongoose schemas (User, Account, Post, ActivityLog)
│   ├── routes/             # Express routes
│   ├── services/           # Background scheduler service
│   ├── server.ts           # Server entry point
│   └── tsconfig.json
```
---
## 💻 Local Development Setup
### Prerequisites
* [Node.js](https://nodejs.org/) (v18+ recommended)
* MongoDB (Local instance or Atlas cloud cluster)
### Step 1: Install Dependencies
Install dependencies in both the `client` and `server` folders:
```bash
# Install client dependencies
cd client
npm install
# Install server dependencies
cd ../server
npm install
```
### Step 2: Configure Environment Variables
Create a `.env` file in the `/server` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key
ZERNIO_API_KEY=your_zernio_api_key
GEMINI_API_KEY=your_gemini_api_key
LEONARDO_API_KEY=your_leonardo_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```
Create a `.env` file in the `/client` directory:
```env
VITE_API_BASE_URL=http://localhost:3000
```
### Step 3: Run the Application Locally
Open two terminal windows:
**In Terminal 1 (Run Backend Server):**
```bash
cd server
npm run server
```
**In Terminal 2 (Run Vite Frontend):**
```bash
cd client
npm run dev
```
Visit `http://localhost:5173` to view the application.
---
## 🌐 Production Deployment
This project is fully structured for modern cloud hosting services:
### 1. Backend Deployment (Render / Railway)
* **Root Directory:** `server`
* **Build Command:** `npm install && npm run build`
* **Start Command:** `node dist/server.js`
* **Environment Variables:** Provide all values specified in `/server/.env`.
* **Keep-Alive (Render Free Tier):** Set up a ping every 10 minutes on [cron-job.org](https://cron-job.org/) to keep the server awake so that the background scheduler worker publishes posts on time.
### 2. Frontend Deployment (Vercel / Netlify)
* **Framework Preset:** `Vite`
* **Root Directory:** `client`
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Environment Variables:** Set `VITE_API_BASE_URL` to your deployed backend URL (e.g., `https://your-backend-api.onrender.com`).
